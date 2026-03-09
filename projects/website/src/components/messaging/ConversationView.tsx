import React, { useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { useAuth } from '@/contexts/AuthContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import type { ConversationWithParticipant } from '@/types/messaging';

interface ConversationViewProps {
  conversation: ConversationWithParticipant;
  onBack?: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversation, onBack }) => {
  const { session } = useAuth();
  const { messages, isLoading, hasMore, loadOlder, sendMessage, markRead } = useMessages(conversation.conversation_id);
  const { isPartnerTyping, sendTyping } = useTypingIndicator(conversation.conversation_id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  // Mark read on open
  useEffect(() => {
    markRead();
  }, [conversation.conversation_id, markRead]);

  // Scroll-to-load-more
  const handleScroll = () => {
    const el = scrollRef.current;
    if (el && el.scrollTop < 100 && hasMore && !isLoading) {
      loadOlder();
    }
  };

  return (
    <div className="conversation-view">
      <div className="conversation-view__header">
        {onBack && (
          <button className="conversation-view__back" onClick={onBack} aria-label="Back to inbox">
            <i className="fa-solid fa-arrow-left" />
          </button>
        )}
        <div className="conversation-view__user">
          {conversation.other_user.avatar_url ? (
            <img
              src={conversation.other_user.avatar_url}
              alt={conversation.other_user.display_name}
              className="conversation-view__avatar"
            />
          ) : (
            <span className="conversation-view__avatar conversation-view__avatar--placeholder">
              {conversation.other_user.display_name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="conversation-view__name">{conversation.other_user.display_name}</span>
        </div>
      </div>

      <div className="conversation-view__messages" ref={scrollRef} onScroll={handleScroll}>
        {isLoading && messages.length === 0 ? (
          <div className="conversation-view__loading">
            <i className="fa-solid fa-spinner fa-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="conversation-view__empty">
            <p>Say hello to start the conversation.</p>
          </div>
        ) : (
          <>
            {hasMore && (
              <button className="conversation-view__load-older" onClick={loadOlder}>
                Load older messages
              </button>
            )}
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMine={msg.sender_id === session?.user?.id}
              />
            ))}
          </>
        )}
        <TypingIndicator isTyping={isPartnerTyping} />
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={sendMessage} onTyping={sendTyping} />
    </div>
  );
};

export default ConversationView;
