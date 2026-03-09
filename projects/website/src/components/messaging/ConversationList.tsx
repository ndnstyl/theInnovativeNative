import React from 'react';
import { useConversations } from '@/hooks/useConversations';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  activeId: string | null;
  onSelect: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ activeId, onSelect }) => {
  const { conversations, isLoading, error, hasMore, loadMore } = useConversations();

  if (isLoading && conversations.length === 0) {
    return (
      <div className="conversation-list conversation-list--loading">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="conversation-list__skeleton" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-list conversation-list--error">
        <i className="fa-solid fa-triangle-exclamation" />
        <p>{error}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="conversation-list conversation-list--empty">
        <i className="fa-regular fa-comment-dots" />
        <h3>No conversations yet</h3>
        <p>Start a conversation from a member's profile.</p>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.conversation_id}
          conversation={conv}
          isActive={conv.conversation_id === activeId}
          onClick={() => onSelect(conv.conversation_id)}
        />
      ))}
      {hasMore && (
        <button className="conversation-list__load-more" onClick={loadMore}>
          Load more
        </button>
      )}
    </div>
  );
};

export default ConversationList;
