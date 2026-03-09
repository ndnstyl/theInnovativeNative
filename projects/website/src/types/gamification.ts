// Gamification types for spec 014

export type SourceType =
  | 'like_received'
  | 'lesson_completed'
  | 'course_completed'
  | 'event_attended'
  | 'admin_award'
  | 'admin_adjustment'
  | 'reversal';

export interface LeaderboardEntry {
  rank: number;
  member_id: string; // profiles.id
  display_name: string;
  avatar_url: string | null;
  username: string | null;
  level_number: number;
  level_name: string;
  points: number;
  is_current_user: boolean;
}

export type TimeFilter = '7d' | '30d' | 'all';

export interface PointHistoryEntry {
  id: string;
  source_type: string;
  source_description: string;
  points: number;
  created_at: string;
}

export interface LevelConfig {
  id: string;
  level_number: number;
  min_points: number;
  name: string;
  badge_url: string | null;
}
