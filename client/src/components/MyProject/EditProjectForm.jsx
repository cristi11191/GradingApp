import React, { useState } from "react";
import './EditProjectForm.css'

const EditProjectForm = ({ project, onSave, onCancel }) => {
  const [title, setTitle] = useState(project.title || "");
  const [description, setDescription] = useState(project.description || "");
  const [deadline, setDeadline] = useState(project.deadline ? project.deadline.split("T")[0] : ""); // Asigură-te că deadline este valid
  const [attachmentURL, setAttachmentURL] = useState(project.attachmentURL || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      deadline: new Date(deadline).toISOString(), // Convertim data într-un format valid ISO
      attachmentURL,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Deadline:</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Attachment URL:</label>
        <input
          type="url"
          value={attachmentURL}
          onChange={(e) => setAttachmentURL(e.target.value)}
        />
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditProjectForm;
