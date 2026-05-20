// Admin Dashboard types for spec 018

export type AdminActionType =
  | 'ban_member'
  | 'unban_member'
  | 'remove_content'
  | 'change_role'
  | 'dismiss_report'
  | 'update_settings'
  | 'update_categories';

export type ModerationAction = 'dismiss' | 'remove' | 'warn' | 'ban';

export interface CommunitySettings {
  id: string;
  community_name: string;
  description: string | null;
  banner_url: string | null;
  logo_url: string | null;
  privacy_mode: 'public' | 'private' | 'approval_required';
  post_categories: { id: string; name: string; color: string }[];
  timezone: string;
  updated_at: string;
}

export interface ContentReport {
  id: string;
  reporter_id: string;
  content_type: 'post' | 'comment';
  content_id: string;
  reason: string;
  status: 'pending' | 'dismissed' | 'actioned';
  admin_action: string | null;
  actioned_by: string | null;
  actioned_at: string | null;
  created_at: string;
  reporter?: {
    display_name: string;
    avatar_url: string | null;
  };
}

export interface AuditLogEntry {
  id: string;
  admin_user_id: string;
  action_type: AdminActionType;
  target_type: string | null;
  target_id: string | null;
  description: string | null;
  metadata: any;
  created_at: string;
  admin?: {
    display_name: string;
    avatar_url: string | null;
  };
}

export interface DashboardMetric {
  metric_name: string;
  current_value: number;
  previous_value: number;
  trend_percentage: number;
  trend_direction: 'up' | 'down' | 'flat';
  computed_at: string;
}

export interface MemberWithDetails {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  email: string | null;
  role: string;
  status: string;
  joined_at: string;
  last_active_at: string | null;
}
