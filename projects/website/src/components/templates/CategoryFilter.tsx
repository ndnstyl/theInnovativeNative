import React from 'react';
import { TemplateCategory } from '@/data/template-categories';

interface CategoryFilterProps {
  categories: TemplateCategory[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="category-filter">
      <div className="category-filter__scroll">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-filter__button ${
              activeCategory === category.id ? 'category-filter__button--active' : ''
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <i className={category.icon}></i>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
