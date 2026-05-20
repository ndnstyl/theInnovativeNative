import React, { useMemo } from 'react';
import { formatMessage } from '@/lib/messaging/formatMessage';
import { sanitizeMessage } from '@/lib/messaging/sanitize';
import type { MessageWithSender } from '@/types/messaging';

interface MessageBubbleProps {
  message: MessageWithSender;
  isMine: boolean;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMine }) => {
  const html = useMemo(
    () => sanitizeMessage(formatMessage(message.body)),
    [message.body]
  );

  return (
    <div className={`message-bubble ${isMine ? 'message-bubble--sent' : 'message-bubble--received'}`}>
      {!isMine && (
        <div className="message-bubble__avatar">
          {message.sender.avatar_url ? (
            <img src={message.sender.avatar_url} alt={message.sender.display_name} />
          ) : (
            <span>{message.sender.display_name.charAt(0).toUpperCase()}</span>
          )}
        </div>
      )}
      <div className="message-bubble__content">
        {!isMine && (
          <span className="message-bubble__name">{message.sender.display_name}</span>
        )}
        <div
          className="message-bubble__body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <span className="message-bubble__time">{relativeTime(message.created_at)}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
