import React from "react";

const PrintButton = () => {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button type="button" className="gw-print-btn" onClick={handlePrint}>
      <i className="fa-sharp fa-solid fa-print" />
      Print this page
    </button>
  );
};

export default PrintButton;
