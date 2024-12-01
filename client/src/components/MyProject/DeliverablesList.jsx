import React from "react";
import './DeliverablesList.css'
const DeliverablesList = ({ deliverables = [] }) => {
  if (deliverables.length === 0) {
    return <p>No deliverables available.</p>;
  }

  return (
    <ul>
      {deliverables.map((deliverable) => (
        <li key={deliverable.id}>
          <strong>{deliverable.title}</strong>: {deliverable.description}
        </li>
      ))}
    </ul>
  );
};

export default DeliverablesList;
