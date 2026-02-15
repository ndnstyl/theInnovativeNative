import React from 'react';

interface DownloadButtonProps {
  jsonFile: string;
  templateTitle: string;
}

const DownloadButton = ({ jsonFile, templateTitle }: DownloadButtonProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = jsonFile;
    link.download = `${templateTitle.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload} className="download-button">
      <i className="fa-solid fa-download"></i>
      <span>Download Workflow JSON</span>
    </button>
  );
};

export default DownloadButton;
