import React from 'react';
import type { MemberCardData } from '@/types/members';
import MemberCard from './MemberCard';

interface MemberGridProps {
  members: MemberCardData[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MemberGrid: React.FC<MemberGridProps> = ({
  members,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (members.length === 0) {
    return (
      <div className="member-grid__empty">
        <i className="fa-solid fa-users-slash" style={{ fontSize: 32, color: '#333', marginBottom: 12 }}></i>
        <p>No members found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="member-grid">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="member-grid__pagination">
          <button
            className="member-grid__page-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <span className="member-grid__page-info">
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            className="member-grid__page-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            aria-label="Next page"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberGrid;
