import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { EventCategory } from '@/types/calendar';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

const DEFAULT_COMMUNITY = 'a0000000-0000-0000-0000-000000000001';

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  const { supabaseClient } = useAuth();
  const [categories, setCategories] = useState<EventCategory[]>([]);

  useEffect(() => {
    if (!supabaseClient) return;
    supabaseClient
      .from('event_categories')
      .select('*')
      .eq('community_id', DEFAULT_COMMUNITY)
      .order('name')
      .then(({ data }) => {
        if (data) setCategories(data as EventCategory[]);
      });
  }, [supabaseClient]);

  if (categories.length === 0) return null;

  return (
    <div className="calendar-category-filter">
      <button
        className={`calendar-category-filter__btn ${selected === null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`calendar-category-filter__btn ${selected === cat.id ? 'active' : ''}`}
          style={selected === cat.id ? { backgroundColor: `${cat.color}22`, color: cat.color, borderColor: cat.color } : undefined}
          onClick={() => onSelect(cat.id)}
        >
          <span className="calendar-category-filter__dot" style={{ backgroundColor: cat.color }} />
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
