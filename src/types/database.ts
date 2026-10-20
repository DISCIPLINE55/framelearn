// FrameLearn Supabase Database Schema Definition (Milestone 002)

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProfileRole = 'admin' | 'client' | 'learner';

export type BookingStatus =
  | 'submitted'
  | 'under_review'
  | 'confirmed'
  | 'declined'
  | 'completed'
  | 'cancelled';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: ProfileRole;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: ProfileRole;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: ProfileRole;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: string;
          description: string;
          icon_name: string | null;
          cover_image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          category: string;
          description: string;
          icon_name?: string | null;
          cover_image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          category?: string;
          description?: string;
          icon_name?: string | null;
          cover_image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      service_packages: {
        Row: {
          id: string;
          service_id: string;
          name: string;
          slug: string;
          description: string | null;
          price_amount: number | null;
          currency: string;
          duration_minutes: number | null;
          deliverables: Json;
          is_featured: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          name: string;
          slug: string;
          description?: string | null;
          price_amount?: number | null;
          currency?: string;
          duration_minutes?: number | null;
          deliverables?: Json;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price_amount?: number | null;
          currency?: string;
          duration_minutes?: number | null;
          deliverables?: Json;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      booking_requests: {
        Row: {
          id: string;
          service_id: string | null;
          package_id: string | null;
          client_name: string;
          client_email: string;
          client_phone: string;
          preferred_date: string | null;
          preferred_time: string | null;
          location_notes: string | null;
          message: string;
          status: BookingStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_id?: string | null;
          package_id?: string | null;
          client_name: string;
          client_email: string;
          client_phone: string;
          preferred_date?: string | null;
          preferred_time?: string | null;
          location_notes?: string | null;
          message: string;
          status?: BookingStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string | null;
          package_id?: string | null;
          client_name?: string;
          client_email?: string;
          client_phone?: string;
          preferred_date?: string | null;
          preferred_time?: string | null;
          location_notes?: string | null;
          message?: string;
          status?: BookingStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      booking_status_history: {
        Row: {
          id: string;
          booking_request_id: string;
          from_status: string | null;
          to_status: BookingStatus;
          note: string | null;
          changed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_request_id: string;
          from_status?: string | null;
          to_status: BookingStatus;
          note?: string | null;
          changed_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_request_id?: string;
          from_status?: string | null;
          to_status?: BookingStatus;
          note?: string | null;
          changed_by?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type ServicePackage = Database['public']['Tables']['service_packages']['Row'];
export type BookingRequest = Database['public']['Tables']['booking_requests']['Row'];
export type BookingStatusHistory = Database['public']['Tables']['booking_status_history']['Row'];
