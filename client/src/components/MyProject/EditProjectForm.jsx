import React, {useEffect, useState} from "react";
import { useDropzone } from "react-dropzone";
import CloseIcon from '@mui/icons-material/Close';
import { createProject, updateProject } from "../../services/apiProject"; // Import API functions
import "./EditProjectForm.css";
import {checkCollaboratorExists} from "../../services/apiCollaborators.js";

const CollaboratorsInput = ({ collaborators, setCollaborators, collaboratorStatus, setCollaboratorStatus }) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = async (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            const newCollaborator = inputValue.trim();
            const status = await checkCollaboratorExists(newCollaborator);
            console.log(`Status for ${newCollaborator}:`, status);

            setCollaborators((prev) => [...prev, newCollaborator]);
            setCollaboratorStatus((prev) => ({
                ...prev,
                [newCollaborator]: status,
            }));

            setInputValue("");
            e.preventDefault();
        }
    };

    const removeCollaborator = (index) => {
        const removedCollaborator = collaborators[index];
        setCollaborators(collaborators.filter((_, i) => i !== index));
        setCollaboratorStatus((prev) => {
            const newStatus = { ...prev };
            delete newStatus[removedCollaborator];
            return newStatus;
        });
    };

    return (
        <div className="collaborators-container">
            <label htmlFor="collaborators" className="collaborators-label">
                Collaborators:
            </label>
            <div className="tags-input">
                {collaborators.map((collaborator, index) => (
                    <span
                        key={index}
                        className={`tag ${
                            collaboratorStatus[collaborator] === "existent"
                                ? "tag-existent"
                                : "tag-inexistent"
                        }`}
                    >
                        {collaborator}
                        <button
                            className="icon"
                            type="button"
                            onClick={() => removeCollaborator(index)}
                        >
                            <CloseIcon />
                        </button>
                    </span>
                ))}
                <input
                    id="collaborators"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a collaborator"
                />
            </div>
        </div>
    );
};


// Componentă pentru inserarea URL-urilor
const UrlInput = ({ urls, setUrls }) => {
    const [urlInput, setUrlInput] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && urlInput.trim()) {
            setUrls([...urls, urlInput.trim()]);
            setUrlInput("");
            e.preventDefault();
        }
    };


    const removeUrl = (index) => {
        setUrls(urls.filter((_, i) => i !== index));
    };

    return (
        <div className="url-container">
            <label htmlFor="urls" className="url-label">Add URLs:</label>
            <div className="tags-input">
                {urls.map((url, index) => (
                    <span key={index} className="tag">
                        {url}
                        <button className="icon" type="button" onClick={() => removeUrl(index)}>
                            <CloseIcon/>
                        </button>
                    </span>
                ))}
                <input
                    id="urls"
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a URL"
                />
            </div>
        </div>
    );
};

// Componenta principală pentru editare
const EditProjectForm = ({ open, project, onCancel, currentUserEmail }) => {
    if (!open) return null;

    const [title, setTitle] = useState(project?.title || "");
    const [description, setDescription] = useState(project?.description || "");
    const [deadline, setDeadline] = useState(project?.deadline?.split("T")[0] || "");
    const [attachmentFiles, setAttachmentFiles] = useState([]);
    const [collaborators, setCollaborators] = useState(project?.collaborators || []);
    const [urls, setUrls] = useState(project?.urls || []);
    const [collaboratorStatus, setCollaboratorStatus] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Ensure the current user's email is included only once
    useEffect(() => {
        if (currentUserEmail && !collaborators.includes(currentUserEmail)) {
            setCollaborators((prev) => {
                if (!prev.includes(currentUserEmail)) {
                    return [...prev, currentUserEmail];
                }
                return prev;
            });

            setCollaboratorStatus((prev) => ({
                ...prev,
                [currentUserEmail]: "existent", // Set status for currentUserEmail
            }));
        }
    }, [currentUserEmail, collaborators]);

    // File handling
    const onDrop = (acceptedFiles) => {
        setAttachmentFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".gif"],
            "application/pdf": [".pdf"],
            "text/plain": [".txt"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "application/vnd.ms-excel": [".xls"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        },
        multiple: true,
    });

    const handleRemoveFile = (fileName) => {
        setAttachmentFiles((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileName)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("deadline", new Date(deadline).toISOString());
        collaborators.forEach((collaborator, index) =>
            formData.append(`collaborator_${index}`, collaborator)
        );
        urls.forEach((url, index) => formData.append(`url_${index}`, url));
        attachmentFiles.forEach((file) => formData.append("files", file));

        setIsLoading(true);
        try {
            if (project && project.id) {
                // Update existing project
                const updatedProject = await updateProject(project.id, formData);
                console.log("Project updated:", updatedProject);
                onCancel();
            } else {
                // Create new project
                const createdProject = await createProject(formData);
                console.log("Project created:", createdProject);
                onCancel();
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="edit-project-form">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="title-container">
                <label className="title-label">Title:</label>
                <input
                    className="title-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <CollaboratorsInput
                collaborators={collaborators}
                setCollaborators={setCollaborators}
                collaboratorStatus={collaboratorStatus}
                setCollaboratorStatus={setCollaboratorStatus}
            />
            <div className="description-container">
                <label className="description-label">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag & drop files here, or click to select</p>
            </div>
            <div className="deadline-container">
                <label className="deadline-label">Deadline:</label>
                <input
                    className="deadline-input"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
            </div>
            <div className="file-list">
                <h4>Selected Files:</h4>
                {attachmentFiles.length === 0 && <p>No files selected</p>}
                {attachmentFiles.map((file, index) => (
                    <div key={file.name || index} className="file-item">
                        <span>{file.name || file}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveFile(file.name || file)}
                            className="remove-file-btn"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="buttons">
                <button type="submit" className="btn-save" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditProjectForm;
