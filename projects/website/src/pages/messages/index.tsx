import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ConversationList from '@/components/messaging/ConversationList';
import ConversationView from '@/components/messaging/ConversationView';
import { useConversations } from '@/hooks/useConversations';

const MessagesPage: React.FC = () => {
  const router = useRouter();
  const { conversations } = useConversations();
  const [activeId, setActiveId] = useState<string | null>(
    typeof router.query.c === 'string' ? router.query.c : null
  );

  const activeConversation = conversations.find((c) => c.conversation_id === activeId) || null;

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    // Update URL without navigation
    router.replace({ pathname: '/messages', query: { c: id } }, undefined, { shallow: true });
  }, [router]);

  const handleBack = useCallback(() => {
    setActiveId(null);
    router.replace('/messages', undefined, { shallow: true });
  }, [router]);

  return (
    <ClassroomLayout title="Messages">
      <div className={`messages-page ${activeId ? 'messages-page--conversation-open' : ''}`}>
        <div className="messages-page__sidebar">
          <div className="messages-page__sidebar-header">
            <h2>
              <i className="fa-regular fa-comment-dots" />
              Messages
            </h2>
          </div>
          <ConversationList activeId={activeId} onSelect={handleSelect} />
        </div>
        <div className="messages-page__main">
          {activeConversation ? (
            <ConversationView conversation={activeConversation} onBack={handleBack} />
          ) : (
            <div className="messages-page__no-selection">
              <i className="fa-regular fa-comments" />
              <h3>Select a conversation</h3>
              <p>Choose from your existing conversations or start a new one from a member's profile.</p>
            </div>
          )}
        </div>
      </div>
    </ClassroomLayout>
  );
};

export default MessagesPage;
