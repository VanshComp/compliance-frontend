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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analysis_results: {
        Row: {
          campaign_id: string
          compliance_code: string
          created_at: string
          id: string
          overall_score: number
          overall_status: string
          selected_guidelines: string[]
        }
        Insert: {
          campaign_id: string
          compliance_code: string
          created_at?: string
          id?: string
          overall_score?: number
          overall_status?: string
          selected_guidelines?: string[]
        }
        Update: {
          campaign_id?: string
          compliance_code?: string
          created_at?: string
          id?: string
          overall_score?: number
          overall_status?: string
          selected_guidelines?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_documents: {
        Row: {
          analysis_status: string
          campaign_type: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          analysis_status?: string
          campaign_type: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          analysis_status?: string
          campaign_type?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      compliance_guidelines: {
        Row: {
          created_at: string
          extraction_status: string
          file_url: string | null
          id: string
          metadata: Json | null
          name: string
          processed_content: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          extraction_status?: string
          file_url?: string | null
          id?: string
          metadata?: Json | null
          name: string
          processed_content?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          extraction_status?: string
          file_url?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          processed_content?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      compliance_violations: {
        Row: {
          analysis_id: string
          created_at: string
          description: string
          guideline_reference: string | null
          id: string
          severity: string
          suggested_fix: string | null
          violation_type: string
        }
        Insert: {
          analysis_id: string
          created_at?: string
          description: string
          guideline_reference?: string | null
          id?: string
          severity: string
          suggested_fix?: string | null
          violation_type: string
        }
        Update: {
          analysis_id?: string
          created_at?: string
          description?: string
          guideline_reference?: string | null
          id?: string
          severity?: string
          suggested_fix?: string | null
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_violations_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analysis_results"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_layers: {
        Row: {
          analysis_id: string
          created_at: string
          id: string
          issues: Json | null
          layer_name: string
          layer_number: number
          processing_details: Json | null
          recommendations: Json | null
          score: number | null
          status: string
          warnings: Json | null
        }
        Insert: {
          analysis_id: string
          created_at?: string
          id?: string
          issues?: Json | null
          layer_name: string
          layer_number: number
          processing_details?: Json | null
          recommendations?: Json | null
          score?: number | null
          status?: string
          warnings?: Json | null
        }
        Update: {
          analysis_id?: string
          created_at?: string
          id?: string
          issues?: Json | null
          layer_name?: string
          layer_number?: number
          processing_details?: Json | null
          recommendations?: Json | null
          score?: number | null
          status?: string
          warnings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_layers_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analysis_results"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
