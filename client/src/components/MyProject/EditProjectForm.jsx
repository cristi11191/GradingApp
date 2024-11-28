import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./EditProjectForm.css";

const EditProjectForm = ({ project, onSave, onCancel }) => {
    const [title, setTitle] = useState(project.title || "");
    const [description, setDescription] = useState(project.description || "");
    const [deadline, setDeadline] = useState(
        project.deadline ? project.deadline.split("T")[0] : ""
    );
    const [attachmentFiles, setAttachmentFiles] = useState([]); // Array pentru fișierele încărcate

    // Funcție pentru gestionarea fișierelor
    const onDrop = (acceptedFiles) => {
        console.log("Fișiere primite:", acceptedFiles);
        setAttachmentFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // Adaugă fișierele noi
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*,application/pdf", // Exemplu de tipuri acceptate
        multiple: true, // Permite fișiere multiple
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("deadline", new Date(deadline).toISOString());

        // Adaugă toate fișierele în FormData
        attachmentFiles.forEach((file, index) => {
            formData.append(`file_${index}`, file); // Creează câte un câmp pentru fiecare fișier
        });

        // Trimitere formular către server
        fetch("/api/project", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Proiect salvat:", data);
                onSave(data); // Callback pentru salvarea proiectului
            })
            .catch((error) => console.error("Eroare la salvare:", error));
    };

    const handleRemoveFile = (fileName) => {
        setAttachmentFiles((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileName)
        );
    };

    return (
        <form onSubmit={handleSubmit} className="edit-project-form">
            <div className="title-container">
                <label className="title-label">Title:</label>
                <input className="title-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="description-container">
                <label className="description-input">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div className="deadline-container">
                <label className="deadline-input">Deadline:</label>
                <input className="deadline-input"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
            </div>
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag & drop files here, or click to select</p>
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
