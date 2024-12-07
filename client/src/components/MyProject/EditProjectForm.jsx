import React, {useEffect, useState, useRef} from "react";
import { useDropzone } from "react-dropzone";
import CloseIcon from '@mui/icons-material/Close';
import { createProject, updateProject } from "../../services/apiProject"; // Import API functions
import "./EditProjectForm.css";
import {checkCollaboratorExists, checkCollaboratorsAvailability} from "../../services/apiCollaborators.jsx";
import {color} from "framer-motion";
import {green, red, yellow} from "@mui/material/colors";

const CollaboratorsInput = ({ collaborators, setCollaborators, collaboratorStatus, setCollaboratorStatus }) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = async (e) => {

        if (e.key === "Enter" && inputValue.trim()) {
            const newCollaborator = { email: inputValue.trim() };

            // Verificăm dacă colaboratorul a fost deja adăugat
            if (collaborators.some((collab) => collab.email === newCollaborator.email)) {
                setInputValue(""); // Clear input if duplicate
                return;
            }

            // Verificăm existența colaboratorului în sistem
            const existenceStatus = await checkCollaboratorExists(newCollaborator.email);

            // Verificăm disponibilitatea colaboratorului (dacă este deja asociat cu un alt proiect)
            const availabilityStatus = await checkCollaboratorsAvailability([newCollaborator.email]);

            // Găsim obiectul din array corespunzător email-ului
            const emailStatus = availabilityStatus.find(
                (status) => status.email === newCollaborator.email
            );

            // Determinăm disponibilitatea colaboratorului
            const isAvailable = emailStatus.available; // Default la `false` dacă nu este găsit
            setCollaborators((prev) => [...prev, newCollaborator]);

            // Setăm statusurile
            setCollaboratorStatus((prev) => ({
                ...prev,
                [newCollaborator.email]: {
                    existence: existenceStatus,
                    availability: isAvailable ? "available" : "unavailable",
                },
            }));

            // Resetăm inputul
            setInputValue("");
            e.preventDefault();
        }
    };

    const removeCollaborator = (index) => {
        const removedCollaborator = collaborators[index];
        setCollaborators(collaborators.filter((_, i) => i !== index));
        setCollaboratorStatus((prev) => {
            const newStatus = { ...prev };
            delete newStatus[removedCollaborator.email];
            return newStatus;
        });
    };

    return (
        <div className="collaborators-container">
            <label htmlFor="collaborators" className="collaborators-label">Collaborators:</label>
            <div className="tags-input">
                {collaborators.map((collaborator, index) => (
                    <span
                        key={collaborator.id || index}
                        className={`tag ${
                            collaboratorStatus[collaborator.email]?.availability === "unavailable"
                                ? "tag-unavailable" 
                                : collaboratorStatus[collaborator.email]?.existence === "inexistent"
                                    ? "tag-inexistent" 
                                    : "tag-existent" 
                        }`}
                    >
                        {collaborator.email}
                        <button
                            className="icon"
                            type="button"
                            onClick={() => removeCollaborator(index)}
                        >
                            <CloseIcon className="close-icon" />
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
                    className={collaboratorStatus[inputValue.trim()]?.existence === "inexistent" ? "warning" : ""}
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
            if (urls.includes(urlInput.trim())) {
                setUrlInput(""); // Clear input if duplicate
                return;
            }
            setUrls((prev) => [...prev, urlInput.trim()]);
            setUrlInput("");
            e.preventDefault();
        }
    };

    const removeUrl = (index) => {
        setUrls((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="url-container">
            <label htmlFor="urls" className="url-label">Add URLs:</label>
            <div className="tags-input">
                {urls.map((url, index) => (
                    <span key={index} className="tag">
                        {url}
                        <button className="icon" type="button" onClick={() => removeUrl(index)}>
                            <CloseIcon className="close-icon" />
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
const EditProjectForm = ({ open, project, onCancel, onSave,  currentUserEmail }) => {
    if (!open) return null;

    const [title, setTitle] = useState(project?.title || "");
    const [description, setDescription] = useState(project?.description || "");
    const [deadline, setDeadline] = useState(project?.deadline?.split("T")[0] || "");
    const [existingFiles, setExistingFiles] = useState(project?.deliverables || []); // List of existing files
    const [collaborators, setCollaborators] = useState(project?.collaborators || []);
    const [urls, setUrls] = useState(project?.attachmentURL?.split(',') || []);
    const [collaboratorStatus, setCollaboratorStatus] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [attachmentFiles, setAttachmentFiles] = useState([]);
    const errorRef = useRef(null); // Referința pentru eroare
    // Starea pentru a controla vizibilitatea legendei
    const [isLegendVisible, setIsLegendVisible] = useState(false);

    // Funcția care comută vizibilitatea legendei
    const toggleLegendVisibility = () => {
        setIsLegendVisible(!isLegendVisible);
    };

    // Ensure the current user's email is included only once
    useEffect(() => {
        if (currentUserEmail) {
            setCollaborators((prevCollaborators) => {
                // Check if currentUserEmail is already present
                const isAlreadyAdded = prevCollaborators.some(
                    (collab) => collab.email === currentUserEmail
                );
                if (!isAlreadyAdded) {
                    return [...prevCollaborators, { email: currentUserEmail }];
                }
                return prevCollaborators;
            });

            setCollaboratorStatus((prevStatus) => ({
                ...prevStatus,
                [currentUserEmail]: "existent",
            }));
        }

        // Only trigger this when `currentUserEmail` changes, not `collaborators`
    }, [currentUserEmail, setCollaborators, setCollaboratorStatus]);



    // Check the existence of collaborators
    useEffect(() => {
        const checkCollaboratorsExistence = async () => {
            const updatedStatus = { ...collaboratorStatus };

            for (const collaborator of collaborators) {
                if (!updatedStatus[collaborator.email]) {
                    const status = await checkCollaboratorExists(collaborator.email);
                    updatedStatus[collaborator.email] = status;
                }
            }

            setCollaboratorStatus(updatedStatus);
        };

        if (collaborators.length > 0) {
            checkCollaboratorsExistence();
        }
    }, [collaborators]);

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

    const handleRemoveFile = (index) => {
        setAttachmentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleRemoveExistingFile = (index) => {
        setExistingFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all collaborators are available
        const unavailableCollaborators = collaborators.filter(
            (collaborator) =>
                collaboratorStatus[collaborator.email]?.availability === "unavailable"
        );

        if (unavailableCollaborators.length > 0) {
            setErrorMessage(
                `Cannot create the project because the following collaborators are unavailable: ${unavailableCollaborators
                    .map((collab) => collab.email)
                    .join(", ")}`
            );
            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center", // Poziționează eroarea în centrul viewport-ului
                });
            }
            return;
        }
        // Reinitialize FormData to ensure no stale data remains
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("deadline", new Date(deadline).toISOString());

        // Add collaborators without duplicates
        collaborators.forEach((collaborator, index) => {
            formData.append(`collaborator_${index}`, collaborator.email);
        });

        // Add only the currently active URLs
        const uniqueUrls = Array.from(new Set(urls)); // Ensure no duplicate URLs
        uniqueUrls.forEach((url, index) => {
            formData.append(`url_${index}`, url);
        });
        const allFiles = [
            ...existingFiles.map((file) => ({ ...file, isExisting: true })), // Mark existing files
            ...attachmentFiles.map((file) => ({ file, isExisting: false })), // Mark new files
        ];

        // Add merged files to FormData
        allFiles.forEach((fileObj) => {
            if (fileObj.isExisting) {
                // For existing files, pass their JSON representation
                formData.append("files", JSON.stringify(fileObj));
            } else {
                // For new files, append the actual file object
                formData.append("files", fileObj.file);
            }
        });

        setIsLoading(true);
        try {
            if (project && project.id) {
                // Update existing project
                const updatedProject = await updateProject(project.id, formData);
                console.log("Project updated:", updatedProject);
            } else {
                // Create new project
                const createdProject = await createProject(formData);
                console.log("Project created:", createdProject);
            }
            onCancel();
            window.location.reload(); // Refresh the page
        } catch (error) {
            if (error.response && error.response.data && error.response.data.unavailableCollaborators) {
                setErrorMessage(
                    `The following collaborators are unavailable: ${error.response.data.unavailableCollaborators
                        .map((collab) => collab.email)
                        .join(", ")}`
                );
            } else {
                setErrorMessage(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const preventEnterSubmit = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };


    return (
        <form onSubmit={handleSubmit} className="edit-project-form">
            {errorMessage && <p ref={errorRef} className="error-message">{errorMessage}</p>}
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

            <button type="button" onClick={toggleLegendVisibility} className="info-button">
                Info
            </button>

            {isLegendVisible && (
                <div className="legend">
                    <p style={{ color: 'black' }}>Legend:</p>
                    <p style={{ color: 'green' }}>
                        Green indicates that the email is found in the users database.
                    </p>
                    <p style={{ color: 'red' }}>
                        Red indicates that the email is not found in the users database.
                    </p>
                    <p style={{ color: 'yellow' }}>
                        Yellow indicates that the user is part of a project.
                    </p>
                </div>
            )}
            <div className="description-container">
                <label className="description-label">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
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
            <UrlInput
                urls={urls}
                setUrls={setUrls}
            />
            <div className="existing-files">
                <h4>Existing Files:</h4>
                {existingFiles.length === 0 && <p>No existing files</p>}
                {existingFiles.map((file, index) => (
                    <div key={file.id || index} className="file-item">
                        <span>{file.attachmentURL ? file.attachmentURL.split('/').pop() : "Unknown File"}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveExistingFile(index)}
                            className="remove-file-btn"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag & drop files here, or click to select</p>
            </div>
            <div className="file-list">
                <h4>New Files:</h4>
                {attachmentFiles.length === 0 && <p>No new files</p>}
                {attachmentFiles.map((file, index) => (
                    <div key={file.name || index} className="file-item">
                        <span>{file.name || file}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
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
