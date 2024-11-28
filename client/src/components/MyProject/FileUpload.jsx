import React from "react";

const FileUpload = ({ onUpload, currentFile }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate upload process
      const mockURL = URL.createObjectURL(file); // Replace with real API upload logic
      onUpload(mockURL);
    }
  };

  return (
    <div>
      {currentFile && (
        <p>
          Current Attachment: <a href={currentFile} target="_blank" rel="noopener noreferrer">View</a>
        </p>
      )}
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;
