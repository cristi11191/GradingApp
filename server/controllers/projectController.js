const { PrismaClient } = require('@prisma/client');
const { sendProjectNotifications } = require('./notifyController');
const path = require("path");
const prisma = new PrismaClient();

const createProject = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;
        const email = req.user.email; // Extract email from middleware that decodes JWT

        // Extract URLs from the request body
        const urls = Object.keys(req.body)
            .filter((key) => key.startsWith('url_'))
            .map((key) => req.body[key]);

        // Extract collaborators from the request body
        const collaborators = Object.keys(req.body)
            .filter((key) => key.startsWith('collaborator_'))
            .map((key) => req.body[key]);
        // Ensure the requesting user's email is added as a collaborator
        if (!collaborators.includes(email)) {
            collaborators.push(email);
        }

        // Extract file attachments from multer
        const fileAttachments = req.files.map((file) => ({
            attachmentURL: `/uploads/projects/${file.filename}`,
            fileType: file.mimetype.split('/')[0], // Extract the file type (e.g., "image", "application")
        }));

        // Create the project in the database
        const project = await prisma.project.create({
            data: {
                title,
                description,
                deadline: new Date(deadline),
                // Store URLs in attachmentURL as a comma-separated string
                attachmentURL: urls.join(','),

                // Add collaborators
                collaborators: {
                    create: collaborators.map((email) => ({ email })),
                },

                // Add deliverables for file attachments only
                deliverables: {
                    create: fileAttachments.map((file) => ({
                        title: 'Uploaded File',
                        description: 'Uploaded file attachment',
                        attachmentURL: file.attachmentURL,
                        fileType: file.fileType, // Use the extracted file type
                    })),
                },
            },
        });

        const collaboratorsEmail= collaborators.filter(collaboratorEmail => collaboratorEmail !== email);
        await sendProjectNotifications(collaboratorsEmail, title);

        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create project', error: error.message });
    }
};


const getProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Fetch project by ID with related collaborators and deliverables
        const project = await prisma.project.findUnique({
            where: { id: parseInt(projectId, 10) }, // Ensure projectId is an integer
            include: {
                collaborators: true, // Fetch all collaborators
                deliverables: true,  // Fetch all deliverables
            },
        });

        if (!project) {
            return res.status(200).json({ message: 'Project not found' });
        }

        res.status(200).json({ project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch project', error: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description, deadline } = req.body;
        const email = req.user.email; // Extract email from middleware that decodes JWT
        // Extract URLs and collaborators from the request body
        const urls = Object.keys(req.body)
            .filter((key) => key.startsWith('url_'))
            .map((key) => req.body[key]);

        const collaborators = Object.keys(req.body)
            .filter((key) => key.startsWith('collaborator_'))
            .map((key) => req.body[key]);
        // Ensure the requesting user's email is added as a collaborator
        if (!collaborators.includes(email)) {
            collaborators.push(email);
        }
        // Fetch the existing project
        const existingProject = await prisma.project.findUnique({
            where: { id: parseInt(projectId, 10) },
            include: { collaborators: true, deliverables: true },
        });

        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Get existing collaborator emails from the project
        const existingCollaborators = existingProject.collaborators.map((collab) => collab.email);

        // Find new collaborators (who are not in the existing list)
        const newCollaborators = collaborators.filter((collab) => !existingCollaborators.includes(collab));

        const datePrefix = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
        // Handle file uploads (call uploadFile logic)
        const newFileAttachments = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const { originalname, mimetype, path } = file;

                // Save metadata to the database
                const deliverable = await prisma.deliverable.create({
                    data: {
                        title: originalname, // Default to filename
                        description: req.body.description || '',
                        attachmentURL: `/uploads/projects/${datePrefix}-${originalname}`,
                        fileType: mimetype,
                        projectId: parseInt(projectId, 10),
                    },
                });

                newFileAttachments.push({
                    title: deliverable.title,
                    description: deliverable.description,
                    attachmentURL: deliverable.attachmentURL,
                    fileType: deliverable.fileType,
                    projectId: parseInt(projectId, 10),
                });
            }
        }

        // Combine new and existing files
        let existingFiles = [];
        if (req.body.files) {
            const files = Array.isArray(req.body.files) ? req.body.files : [req.body.files];

            // Process existing files metadata
            existingFiles = files
                .filter((file) => {
                    try {
                        JSON.parse(file); // Check if it's JSON
                        return true;
                    } catch (error) {
                        return false;
                    }
                })
                .map((file) => JSON.parse(file)); // Parse JSON
        }

        const allFiles = [...existingFiles, ...newFileAttachments];


        // Update the project data
        const updatedProject = await prisma.project.update({
            where: { id: parseInt(projectId, 10) },
            data: {
                title: title || existingProject.title,
                description: description || existingProject.description,
                deadline: deadline ? new Date(deadline) : existingProject.deadline,
                attachmentURL: urls.join(','),

                collaborators: {
                    deleteMany: {}, // Remove all existing collaborators
                    create: collaborators.map((email) => ({ email })), // Add new collaborators
                },

                deliverables: {
                    deleteMany: {}, // Remove all existing deliverables
                    create: allFiles.map((file) => ({
                        title: file.title || 'File',
                        description: file.description || 'Deliverable',
                        attachmentURL: file.attachmentURL,
                        fileType: file.fileType,
                    })),
                },
            },
        });

        await sendProjectNotifications(newCollaborators, title);
        res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Failed to update project', error: error.message });
    }
};


/**
 * Fetch the project where the given email is a collaborator.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const getProjectByCollaboratorEmail = async (req, res) => {
    const email = req.user.email; // Extract email from middleware that decodes JWT

    try {
        const project = await prisma.project.findFirst({
            where: {
                collaborators: {
                    some: {
                        email, // Check if the email exists in the collaborators
                    },
                },
            },
            include: {
                collaborators: true, // Include collaborator details
                deliverables: true, // Include deliverable details
                evaluations: true,  // Include evaluations details
            },
        });

        if (!project) {
            return res.status(200).json({ message: "No project found for this collaborator email" });
        }

        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching project", error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Fetch the project
        const project = await prisma.project.findUnique({
            where: { id: parseInt(projectId, 10) }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Delete related deliverables
        await prisma.deliverable.deleteMany({
            where: { projectId: parseInt(projectId, 10) },
        });

        // Delete related collaborators
        await prisma.collaborator.deleteMany({
            where: { projectId: parseInt(projectId, 10) },
        });

        // Delete the project
        await prisma.project.delete({
            where: { id: parseInt(projectId, 10) },
        });

        res.status(200).json({ message: "Project deleted successfully!" });
    } catch (error) {
        console.error("Error deleting project:", error.message);
        res.status(500).json({ message: "Failed to delete project", error: error.message });
    }
};

const getAllProjects = async (req, res) => {
    const email=req.user.email; //obtinem emailul userului
    try {
        const projects = await prisma.project.findMany({
            where: {
                collaborators: {
                    none:{
                        email,
                    },
                },
            },
            include: {
                collaborators: true,
                deliverables: true,
            },
        });

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error.message);
        res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
    }
};


module.exports = { createProject , getProject, updateProject ,getProjectByCollaboratorEmail , deleteProject, getAllProjects };
