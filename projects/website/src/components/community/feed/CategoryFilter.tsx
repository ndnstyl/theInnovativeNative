import React from 'react';

interface CategoryFilterProps {
  categories: { id: string; name: string }[];
  activeId: string | undefined;
  onChange: (categoryId: string | undefined) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeId, onChange }) => {
  return (
    <div className="category-filter" role="tablist" aria-label="Filter by category">
      <button
        className={`category-filter__chip ${!activeId ? 'category-filter__chip--active' : ''}`}
        onClick={() => onChange(undefined)}
        role="tab"
        aria-selected={!activeId}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`category-filter__chip ${activeId === cat.id ? 'category-filter__chip--active' : ''}`}
          onClick={() => onChange(cat.id)}
          role="tab"
          aria-selected={activeId === cat.id}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
