import React from "react";

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="gw-stat-card">
      <div className="gw-stat-card__value">{value}</div>
      <div className="gw-stat-card__label">{label}</div>
    </div>
  );
};

export default StatCard;
