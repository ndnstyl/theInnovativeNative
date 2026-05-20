// Direct Messaging types for spec 016

export interface ConversationWithParticipant {
  conversation_id: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  other_user: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    username: string | null;
  };
  is_muted: boolean;
  has_unread: boolean;
}

export interface MessageWithSender {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  sender: {
    display_name: string;
    avatar_url: string | null;
  };
}

export interface SearchResult {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
  rank: number;
}
