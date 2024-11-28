import React, { useState, useEffect } from "react";
import axios from "axios";
import EditProjectForm from "./EditProjectForm.jsx";
import CollaboratorsList from "./CollaboratorsList.jsx";
import DeliverablesList from "./DeliverablesList.jsx";
import EvaluationsList from "./EvaluationsList.jsx";
import './MyProject.css';

const MyProject = () => {
  const [project, setProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get("/api/project/1")
      .then((response) => {
        if (!response.data) {
          setProject(null); // ...Setează null dacă nu există proiect
        } else {
          setProject(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching project data:", error);
        setProject(null); // Dacă apare eroare, setează null
      });
  }, []);

  const handleSave = (updatedProject) => {
    axios.post("/api/project", updatedProject) // Create or update project
      .then((response) => {
        setProject(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error saving project:", error);
        setIsEditing(false);
      });
  };

  console.log('Project:', project);
  console.log('Is Editing:', isEditing);
  console.log('Should show no project:', !project && !isEditing);

  if ((!project || Object.keys(project).length === 0) && !isEditing) {
    return (
      <div className="no-project">
        <p>No project available. Start by creating one!</p>
        <button className="btnAdd" onClick={() => setIsEditing(true)}>Add Project</button>
      </div>
    );
  }
  

  return (
    <div className="my-project">
      <h1>My Project</h1>
      {isEditing ? (
        <EditProjectForm project={project || {}} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          {project.attachmentURL && (
            <p>
              Attachment: <a href={project.attachmentURL} target="_blank" rel="noopener noreferrer">View</a>
            </p>
          )}
          <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
          <button className="btnEdit" onClick={() => setIsEditing(true)}>Edit Project</button>

          <h3>Collaborators</h3>
          <CollaboratorsList collaborators={project.collaborators} projectId={project.id} />

          <h3>Deliverables</h3>
          <DeliverablesList deliverables={project.deliverables} projectId={project.id} />

          <h3>Evaluations</h3>
          <EvaluationsList evaluations={project.evaluations} projectId={project.id} />
        </>
      )}
    </div>
  );
  
};

export default MyProject;
