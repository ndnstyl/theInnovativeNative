import React from 'react';
import { useRouter } from 'next/router';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ConversationView from '@/components/messaging/ConversationView';
import { useConversations } from '@/hooks/useConversations';

const ConversationPage: React.FC = () => {
  const router = useRouter();
  const { conversationId } = router.query;
  const { conversations, isLoading } = useConversations();

  const conversation = typeof conversationId === 'string'
    ? conversations.find((c) => c.conversation_id === conversationId) || null
    : null;

  return (
    <ClassroomLayout title="Messages">
      <div className="messages-page messages-page--conversation-open">
        <div className="messages-page__main messages-page__main--full">
          {isLoading ? (
            <div className="conversation-view__loading">
              <i className="fa-solid fa-spinner fa-spin" />
            </div>
          ) : conversation ? (
            <ConversationView conversation={conversation} onBack={() => router.push('/messages')} />
          ) : (
            <div className="messages-page__no-selection">
              <i className="fa-solid fa-triangle-exclamation" />
              <h3>Conversation not found</h3>
              <button onClick={() => router.push('/messages')} className="btn btn--secondary">
                Back to Messages
              </button>
            </div>
          )}
        </div>
      </div>
    </ClassroomLayout>
  );
};

export default ConversationPage;
