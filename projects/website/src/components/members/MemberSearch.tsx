import React, { useState, useEffect, useRef } from 'react';
import type { Role } from '@/types/members';

interface MemberSearchProps {
  onSearch: (query: string) => void;
  onFilterRole: (role: Role | null) => void;
}

const MemberSearch: React.FC<MemberSearchProps> = ({ onSearch, onFilterRole }) => {
  const [inputValue, setInputValue] = useState('');
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      onSearch(inputValue);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, onSearch]);

  return (
    <div className="member-search">
      <div className="member-search__input-wrap">
        <i className="fa-solid fa-magnifying-glass member-search__icon"></i>
        <input
          type="text"
          className="member-search__input"
          placeholder="Search members..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          aria-label="Search members"
        />
      </div>
      <select
        className="member-search__filter"
        onChange={(e) => onFilterRole(e.target.value === '' ? null : e.target.value as Role)}
        aria-label="Filter by role"
        defaultValue=""
      >
        <option value="">All Roles</option>
        <option value="owner">Owner</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
        <option value="member">Member</option>
      </select>
    </div>
  );
};

export default MemberSearch;
