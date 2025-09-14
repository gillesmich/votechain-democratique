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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blockchain_transactions: {
        Row: {
          block_number: number | null
          created_at: string
          gas_price: number | null
          gas_used: number | null
          id: string
          metadata: Json | null
          status: string
          transaction_hash: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          block_number?: number | null
          created_at?: string
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          metadata?: Json | null
          status?: string
          transaction_hash: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          block_number?: number | null
          created_at?: string
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          metadata?: Json | null
          status?: string
          transaction_hash?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      democracy_tokens: {
        Row: {
          created_at: string
          earned_tokens: number
          id: string
          last_reward_date: string | null
          spent_tokens: number
          token_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          earned_tokens?: number
          id?: string
          last_reward_date?: string | null
          spent_tokens?: number
          token_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          earned_tokens?: number
          id?: string
          last_reward_date?: string | null
          spent_tokens?: number
          token_balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string
          username: string | null
          verification_level: number | null
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
          username?: string | null
          verification_level?: number | null
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
          username?: string | null
          verification_level?: number | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      user_votes: {
        Row: {
          blockchain_tx_hash: string | null
          id: string
          topic_id: string
          user_id: string
          vote_choice: string
          vote_weight: number | null
          voted_at: string
        }
        Insert: {
          blockchain_tx_hash?: string | null
          id?: string
          topic_id: string
          user_id: string
          vote_choice: string
          vote_weight?: number | null
          voted_at?: string
        }
        Update: {
          blockchain_tx_hash?: string | null
          id?: string
          topic_id?: string
          user_id?: string
          vote_choice?: string
          vote_weight?: number | null
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_votes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "voting_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      voting_topics: {
        Row: {
          blockchain_hash: string | null
          category: string
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          news_url: string | null
          source: string | null
          title: string
          total_votes: number | null
          updated_at: string
        }
        Insert: {
          blockchain_hash?: string | null
          category: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          news_url?: string | null
          source?: string | null
          title: string
          total_votes?: number | null
          updated_at?: string
        }
        Update: {
          blockchain_hash?: string | null
          category?: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          news_url?: string | null
          source?: string | null
          title?: string
          total_votes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_vote_count: {
        Args: { topic_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
