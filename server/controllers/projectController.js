const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProject = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;

        // Extract URLs from the request body
        const urls = Object.keys(req.body)
            .filter((key) => key.startsWith('url_'))
            .map((key) => req.body[key]);

        // Extract collaborators from the request body
        const collaborators = Object.keys(req.body)
            .filter((key) => key.startsWith('collaborator_'))
            .map((key) => req.body[key]);

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
                attachmentURL: fileAttachments.map((file) => file.attachmentURL).join(','), // Save file URLs as a comma-separated string
                collaborators: {
                    create: collaborators.map((email) => ({ email })),
                },
                deliverables: {
                    create: [
                        ...urls.map((url) => ({
                            title: 'Deliverable',
                            description: 'Uploaded URL',
                            attachmentURL: url,
                            fileType: 'url', // Specify file type for URLs
                        })),
                        ...fileAttachments.map((file) => ({
                            title: 'Uploaded File',
                            description: 'Uploaded file attachment',
                            attachmentURL: file.attachmentURL,
                            fileType: file.fileType, // Use the extracted file type
                        })),
                    ],
                },
            },
        });

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
            return res.status(404).json({ message: 'Project not found' });
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

        // Extract URLs and collaborators from the request body
        const urls = Object.keys(req.body)
            .filter((key) => key.startsWith('url_'))
            .map((key) => req.body[key]);

        const collaborators = Object.keys(req.body)
            .filter((key) => key.startsWith('collaborator_'))
            .map((key) => req.body[key]);

        // Extract file attachments from multer
        const fileAttachments = req.files.map((file) => ({
            attachmentURL: `/uploads/projects/${file.filename}`,
            fileType: file.mimetype.split('/')[0], // Extract file type
        }));

        // Fetch the existing project
        const existingProject = await prisma.project.findUnique({
            where: { id: parseInt(projectId, 10) },
            include: { collaborators: true, deliverables: true },
        });

        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update the project data
        const updatedProject = await prisma.project.update({
            where: { id: parseInt(projectId, 10) },
            data: {
                title: title || existingProject.title,
                description: description || existingProject.description,
                deadline: deadline ? new Date(deadline) : existingProject.deadline,
                attachmentURL: [
                    ...(existingProject.attachmentURL ? existingProject.attachmentURL.split(',') : []),
                    ...fileAttachments.map((file) => file.attachmentURL),
                ].join(','), // Append new attachments to existing ones
                // Replace collaborators
                collaborators: {
                    deleteMany: {}, // Remove all existing collaborators
                    create: collaborators.map((email) => ({ email })), // Add new collaborators
                },
                // Replace deliverables
                deliverables: {
                    deleteMany: {}, // Remove all existing deliverables
                    create: [
                        ...urls.map((url) => ({
                            title: 'Updated URL',
                            description: 'Updated URL deliverable',
                            attachmentURL: url,
                            fileType: 'url',
                        })),
                        ...fileAttachments.map((file) => ({
                            title: 'Updated File',
                            description: 'Updated file deliverable',
                            attachmentURL: file.attachmentURL,
                            fileType: file.fileType,
                        })),
                    ],
                },
            },
        });

        res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update project', error: error.message });
    }
};

module.exports = { createProject , getProject, updateProject  };
