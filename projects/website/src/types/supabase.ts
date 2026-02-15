// Supabase Database Types
// These types represent the database schema for the Law Firm RAG application

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
          email: string | null;
          stripe_customer_id: string | null;
          pilot_status: string | null;
          pilot_started_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          stripe_customer_id?: string | null;
          pilot_status?: string | null;
          pilot_started_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          stripe_customer_id?: string | null;
          pilot_status?: string | null;
          pilot_started_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
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

// Pilot status enum for type safety
export type PilotStatus = 'pending' | 'active' | 'completed' | 'cancelled';
