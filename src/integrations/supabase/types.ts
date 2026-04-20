export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      broker_applications: {
        Row: {
          activity_log: Json
          admin_notes: Json
          applied_at: string
          avatar_url: string | null
          badge_tier: Database["public"]["Enums"]["badge_tier"]
          banner_url: string | null
          bio: string | null
          city: string | null
          connected_socials: string[]
          created_at: string
          distance_mi: number | null
          email: string
          featured_vehicles: number
          heard_from: string | null
          id: string
          id_confidence: number | null
          id_method: string | null
          id_verified: boolean
          id_verified_at: string | null
          name: string
          payout_method: string | null
          payout_schedule: string
          phone: string | null
          phone_verified: boolean
          phone_verified_at: string | null
          prior_referral: string | null
          score: number
          score_breakdown: Json
          self_description: string | null
          source: Database["public"]["Enums"]["application_source"]
          specialties: string[]
          state: string | null
          status: Database["public"]["Enums"]["application_status"]
          step_reached: number
          tagline: string | null
          updated_at: string
          user_id: string
          username: string | null
          zip: string | null
        }
        Insert: {
          activity_log?: Json
          admin_notes?: Json
          applied_at?: string
          avatar_url?: string | null
          badge_tier?: Database["public"]["Enums"]["badge_tier"]
          banner_url?: string | null
          bio?: string | null
          city?: string | null
          connected_socials?: string[]
          created_at?: string
          distance_mi?: number | null
          email: string
          featured_vehicles?: number
          heard_from?: string | null
          id?: string
          id_confidence?: number | null
          id_method?: string | null
          id_verified?: boolean
          id_verified_at?: string | null
          name: string
          payout_method?: string | null
          payout_schedule?: string
          phone?: string | null
          phone_verified?: boolean
          phone_verified_at?: string | null
          prior_referral?: string | null
          score?: number
          score_breakdown?: Json
          self_description?: string | null
          source?: Database["public"]["Enums"]["application_source"]
          specialties?: string[]
          state?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          step_reached?: number
          tagline?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
          zip?: string | null
        }
        Update: {
          activity_log?: Json
          admin_notes?: Json
          applied_at?: string
          avatar_url?: string | null
          badge_tier?: Database["public"]["Enums"]["badge_tier"]
          banner_url?: string | null
          bio?: string | null
          city?: string | null
          connected_socials?: string[]
          created_at?: string
          distance_mi?: number | null
          email?: string
          featured_vehicles?: number
          heard_from?: string | null
          id?: string
          id_confidence?: number | null
          id_method?: string | null
          id_verified?: boolean
          id_verified_at?: string | null
          name?: string
          payout_method?: string | null
          payout_schedule?: string
          phone?: string | null
          phone_verified?: boolean
          phone_verified_at?: string | null
          prior_referral?: string | null
          score?: number
          score_breakdown?: Json
          self_description?: string | null
          source?: Database["public"]["Enums"]["application_source"]
          specialties?: string[]
          state?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          step_reached?: number
          tagline?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_context: Json
          listing_id: string
          status: string
          updated_at: string
          user_id: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_context?: Json
          listing_id: string
          status?: string
          updated_at?: string
          user_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          listing_category?: Database["public"]["Enums"]["listing_category_enum"]
          listing_context?: Json
          listing_id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      claimed_promotions: {
        Row: {
          claimed_at: string
          clicks: number
          conversions: number
          earned: number
          gig_id: string
          id: string
          promoter_id: string
          referral_url: string
          status: string
          updated_at: string
        }
        Insert: {
          claimed_at?: string
          clicks?: number
          conversions?: number
          earned?: number
          gig_id: string
          id?: string
          promoter_id: string
          referral_url: string
          status?: string
          updated_at?: string
        }
        Update: {
          claimed_at?: string
          clicks?: number
          conversions?: number
          earned?: number
          gig_id?: string
          id?: string
          promoter_id?: string
          referral_url?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claimed_promotions_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "promotion_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claimed_promotions_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          approved_at: string | null
          commission_amount: number
          conversion_type: Database["public"]["Enums"]["conversion_type"]
          converted_at: string
          created_at: string
          id: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          metadata: Json | null
          paid_at: string | null
          promoter_id: string
          sale_amount: number | null
          status: Database["public"]["Enums"]["commission_status"]
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          commission_amount?: number
          conversion_type: Database["public"]["Enums"]["conversion_type"]
          converted_at?: string
          created_at?: string
          id?: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          metadata?: Json | null
          paid_at?: string | null
          promoter_id: string
          sale_amount?: number | null
          status?: Database["public"]["Enums"]["commission_status"]
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          commission_amount?: number
          conversion_type?: Database["public"]["Enums"]["conversion_type"]
          converted_at?: string
          created_at?: string
          id?: string
          listing_category?: Database["public"]["Enums"]["listing_category_enum"]
          listing_id?: string
          metadata?: Json | null
          paid_at?: string | null
          promoter_id?: string
          sale_amount?: number | null
          status?: Database["public"]["Enums"]["commission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experts: {
        Row: {
          bio: string | null
          city: string | null
          created_at: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          name: string
          photo_url: string | null
          rating: number | null
          response_time_hours: number | null
          review_count: number | null
          specialties: string[] | null
          state: string | null
          tagline: string | null
          updated_at: string
          user_id: string | null
          username: string | null
          zip: string | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          name: string
          photo_url?: string | null
          rating?: number | null
          response_time_hours?: number | null
          review_count?: number | null
          specialties?: string[] | null
          state?: string | null
          tagline?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
          zip?: string | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          name?: string
          photo_url?: string | null
          rating?: number | null
          response_time_hours?: number | null
          review_count?: number | null
          specialties?: string[] | null
          state?: string | null
          tagline?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          name: string | null
          notes: string | null
          phone: string | null
          promoter_id: string | null
          session_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          promoter_id?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          listing_category?: Database["public"]["Enums"]["listing_category_enum"]
          listing_id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          promoter_id?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_category?: Database["public"]["Enums"]["listing_category_enum"]
          listing_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          category: Database["public"]["Enums"]["listing_category_enum"]
          city: string | null
          created_at: string
          data: Json
          description: string | null
          id: string
          image: string | null
          images: string[]
          is_active: boolean
          location: string | null
          price: number | null
          state: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["listing_category_enum"]
          city?: string | null
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          image?: string | null
          images?: string[]
          is_active?: boolean
          location?: string | null
          price?: number | null
          state?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["listing_category_enum"]
          city?: string | null
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          image?: string | null
          images?: string[]
          is_active?: boolean
          location?: string | null
          price?: number | null
          state?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      otto_conversations: {
        Row: {
          broker_handoff_triggered: boolean | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          intent_signal: boolean | null
          listing_context_id: string | null
          listing_context_type: string | null
          page_context: string | null
          role: string
          session_id: string
          user_id: string | null
          voice_used: boolean | null
        }
        Insert: {
          broker_handoff_triggered?: boolean | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          intent_signal?: boolean | null
          listing_context_id?: string | null
          listing_context_type?: string | null
          page_context?: string | null
          role: string
          session_id: string
          user_id?: string | null
          voice_used?: boolean | null
        }
        Update: {
          broker_handoff_triggered?: boolean | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          intent_signal?: boolean | null
          listing_context_id?: string | null
          listing_context_type?: string | null
          page_context?: string | null
          role?: string
          session_id?: string
          user_id?: string | null
          voice_used?: boolean | null
        }
        Relationships: []
      }
      otto_feedback: {
        Row: {
          comment: string | null
          conversation_id: string
          created_at: string
          id: string
          message_id: string | null
          rating: number | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          message_id?: string | null
          rating?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          message_id?: string | null
          rating?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      otto_preferences: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          deal_type_preference: string | null
          id: string
          preferred_body_styles: string[] | null
          preferred_location: string | null
          preferred_makes: string[] | null
          preferred_payment: string[] | null
          saved_topics: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          deal_type_preference?: string | null
          id?: string
          preferred_body_styles?: string[] | null
          preferred_location?: string | null
          preferred_makes?: string[] | null
          preferred_payment?: string[] | null
          saved_topics?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          deal_type_preference?: string | null
          id?: string
          preferred_body_styles?: string[] | null
          preferred_location?: string | null
          preferred_makes?: string[] | null
          preferred_payment?: string[] | null
          saved_topics?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      otto_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan: string
          started_at: string | null
          status: string
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan: string
          started_at?: string | null
          status?: string
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan?: string
          started_at?: string | null
          status?: string
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payout_history: {
        Row: {
          amount: number
          created_at: string
          id: string
          payout_method: string
          promoter_id: string
          reference_id: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payout_method: string
          promoter_id: string
          reference_id?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payout_method?: string
          promoter_id?: string
          reference_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_history_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_settings: {
        Row: {
          created_at: string
          id: string
          payout_details: Json | null
          payout_method: string
          payout_schedule: string
          payout_threshold: number
          promoter_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          payout_details?: Json | null
          payout_method?: string
          payout_schedule?: string
          payout_threshold?: number
          promoter_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          payout_details?: Json | null
          payout_method?: string
          payout_schedule?: string
          payout_threshold?: number
          promoter_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_settings_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: true
            referencedRelation: "promoter_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promoter_profiles: {
        Row: {
          created_at: string
          id: string
          pending_earnings: number
          promoter_code: string
          total_earnings: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pending_earnings?: number
          promoter_code: string
          total_earnings?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pending_earnings?: number
          promoter_code?: string
          total_earnings?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promotion_gigs: {
        Row: {
          claimed_count: number
          commission_amount: number
          commission_type: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          location: string | null
          max_promoters: number | null
          seller_name: string | null
          seller_rating: number | null
          status: string
          title: string
          updated_at: string
          vehicle_type: string | null
        }
        Insert: {
          claimed_count?: number
          commission_amount?: number
          commission_type?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          location?: string | null
          max_promoters?: number | null
          seller_name?: string | null
          seller_rating?: number | null
          status?: string
          title: string
          updated_at?: string
          vehicle_type?: string | null
        }
        Update: {
          claimed_count?: number
          commission_amount?: number
          commission_type?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          listing_category?: Database["public"]["Enums"]["listing_category_enum"]
          listing_id?: string
          location?: string | null
          max_promoters?: number | null
          seller_name?: string | null
          seller_rating?: number | null
          status?: string
          title?: string
          updated_at?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      referral_clicks: {
        Row: {
          clicked_at: string
          id: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          promoter_id: string
          referral_url: string | null
          visitor_fingerprint: string | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          promoter_id: string
          referral_url?: string | null
          visitor_fingerprint?: string | null
        }
        Update: {
          clicked_at?: string
          id?: string
          listing_category?: Database["public"]["Enums"]["listing_category_enum"]
          listing_id?: string
          promoter_id?: string
          referral_url?: string | null
          visitor_fingerprint?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_clicks_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoter_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          created_at: string
          id: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_category: Database["public"]["Enums"]["listing_category_enum"]
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_category?: Database["public"]["Enums"]["listing_category_enum"]
          listing_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_commission: {
        Args: {
          p_category: Database["public"]["Enums"]["listing_category_enum"]
          p_conversion_type: Database["public"]["Enums"]["conversion_type"]
          p_sale_amount?: number
        }
        Returns: number
      }
      generate_promoter_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      application_source: "Organic" | "Referral" | "Social"
      application_status:
        | "pending"
        | "under_review"
        | "approved"
        | "rejected"
        | "suspended"
        | "waitlisted"
      badge_tier: "Starter" | "Pro" | "Elite" | "Legend"
      commission_status: "pending" | "approved" | "paid"
      conversion_type:
        | "lead"
        | "booking"
        | "signup"
        | "sale"
        | "rsvp"
        | "ticket"
      listing_category_enum:
        | "cars_for_sale"
        | "parts_accessories"
        | "service_providers"
        | "rentals"
        | "neighborhood_experts"
        | "events_meetups"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      application_source: ["Organic", "Referral", "Social"],
      application_status: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "suspended",
        "waitlisted",
      ],
      badge_tier: ["Starter", "Pro", "Elite", "Legend"],
      commission_status: ["pending", "approved", "paid"],
      conversion_type: ["lead", "booking", "signup", "sale", "rsvp", "ticket"],
      listing_category_enum: [
        "cars_for_sale",
        "parts_accessories",
        "service_providers",
        "rentals",
        "neighborhood_experts",
        "events_meetups",
      ],
    },
  },
} as const
