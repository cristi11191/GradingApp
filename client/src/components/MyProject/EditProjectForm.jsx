import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import CloseIcon from '@mui/icons-material/Close';
import "./EditProjectForm.css";

const CollaboratorsInput = ({ collaborators, setCollaborators }) => {
    const [inputValue, setInputValue] = useState("");
    const [collaboratorStatus, setCollaboratorStatus] = useState({}); // Ex: { "user@example.com": "existent" }

    const handleKeyDown = async (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            const newCollaborator = inputValue.trim();
            const status = await checkCollaboratorExists(newCollaborator); // Verificăm starea
            setCollaborators([...collaborators, newCollaborator]);
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

    // Simulare API pentru verificarea colaboratorului
    const checkCollaboratorExists = async (collaborator) => {
        // Înlocuiește cu un apel real API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Math.random() > 0.5 ? "existent" : "inexistent"); // Random pentru demo
            }, 500);
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
                        <button className="icon"
                            type="button"
                            onClick={() => removeCollaborator(index)}>
                            <CloseIcon/>

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
const EditProjectForm = ({ open, project, onSave, onCancel }) => {
    if (!open) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [title, setTitle] = useState(project.title || "");
    const [description, setDescription] = useState(project.description || "");
    const [deadline, setDeadline] = useState(project.deadline ? project.deadline.split("T")[0] : "");
    const [attachmentFiles, setAttachmentFiles] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [urls, setUrls] = useState([]); // Stat pentru URL-uri

    // Funcție pentru gestionarea fișierelor
    const onDrop = (acceptedFiles) => {
        setAttachmentFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
            'application/pdf': ['.pdf']
        },
        multiple: true,
    });

    const handleRemoveFile = (fileName) => {
        setAttachmentFiles((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileName)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("deadline", new Date(deadline).toISOString());

        // Adaugă colaboratori
        collaborators.forEach((collaborator, index) => {
            formData.append(`collaborator_${index}`, collaborator);
        });

        // Adaugă URL-uri
        urls.forEach((url, index) => {
            formData.append(`url_${index}`, url);
        });

        // Adaugă fișiere
        attachmentFiles.forEach((file, index) => {
            formData.append(`file_${index}`, file);
        });

        // Trimitere formular către server
        fetch("/api/project", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Proiect salvat:", data);
                onSave(data); // Callback pentru salvare
            })
            .catch((error) => console.error("Eroare la salvare:", error));
    };

    return (
        <form onSubmit={handleSubmit} className="edit-project-form">
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
            <UrlInput
                urls={urls}
                setUrls={setUrls}
            />
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
                {attachmentFiles.map((file) => (
                    <div key={file.name} className="file-item">
                        <span>{file.name}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveFile(file.name)}
                            className="remove-file-btn"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="buttons">
                <button type="submit" className="btn-save">Save</button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditProjectForm;
