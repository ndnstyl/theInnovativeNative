import React from 'react';
import { MEMBERSHIP_PRICE } from '@/lib/constants';

interface CommunityMetaBarProps {
  memberCount: number;
  loading?: boolean;
}

/**
 * Horizontal bar displaying community metadata: visibility, member count, price, and creator.
 * Styled via _classroom-landing.scss using BEM .meta-bar classes.
 */
const CommunityMetaBar: React.FC<CommunityMetaBarProps> = ({ memberCount, loading }) => {
  return (
    <div className="meta-bar">
      <div className="meta-bar__item meta-bar__badge">
        <i className="fa-solid fa-globe" aria-hidden="true"></i>
        <span>Public</span>
      </div>
      <div className="meta-bar__item">
        <i className="fa-solid fa-users" aria-hidden="true"></i>
        <span aria-live="polite">{loading ? '...' : `${memberCount} members`}</span>
      </div>
      <div className="meta-bar__item">
        <i className="fa-solid fa-tag" aria-hidden="true"></i>
        <span>{MEMBERSHIP_PRICE}</span>
      </div>
      <div className="meta-bar__item">
        <img
          src="/images/classroom/mike-soto.png"
          alt="Mike Soto"
          className="meta-bar__avatar"
          width={24}
          height={24}
        />
        <span>By Mike Soto</span>
      </div>
    </div>
  );
};

export default CommunityMetaBar;
