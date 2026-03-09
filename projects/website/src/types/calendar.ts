// Calendar & Events types for spec 015

export type RsvpStatus = 'confirmed' | 'cancelled' | 'waitlisted' | 'attended';
export type EventStatus = 'upcoming' | 'cancelled' | 'completed';
export type RecurrenceRule = 'none' | 'daily' | 'weekly' | 'monthly';

export interface EventWithOccurrence {
  // Event fields
  event_id: string;
  community_id: string;
  title: string;
  description: string | null;
  location_url: string | null;
  cover_image_url: string | null;
  host_id: string;
  host_name: string;
  host_avatar: string | null;
  capacity: number;
  category_name: string | null;
  category_color: string | null;
  recurrence_rule: string | null;
  timezone: string;
  // Occurrence fields
  occurrence_id: string;
  start_time: string;
  end_time: string;
  status: EventStatus;
  rsvp_count: number;
  title_override: string | null;
  description_override: string | null;
  // Computed
  display_title: string;
  display_description: string | null;
}

export interface AttendeeData {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  username: string | null;
  rsvp_status: RsvpStatus;
  rsvp_timestamp: string;
}

export interface EventFormData {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  timezone: string;
  location_url: string;
  cover_image_url: string;
  capacity: number;
  category_id: string | null;
  recurrence_rule: RecurrenceRule;
  recurrence_count: number;
}

export interface CalendarFilter {
  view: 'upcoming' | 'past';
  category_id: string | null;
  page: number;
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
}
