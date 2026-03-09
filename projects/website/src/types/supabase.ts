// Supabase Database Types
// These types represent the database schema
// Updated for community platform (specs 010-029)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          social_links: Json;
          membership_status: string;
          onboarding_complete: boolean;
          last_active_at: string | null;
          username_changed_at: string | null;
          level: number;
          xp_total: number;
          search_vector: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          social_links?: Json;
          membership_status?: string;
          onboarding_complete?: boolean;
          last_active_at?: string | null;
          username_changed_at?: string | null;
          level?: number;
          xp_total?: number;
        };
        Update: {
          display_name?: string;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          social_links?: Json;
          membership_status?: string;
          onboarding_complete?: boolean;
          last_active_at?: string | null;
          username_changed_at?: string | null;
        };
        Relationships: [];
      };
      communities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          cover_image_url: string | null;
          privacy: string;
          pricing_model: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          privacy?: string;
          pricing_model?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          privacy?: string;
          pricing_model?: string;
        };
        Relationships: [];
      };
      community_members: {
        Row: {
          id: string;
          community_id: string;
          member_id: string;
          role: string;
          status: string;
          deleted_at: string | null;
          joined_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          member_id: string;
          role?: string;
          status?: string;
        };
        Update: {
          role?: string;
          status?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'community_members_community_id_fkey';
            columns: ['community_id'];
            referencedRelation: 'communities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'community_members_member_id_fkey';
            columns: ['member_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      categories: {
        Row: {
          id: string;
          community_id: string;
          name: string;
          description: string | null;
          display_order: number;
          post_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          name: string;
          description?: string | null;
          display_order?: number;
          post_count?: number;
        };
        Update: {
          name?: string;
          description?: string | null;
          display_order?: number;
          post_count?: number;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          community_id: string;
          author_id: string;
          category_id: string | null;
          title: string | null;
          body: string;
          body_html: string;
          pinned_position: number | null;
          search_vector: string | null;
          like_count: number;
          comment_count: number;
          edited_at: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          author_id: string;
          category_id?: string | null;
          title?: string | null;
          body: string;
          body_html: string;
          pinned_position?: number | null;
        };
        Update: {
          category_id?: string | null;
          title?: string | null;
          body?: string;
          body_html?: string;
          pinned_position?: number | null;
          edited_at?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          parent_comment_id: string | null;
          body: string;
          body_html: string;
          like_count: number;
          deleted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          parent_comment_id?: string | null;
          body: string;
          body_html: string;
        };
        Update: {
          body?: string;
          body_html?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      reactions: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          target_type: string;
          target_id: string;
          reaction_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          target_type: string;
          target_id: string;
          reaction_type?: string;
        };
        Update: {};
        Relationships: [];
      };
      post_attachments: {
        Row: {
          id: string;
          post_id: string;
          file_path: string;
          file_name: string;
          file_type: string;
          file_size: number;
          display_mode: string;
          optimized_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          file_path: string;
          file_name: string;
          file_type: string;
          file_size: number;
          display_mode?: string;
          optimized_path?: string | null;
        };
        Update: {
          display_mode?: string;
          optimized_path?: string | null;
        };
        Relationships: [];
      };
      polls: {
        Row: {
          id: string;
          post_id: string;
          question: string;
          total_votes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          question: string;
          total_votes?: number;
        };
        Update: {
          question?: string;
          total_votes?: number;
        };
        Relationships: [];
      };
      poll_options: {
        Row: {
          id: string;
          poll_id: string;
          option_text: string;
          vote_count: number;
          display_order: number;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_text: string;
          vote_count?: number;
          display_order?: number;
        };
        Update: {
          option_text?: string;
          vote_count?: number;
          display_order?: number;
        };
        Relationships: [];
      };
      poll_votes: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_id: string;
          user_id: string;
        };
        Update: {};
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          community_id: string;
          reporter_id: string;
          target_type: string;
          target_id: string;
          reason: string;
          description: string | null;
          status: string;
          reviewed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          reporter_id: string;
          target_type: string;
          target_id: string;
          reason: string;
          description?: string | null;
          status?: string;
        };
        Update: {
          status?: string;
          reviewed_by?: string | null;
        };
        Relationships: [];
      };
      post_follows: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
        };
        Update: {};
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          community_id: string;
          slug: string;
          title: string;
          description: string | null;
          thumbnail_url: string | null;
          is_published: boolean;
          is_free: boolean;
          stripe_price_id: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          slug: string;
          title: string;
          description?: string | null;
          thumbnail_url?: string | null;
          is_published?: boolean;
          is_free?: boolean;
          stripe_price_id?: string | null;
          sort_order?: number;
        };
        Update: {
          slug?: string;
          title?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          is_published?: boolean;
          is_free?: boolean;
          stripe_price_id?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          sort_order?: number;
        };
        Update: {
          title?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'modules_course_id_fkey';
            columns: ['course_id'];
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          course_id: string;
          slug: string;
          title: string;
          content_markdown: string | null;
          video_url: string | null;
          is_free_preview: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          course_id: string;
          slug: string;
          title: string;
          content_markdown?: string | null;
          video_url?: string | null;
          is_free_preview?: boolean;
          sort_order?: number;
        };
        Update: {
          slug?: string;
          title?: string;
          content_markdown?: string | null;
          video_url?: string | null;
          is_free_preview?: boolean;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_module_id_fkey';
            columns: ['module_id'];
            referencedRelation: 'modules';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lessons_course_id_fkey';
            columns: ['course_id'];
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          stripe_session_id: string | null;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          stripe_session_id?: string | null;
        };
        Update: {
          stripe_session_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollments_course_id_fkey';
            columns: ['course_id'];
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          course_id: string;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          course_id: string;
          completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_progress_lesson_id_fkey';
            columns: ['lesson_id'];
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lesson_progress_course_id_fkey';
            columns: ['course_id'];
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
      membership_questions: {
        Row: {
          id: string;
          community_id: string;
          question_text: string;
          is_required: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          question_text: string;
          is_required?: boolean;
          sort_order: number;
        };
        Update: {
          question_text?: string;
          is_required?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      membership_requests: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          answers: Json;
          status: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          answers: Json;
          status?: string;
        };
        Update: {
          status?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          id: string;
          community_id: string;
          email: string;
          invited_by: string;
          token: string;
          personal_message: string | null;
          status: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          email: string;
          invited_by: string;
          token?: string;
          personal_message?: string | null;
          status?: string;
          expires_at: string;
        };
        Update: {
          status?: string;
        };
        Relationships: [];
      };
      follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
        };
        Update: {};
        Relationships: [];
      };
      member_bans: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          banned_by: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          banned_by: string;
          reason?: string | null;
        };
        Update: {};
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          source_user_id: string | null;
          type: string;
          content_type: string | null;
          content_id: string | null;
          description: string | null;
          group_id: string | null;
          group_count: number;
          group_members: any;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          source_user_id?: string | null;
          type: string;
          content_type?: string | null;
          content_id?: string | null;
          description?: string | null;
        };
        Update: {
          is_read?: boolean;
        };
        Relationships: [];
      };
      notification_preferences: {
        Row: {
          user_id: string;
          notification_type: string;
          channel: string;
          enabled: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          notification_type: string;
          channel: string;
          enabled?: boolean;
        };
        Update: {
          enabled?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      thread_subscriptions: {
        Row: {
          user_id: string;
          post_id: string;
          subscribed: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
          subscribed?: boolean;
        };
        Update: {
          subscribed?: boolean;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          plan: string;
          status: string;
          lifetime_access: boolean;
          current_period_start: string | null;
          current_period_end: string | null;
          trial_start: string | null;
          trial_end: string | null;
          cancel_at_period_end: boolean;
          grace_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          plan?: string;
          status?: string;
          lifetime_access?: boolean;
        };
        Update: {
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          plan?: string;
          status?: string;
          lifetime_access?: boolean;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
          cancel_at_period_end?: boolean;
          grace_period_end?: string | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          community_id: string;
          creator_id: string;
          title: string;
          description: string | null;
          location_type: string;
          location_details: string | null;
          location_url: string | null;
          cover_image_url: string | null;
          starts_at: string;
          ends_at: string;
          is_recurring: boolean;
          recurrence_rule: string | null;
          max_attendees: number | null;
          capacity: number;
          category_id: string | null;
          timezone: string;
          status: string;
          rsvp_count: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          creator_id: string;
          title: string;
          description?: string | null;
          location_type?: string;
          location_details?: string | null;
          location_url?: string | null;
          cover_image_url?: string | null;
          starts_at: string;
          ends_at: string;
          is_recurring?: boolean;
          recurrence_rule?: string | null;
          max_attendees?: number | null;
          capacity?: number;
          category_id?: string | null;
          timezone?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          location_type?: string;
          location_details?: string | null;
          location_url?: string | null;
          cover_image_url?: string | null;
          starts_at?: string;
          ends_at?: string;
          max_attendees?: number | null;
          capacity?: number;
          category_id?: string | null;
          timezone?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          occurrence_id: string | null;
          user_id: string;
          status: string;
          reminder_sent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          occurrence_id?: string | null;
          user_id: string;
          status?: string;
          reminder_sent?: boolean;
        };
        Update: {
          status?: string;
          reminder_sent?: boolean;
        };
        Relationships: [];
      };
      event_categories: {
        Row: {
          id: string;
          community_id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          name: string;
          color?: string;
        };
        Update: {
          name?: string;
          color?: string;
        };
        Relationships: [];
      };
      event_occurrences: {
        Row: {
          id: string;
          event_id: string;
          community_id: string;
          start_time: string;
          end_time: string;
          title_override: string | null;
          description_override: string | null;
          location_override: string | null;
          status: string;
          rsvp_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          community_id: string;
          start_time: string;
          end_time: string;
          title_override?: string | null;
          description_override?: string | null;
          location_override?: string | null;
          status?: string;
        };
        Update: {
          title_override?: string | null;
          description_override?: string | null;
          location_override?: string | null;
          status?: string;
          rsvp_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'event_occurrences_event_id_fkey';
            columns: ['event_id'];
            referencedRelation: 'events';
            referencedColumns: ['id'];
          }
        ];
      };
      levels: {
        Row: {
          id: string;
          community_id: string;
          level_number: number;
          name: string;
          min_points: number;
          badge_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          level_number: number;
          name: string;
          min_points: number;
          badge_url?: string | null;
        };
        Update: {
          name?: string;
          min_points?: number;
          badge_url?: string | null;
        };
        Relationships: [];
      };
      member_stats: {
        Row: {
          id: string;
          community_member_id: string;
          total_points: number;
          current_level: number;
          posts_count: number;
          comments_count: number;
          likes_received: number;
          points_7d: number;
          points_30d: number;
          last_point_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_member_id: string;
          total_points?: number;
          current_level?: number;
        };
        Update: {
          total_points?: number;
          current_level?: number;
          points_7d?: number;
          points_30d?: number;
          last_point_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'member_stats_community_member_id_fkey';
            columns: ['community_member_id'];
            referencedRelation: 'community_members';
            referencedColumns: ['id'];
          }
        ];
      };
      points_log: {
        Row: {
          id: string;
          community_member_id: string;
          action: string;
          points: number;
          source_type: string | null;
          source_id: string | null;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_member_id: string;
          action: string;
          points: number;
          source_type?: string | null;
          source_id?: string | null;
          reason?: string | null;
        };
        Update: {};
        Relationships: [
          {
            foreignKeyName: 'points_log_community_member_id_fkey';
            columns: ['community_member_id'];
            referencedRelation: 'community_members';
            referencedColumns: ['id'];
          }
        ];
      };
      point_config: {
        Row: {
          id: string;
          community_id: string;
          action: string;
          points: number;
          cooldown_minutes: number;
          daily_cap: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          action: string;
          points: number;
          cooldown_minutes?: number;
          daily_cap?: number | null;
        };
        Update: {
          points?: number;
          cooldown_minutes?: number;
          daily_cap?: number | null;
        };
        Relationships: [];
      };
      lesson_attachments: {
        Row: {
          id: string;
          lesson_id: string;
          file_name: string;
          file_path: string;
          file_type: string;
          file_size: number;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          file_name: string;
          file_path: string;
          file_type: string;
          file_size: number;
          uploaded_by: string;
        };
        Update: {
          file_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_attachments_lesson_id_fkey';
            columns: ['lesson_id'];
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          }
        ];
      };
      lesson_comments: {
        Row: {
          id: string;
          lesson_id: string;
          author_id: string;
          parent_comment_id: string | null;
          body: string;
          body_html: string;
          deleted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          author_id: string;
          parent_comment_id?: string | null;
          body: string;
          body_html: string;
        };
        Update: {
          body?: string;
          body_html?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_comments_lesson_id_fkey';
            columns: ['lesson_id'];
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          }
        ];
      };
      content_engagement_log: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          course_id: string;
          event_type: string;
          event_meta: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          course_id: string;
          event_type: string;
          event_meta?: Json;
        };
        Update: {};
        Relationships: [];
      };
      course_analytics_cache: {
        Row: {
          id: string;
          course_id: string;
          total_enrollments: number;
          active_learners_7d: number;
          avg_completion_pct: number;
          top_drop_off_lesson_id: string | null;
          computed_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          total_enrollments?: number;
          active_learners_7d?: number;
          avg_completion_pct?: number;
          top_drop_off_lesson_id?: string | null;
        };
        Update: {
          total_enrollments?: number;
          active_learners_7d?: number;
          avg_completion_pct?: number;
          top_drop_off_lesson_id?: string | null;
          computed_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          community_id: string;
          last_message_at: string | null;
          last_message_preview: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
        };
        Update: {
          last_message_at?: string | null;
          last_message_preview?: string | null;
        };
        Relationships: [];
      };
      conversation_participants: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          last_read_at: string | null;
          last_read_message_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
        };
        Update: {
          last_read_at?: string | null;
          last_read_message_id?: string | null;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          body: string;
        };
        Update: {};
        Relationships: [];
      };
      member_blocks: {
        Row: {
          blocker_id: string;
          blocked_id: string;
          created_at: string;
        };
        Insert: {
          blocker_id: string;
          blocked_id: string;
        };
        Update: {};
        Relationships: [];
      };
      conversation_mutes: {
        Row: {
          user_id: string;
          conversation_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          conversation_id: string;
        };
        Update: {};
        Relationships: [];
      };
      autodm_config: {
        Row: {
          id: string;
          community_id: string;
          admin_user_id: string;
          message_content: string;
          is_enabled: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          admin_user_id: string;
          message_content: string;
          is_enabled?: boolean;
        };
        Update: {
          message_content?: string;
          is_enabled?: boolean;
        };
        Relationships: [];
      };
      community_settings: {
        Row: {
          id: string;
          community_id: string;
          community_name: string;
          description: string | null;
          banner_url: string | null;
          logo_url: string | null;
          privacy_mode: string;
          post_categories: any;
          timezone: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          community_id: string;
          community_name?: string;
          description?: string | null;
          banner_url?: string | null;
          logo_url?: string | null;
          privacy_mode?: string;
          post_categories?: any;
          timezone?: string;
          updated_by?: string | null;
        };
        Update: {
          community_name?: string;
          description?: string | null;
          banner_url?: string | null;
          logo_url?: string | null;
          privacy_mode?: string;
          post_categories?: any;
          timezone?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      content_reports: {
        Row: {
          id: string;
          community_id: string;
          reporter_id: string;
          content_type: string;
          content_id: string;
          reason: string;
          status: string;
          admin_action: string | null;
          actioned_by: string | null;
          actioned_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          reporter_id: string;
          content_type: string;
          content_id: string;
          reason: string;
          status?: string;
        };
        Update: {
          status?: string;
          admin_action?: string | null;
          actioned_by?: string | null;
          actioned_at?: string | null;
        };
        Relationships: [];
      };
      admin_audit_log: {
        Row: {
          id: string;
          admin_user_id: string;
          action_type: string;
          target_type: string | null;
          target_id: string | null;
          description: string | null;
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_user_id: string;
          action_type: string;
          target_type?: string | null;
          target_id?: string | null;
          description?: string | null;
          metadata?: any;
        };
        Update: {};
        Relationships: [];
      };
      dashboard_metrics: {
        Row: {
          id: string;
          community_id: string;
          metric_name: string;
          current_value: number;
          previous_value: number;
          trend_percentage: number;
          trend_direction: string;
          computed_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          metric_name: string;
          current_value?: number;
          previous_value?: number;
          trend_percentage?: number;
          trend_direction?: string;
        };
        Update: {
          current_value?: number;
          previous_value?: number;
          trend_percentage?: number;
          trend_direction?: string;
          computed_at?: string;
        };
        Relationships: [];
      };
      email_preferences: {
        Row: {
          user_id: string;
          welcome_email: boolean;
          enrollment_email: boolean;
          payment_email: boolean;
          event_reminder: boolean;
          weekly_digest: boolean;
          marketing: boolean;
          unsubscribed_all: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          welcome_email?: boolean;
          enrollment_email?: boolean;
          payment_email?: boolean;
          event_reminder?: boolean;
          weekly_digest?: boolean;
          marketing?: boolean;
          unsubscribed_all?: boolean;
        };
        Update: {
          welcome_email?: boolean;
          enrollment_email?: boolean;
          payment_email?: boolean;
          event_reminder?: boolean;
          weekly_digest?: boolean;
          marketing?: boolean;
          unsubscribed_all?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_log: {
        Row: {
          id: string;
          user_id: string;
          email_type: string;
          subject: string;
          status: string;
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_type: string;
          subject: string;
          status?: string;
          metadata?: any;
        };
        Update: {
          status?: string;
        };
        Relationships: [];
      };
      analytics_snapshots: {
        Row: {
          id: string;
          community_id: string;
          snapshot_date: string;
          metric_name: string;
          value: number;
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          snapshot_date: string;
          metric_name: string;
          value?: number;
          metadata?: any;
        };
        Update: {
          value?: number;
          metadata?: any;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          window_start: string;
          count: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          window_start?: string;
          count?: number;
        };
        Update: {
          count?: number;
        };
        Relationships: [];
      };
      rate_limit_config: {
        Row: {
          id: string;
          action: string;
          max_count: number;
          window_minutes: number;
          description: string | null;
        };
        Insert: {
          id?: string;
          action: string;
          max_count: number;
          window_minutes?: number;
          description?: string | null;
        };
        Update: {
          action?: string;
          max_count?: number;
          window_minutes?: number;
          description?: string | null;
        };
        Relationships: [];
      };
      consent_records: {
        Row: {
          id: string;
          user_id: string;
          consent_type: string;
          granted: boolean;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          consent_type: string;
          granted?: boolean;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          granted?: boolean;
        };
        Relationships: [];
      };
      deletion_requests: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          reason: string | null;
          requested_at: string;
          completed_at: string | null;
          processed_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: string;
          reason?: string | null;
        };
        Update: {
          status?: string;
          completed_at?: string | null;
          processed_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_course_progress: {
        Args: {
          p_user_id: string;
          p_course_id: string;
        };
        Returns: number;
      };
      update_last_active: {
        Args: {
          p_user_id: string;
        };
        Returns: void;
      };
      generate_username_slug: {
        Args: {
          p_display_name: string;
        };
        Returns: string;
      };
      admin_award_points: {
        Args: {
          p_member_id: string;
          p_points: number;
          p_reason: string;
        };
        Returns: number;
      };
      get_points_history: {
        Args: {
          p_member_id: string;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: {
          id: string;
          source_type: string;
          source_description: string;
          points: number;
          created_at: string;
        }[];
      };
      get_activity_heatmap: {
        Args: {
          p_user_id: string;
        };
        Returns: { activity_date: string; activity_count: number }[];
      };
      change_member_role: {
        Args: {
          p_target_member_id: string;
          p_new_role: string;
        };
        Returns: Json;
      };
      rsvp_to_event: {
        Args: {
          p_occurrence_id: string;
          p_user_id: string;
        };
        Returns: Json;
      };
      cancel_rsvp: {
        Args: {
          p_occurrence_id: string;
          p_user_id: string;
        };
        Returns: Json;
      };
      generate_occurrences: {
        Args: {
          p_event_id: string;
        };
        Returns: void;
      };
      get_or_create_conversation: {
        Args: {
          p_other_user_id: string;
        };
        Returns: string;
      };
      get_unread_conversation_count: {
        Args: Record<string, never>;
        Returns: number;
      };
      search_messages: {
        Args: {
          p_conversation_id: string;
          p_query: string;
          p_limit?: number;
        };
        Returns: {
          id: string;
          body: string;
          sender_id: string;
          created_at: string;
          rank: number;
        }[];
      };
      get_unread_notification_count: {
        Args: Record<string, never>;
        Returns: number;
      };
      mark_all_notifications_read: {
        Args: Record<string, never>;
        Returns: void;
      };
      log_admin_action: {
        Args: {
          p_action_type: string;
          p_target_type: string;
          p_target_id: string;
          p_description: string;
          p_metadata?: any;
        };
        Returns: void;
      };
      ban_member: {
        Args: {
          p_member_id: string;
          p_reason?: string;
        };
        Returns: any;
      };
      unban_member: {
        Args: {
          p_member_id: string;
        };
        Returns: any;
      };
      remove_content: {
        Args: {
          p_content_type: string;
          p_content_id: string;
          p_report_id?: string;
        };
        Returns: any;
      };
      check_rate_limit: {
        Args: {
          p_user_id: string;
          p_action: string;
          p_max_count: number;
          p_window_minutes?: number;
        };
        Returns: boolean;
      };
      global_search: {
        Args: {
          p_query: string;
          p_type?: string;
          p_limit?: number;
        };
        Returns: {
          result_type: string;
          result_id: string;
          title: string;
          snippet: string;
          url: string;
          rank: number;
        }[];
      };
      export_user_data: {
        Args: {
          p_user_id: string;
        };
        Returns: any;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier access
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Community = Database['public']['Tables']['communities']['Row'];
export type CommunityMember = Database['public']['Tables']['community_members']['Row'];
export type CommunityMemberInsert = Database['public']['Tables']['community_members']['Insert'];

export type Category = Database['public']['Tables']['categories']['Row'];

export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

export type Comment = Database['public']['Tables']['comments']['Row'];
export type CommentInsert = Database['public']['Tables']['comments']['Insert'];

export type Reaction = Database['public']['Tables']['reactions']['Row'];
export type ReactionInsert = Database['public']['Tables']['reactions']['Insert'];

export type PostAttachment = Database['public']['Tables']['post_attachments']['Row'];
export type PostAttachmentInsert = Database['public']['Tables']['post_attachments']['Insert'];

export type Poll = Database['public']['Tables']['polls']['Row'];
export type PollInsert = Database['public']['Tables']['polls']['Insert'];

export type PollOption = Database['public']['Tables']['poll_options']['Row'];
export type PollOptionInsert = Database['public']['Tables']['poll_options']['Insert'];

export type PollVote = Database['public']['Tables']['poll_votes']['Row'];
export type PollVoteInsert = Database['public']['Tables']['poll_votes']['Insert'];

export type Report = Database['public']['Tables']['reports']['Row'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];

export type PostFollow = Database['public']['Tables']['post_follows']['Row'];
export type PostFollowInsert = Database['public']['Tables']['post_follows']['Insert'];

export type Course = Database['public']['Tables']['courses']['Row'];
export type CourseInsert = Database['public']['Tables']['courses']['Insert'];
export type CourseUpdate = Database['public']['Tables']['courses']['Update'];

export type Module = Database['public']['Tables']['modules']['Row'];
export type ModuleInsert = Database['public']['Tables']['modules']['Insert'];
export type ModuleUpdate = Database['public']['Tables']['modules']['Update'];

export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type LessonInsert = Database['public']['Tables']['lessons']['Insert'];
export type LessonUpdate = Database['public']['Tables']['lessons']['Update'];

export type Enrollment = Database['public']['Tables']['enrollments']['Row'];
export type EnrollmentInsert = Database['public']['Tables']['enrollments']['Insert'];

export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
export type LessonProgressInsert = Database['public']['Tables']['lesson_progress']['Insert'];
export type LessonProgressUpdate = Database['public']['Tables']['lesson_progress']['Update'];

export type MembershipQuestion = Database['public']['Tables']['membership_questions']['Row'];
export type MembershipRequest = Database['public']['Tables']['membership_requests']['Row'];
export type Invitation = Database['public']['Tables']['invitations']['Row'];
export type Follow = Database['public']['Tables']['follows']['Row'];
export type MemberBan = Database['public']['Tables']['member_bans']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];
export type EventRsvp = Database['public']['Tables']['event_rsvps']['Row'];
export type EventCategory = Database['public']['Tables']['event_categories']['Row'];
export type EventCategoryInsert = Database['public']['Tables']['event_categories']['Insert'];
export type EventOccurrence = Database['public']['Tables']['event_occurrences']['Row'];
export type EventOccurrenceUpdate = Database['public']['Tables']['event_occurrences']['Update'];
export type Level = Database['public']['Tables']['levels']['Row'];
export type LevelUpdate = Database['public']['Tables']['levels']['Update'];
export type MemberStats = Database['public']['Tables']['member_stats']['Row'];
export type PointsLogEntry = Database['public']['Tables']['points_log']['Row'];
export type PointConfig = Database['public']['Tables']['point_config']['Row'];
export type PointConfigUpdate = Database['public']['Tables']['point_config']['Update'];

// Classroom composite types
export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}

export interface CourseWithProgress extends Course {
  progress: number;
  is_enrolled: boolean;
  total_lessons: number;
  completed_lessons: number;
}

// Classroom V2 types
export type LessonAttachment = Database['public']['Tables']['lesson_attachments']['Row'];
export type LessonAttachmentInsert = Database['public']['Tables']['lesson_attachments']['Insert'];

export type LessonComment = Database['public']['Tables']['lesson_comments']['Row'];
export type LessonCommentInsert = Database['public']['Tables']['lesson_comments']['Insert'];

export type ContentEngagementLog = Database['public']['Tables']['content_engagement_log']['Row'];
export type ContentEngagementLogInsert = Database['public']['Tables']['content_engagement_log']['Insert'];

export type CourseAnalyticsCache = Database['public']['Tables']['course_analytics_cache']['Row'];

export interface LessonCommentWithAuthor extends LessonComment {
  author: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  replies?: LessonCommentWithAuthor[];
}

export interface ModuleWithDripStatus extends ModuleWithLessons {
  is_locked: boolean;
  unlocks_at: Date | null;
  drip_days: number;
}

// Messaging types
export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type ConversationParticipant = Database['public']['Tables']['conversation_participants']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MemberBlock = Database['public']['Tables']['member_blocks']['Row'];
export type ConversationMute = Database['public']['Tables']['conversation_mutes']['Row'];
export type AutoDMConfig = Database['public']['Tables']['autodm_config']['Row'];

export interface StudentProgressSummary {
  course_id: string;
  course_title: string;
  course_slug: string;
  thumbnail_url: string | null;
  total_lessons: number;
  completed_lessons: number;
  progress_pct: number;
  last_accessed_at: string | null;
  enrolled_at: string;
}

// Admin Dashboard types (018)
export type CommunitySettingsRow = Database['public']['Tables']['community_settings']['Row'];
export type CommunitySettingsUpdate = Database['public']['Tables']['community_settings']['Update'];
export type ContentReport = Database['public']['Tables']['content_reports']['Row'];
export type ContentReportUpdate = Database['public']['Tables']['content_reports']['Update'];
export type AdminAuditLog = Database['public']['Tables']['admin_audit_log']['Row'];
export type DashboardMetric = Database['public']['Tables']['dashboard_metrics']['Row'];
export type AnalyticsSnapshot = Database['public']['Tables']['analytics_snapshots']['Row'];
