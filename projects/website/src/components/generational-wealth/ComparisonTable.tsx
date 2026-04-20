import React from "react";

interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
}

const ComparisonTable = ({ headers, rows }: ComparisonTableProps) => {
  return (
    <div className="gw-comparison-table">
      <div className="gw-comparison-table__wrapper">
        <table>
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
