import React from 'react';

const FeedSkeleton: React.FC = () => {
  return (
    <div className="feed-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="feed-skeleton__card">
          <div className="feed-skeleton__header">
            <div className="feed-skeleton__avatar" />
            <div className="feed-skeleton__lines">
              <div className="feed-skeleton__line feed-skeleton__line--short" />
              <div className="feed-skeleton__line feed-skeleton__line--tiny" />
            </div>
          </div>
          <div className="feed-skeleton__body">
            <div className="feed-skeleton__line" />
            <div className="feed-skeleton__line" />
            <div className="feed-skeleton__line feed-skeleton__line--medium" />
          </div>
          <div className="feed-skeleton__footer">
            <div className="feed-skeleton__line feed-skeleton__line--tiny" />
            <div className="feed-skeleton__line feed-skeleton__line--tiny" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedSkeleton;
