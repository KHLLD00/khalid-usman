export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      projects: {
        Row: {
          category: string;
          content_blocks: Json;
          cover_image_alt: string;
          cover_image_url: string | null;
          created_at: string;
          design_decisions: string;
          design_process: string;
          external_links: Json;
          featured: boolean;
          final_solution: string;
          gallery: Json;
          hero_image_alt: string;
          hero_image_url: string | null;
          id: string;
          insights: string;
          overview: string;
          problem: string;
          published: boolean;
          reflection: string;
          research: string;
          results: string;
          role: string;
          short_description: string;
          slug: string;
          sort_order: number;
          thumbnail_url: string | null;
          title: string;
          tools: string[];
          updated_at: string;
          year: string;
        };
        Insert: {
          category?: string;
          content_blocks?: Json;
          cover_image_alt?: string;
          cover_image_url?: string | null;
          created_at?: string;
          design_decisions?: string;
          design_process?: string;
          external_links?: Json;
          featured?: boolean;
          final_solution?: string;
          gallery?: Json;
          hero_image_alt?: string;
          hero_image_url?: string | null;
          id?: string;
          insights?: string;
          overview?: string;
          problem?: string;
          published?: boolean;
          reflection?: string;
          research?: string;
          results?: string;
          role?: string;
          short_description?: string;
          slug: string;
          sort_order?: number;
          thumbnail_url?: string | null;
          title: string;
          tools?: string[];
          updated_at?: string;
          year?: string;
        };
        Update: {
          category?: string;
          content_blocks?: Json;
          cover_image_alt?: string;
          cover_image_url?: string | null;
          created_at?: string;
          design_decisions?: string;
          design_process?: string;
          external_links?: Json;
          featured?: boolean;
          final_solution?: string;
          gallery?: Json;
          hero_image_alt?: string;
          hero_image_url?: string | null;
          id?: string;
          insights?: string;
          overview?: string;
          problem?: string;
          published?: boolean;
          reflection?: string;
          research?: string;
          results?: string;
          role?: string;
          short_description?: string;
          slug?: string;
          sort_order?: number;
          thumbnail_url?: string | null;
          title?: string;
          tools?: string[];
          updated_at?: string;
          year?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: string;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: string;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      nav_items: {
        Row: {
          created_at: string;
          id: string;
          label: string;
          sort_order: number;
          updated_at: string;
          url: string;
          visible: boolean;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label?: string;
          sort_order?: number;
          updated_at?: string;
          url?: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          id?: string;
          label?: string;
          sort_order?: number;
          updated_at?: string;
          url?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      experiments: {
        Row: {
          category: string;
          created_at: string;
          description: string;
          external_url: string;
          id: string;
          image_alt: string;
          image_url: string | null;
          published: boolean;
          sort_order: number;
          title: string;
          updated_at: string;
          year: string;
        };
        Insert: {
          category?: string;
          created_at?: string;
          description?: string;
          external_url?: string;
          id?: string;
          image_alt?: string;
          image_url?: string | null;
          published?: boolean;
          sort_order?: number;
          title?: string;
          updated_at?: string;
          year?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string;
          external_url?: string;
          id?: string;
          image_alt?: string;
          image_url?: string | null;
          published?: boolean;
          sort_order?: number;
          title?: string;
          updated_at?: string;
          year?: string;
        };
        Relationships: [];
      };
      toolkit_items: {
        Row: {
          category: string | null;
          created_at: string;
          id: string;
          name: string;
          sort_order: number;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          sort_order?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          sort_order?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const;
