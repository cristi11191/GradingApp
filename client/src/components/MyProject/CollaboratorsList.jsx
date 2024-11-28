import React from "react";

const CollaboratorsList = ({ collaborators = [] }) => {
  if (collaborators.length === 0) {
    return <p>No collaborators found.</p>;
  }

  return (
    <ul>
      {collaborators.map((collaborator) => (
        <li key={collaborator.id}>
          <strong>{collaborator.name}</strong> ({collaborator.email})
        </li>
      ))}
    </ul>
  );
};

export default CollaboratorsList;
