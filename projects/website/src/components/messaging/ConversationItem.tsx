import React from 'react';
import type { ConversationWithParticipant } from '@/types/messaging';

interface ConversationItemProps {
  conversation: ConversationWithParticipant;
  isActive: boolean;
  onClick: () => void;
}

function relativeTime(iso: string | null): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isActive, onClick }) => {
  const { other_user, last_message_preview, last_message_at, has_unread, is_muted } = conversation;

  return (
    <button
      className={`conversation-item ${isActive ? 'conversation-item--active' : ''} ${has_unread ? 'conversation-item--unread' : ''}`}
      onClick={onClick}
    >
      <div className="conversation-item__avatar">
        {other_user.avatar_url ? (
          <img src={other_user.avatar_url} alt={other_user.display_name} />
        ) : (
          <span>{other_user.display_name.charAt(0).toUpperCase()}</span>
        )}
        {has_unread && <span className="conversation-item__unread-dot" />}
      </div>
      <div className="conversation-item__info">
        <div className="conversation-item__top">
          <span className="conversation-item__name">{other_user.display_name}</span>
          <span className="conversation-item__time">{relativeTime(last_message_at)}</span>
        </div>
        <p className="conversation-item__preview">
          {is_muted && <i className="fa-solid fa-bell-slash" title="Muted" />}
          {last_message_preview || 'No messages yet'}
        </p>
      </div>
    </button>
  );
};

export default ConversationItem;
