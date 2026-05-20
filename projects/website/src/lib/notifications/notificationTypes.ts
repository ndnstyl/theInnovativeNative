import type { NotificationType } from '@/types/notifications';

interface NotificationTypeConfig {
  icon: string;
  label: string;
  getRoute: (contentType: string | null, contentId: string | null) => string;
}

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  like_post: {
    icon: 'fa-solid fa-heart',
    label: 'Likes',
    getRoute: (_, id) => id ? `/community/posts/${id}` : '/community',
  },
  like_comment: {
    icon: 'fa-solid fa-heart',
    label: 'Comment Likes',
    getRoute: (_, id) => id ? `/community/posts/${id}` : '/community',
  },
  comment_post: {
    icon: 'fa-solid fa-comment',
    label: 'Comments',
    getRoute: (_, id) => id ? `/community/posts/${id}` : '/community',
  },
  reply_comment: {
    icon: 'fa-solid fa-reply',
    label: 'Replies',
    getRoute: (_, id) => id ? `/community/posts/${id}` : '/community',
  },
  mention: {
    icon: 'fa-solid fa-at',
    label: 'Mentions',
    getRoute: (_, id) => id ? `/community/posts/${id}` : '/community',
  },
  dm_received: {
    icon: 'fa-solid fa-envelope',
    label: 'Direct Messages',
    getRoute: (_, id) => id ? `/messages?c=${id}` : '/messages',
  },
  admin_post: {
    icon: 'fa-solid fa-bullhorn',
    label: 'Admin Posts',
    getRoute: (_, id) => id ? `/community/posts/${id}` : '/community',
  },
  event_reminder: {
    icon: 'fa-solid fa-calendar-check',
    label: 'Event Reminders',
    getRoute: (_, id) => id ? `/community/calendar/${id}` : '/community/calendar',
  },
  content_reported: {
    icon: 'fa-solid fa-flag',
    label: 'Content Reports',
    getRoute: () => '/community/admin/categories',
  },
  join_request: {
    icon: 'fa-solid fa-user-plus',
    label: 'Join Requests',
    getRoute: () => '/members/requests',
  },
  generic: {
    icon: 'fa-solid fa-bell',
    label: 'General',
    getRoute: () => '/community',
  },
};
