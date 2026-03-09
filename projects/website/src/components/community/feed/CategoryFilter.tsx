import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { FeedCategory } from '@/types/feed';

interface CategoryFilterProps {
  activeId: string | undefined;
  onChange: (categoryId: string | undefined) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeId, onChange }) => {
  const { supabaseClient } = useAuth();
  const [categories, setCategories] = useState<FeedCategory[]>([]);

  useEffect(() => {
    if (!supabaseClient) return;

    supabaseClient
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data) setCategories(data as FeedCategory[]);
      });
  }, [supabaseClient]);

  return (
    <div className="category-filter">
      <button
        className={`category-filter__chip ${!activeId ? 'category-filter__chip--active' : ''}`}
        onClick={() => onChange(undefined)}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`category-filter__chip ${activeId === cat.id ? 'category-filter__chip--active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
