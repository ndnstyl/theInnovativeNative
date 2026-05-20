import React from 'react';

interface CategoryBadgeProps {
  name: string;
  color: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ name, color }) => (
  <span className="category-badge" style={{ backgroundColor: `${color}22`, color, borderColor: `${color}44` }}>
    {name}
  </span>
);

export default CategoryBadge;
