// Notification types for spec 017

export type NotificationType =
  | 'like_post'
  | 'like_comment'
  | 'comment_post'
  | 'reply_comment'
  | 'mention'
  | 'dm_received'
  | 'admin_post'
  | 'event_reminder'
  | 'content_reported'
  | 'join_request'
  | 'generic';

export type NotificationChannel = 'in_app' | 'email';

export interface NotificationWithSource {
  id: string;
  type: NotificationType;
  content_type: string | null;
  content_id: string | null;
  description: string | null;
  group_count: number;
  group_members: { id: string; name: string }[];
  is_read: boolean;
  created_at: string;
  source_user: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
}

export interface NotificationPreference {
  notification_type: NotificationType;
  channel: NotificationChannel;
  enabled: boolean;
}
