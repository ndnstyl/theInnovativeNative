import React, { useEffect } from 'react';
import { usePoll } from '@/hooks/usePoll';
import type { FeedPoll } from '@/types/feed';

interface PollDisplayProps {
  poll: FeedPoll;
}

const PollDisplay: React.FC<PollDisplayProps> = ({ poll }) => {
  const { hasVoted, selectedOptionId, options, totalVotes, vote, loading, setOptions, setTotalVotes } = usePoll(poll.id);

  // Sync options from prop
  useEffect(() => {
    setOptions(poll.options);
    setTotalVotes(poll.total_votes);
  }, [poll, setOptions, setTotalVotes]);

  return (
    <div className="poll-display">
      <h4 className="poll-display__question">{poll.question}</h4>

      <div className="poll-display__options">
        {options.map(option => {
          const pct = totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0;
          const isSelected = option.id === selectedOptionId;

          return (
            <button
              key={option.id}
              className={`poll-display__option ${hasVoted ? 'poll-display__option--voted' : ''} ${isSelected ? 'poll-display__option--selected' : ''}`}
              onClick={() => !hasVoted && vote(option.id)}
              disabled={hasVoted || loading}
            >
              {hasVoted && (
                <div className="poll-display__bar" style={{ width: `${pct}%` }} />
              )}
              <span className="poll-display__text">{option.option_text}</span>
              {hasVoted && <span className="poll-display__pct">{pct}%</span>}
            </button>
          );
        })}
      </div>

      <span className="poll-display__total">
        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
      </span>
    </div>
  );
};

export default PollDisplay;
