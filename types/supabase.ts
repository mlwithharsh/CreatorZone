export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      creators: {
        Row: {
          id: string;
          name: string;
          username: string;
          bio: string | null;
          gender: Database["public"]["Enums"]["gender_enum"] | null;
          verified: boolean;
          location_country: string;
          location_state: string | null;
          location_city: string | null;
          followers: number;
          following: number;
          avg_views: number;
          avg_likes: number;
          engagement_rate: number;
          categories: Database["public"]["Enums"]["category_enum"][];
          platforms: Database["public"]["Enums"]["platform_enum"][];
          profile_image_url: string | null;
          cover_image_url: string | null;
          instagram_url: string | null;
          youtube_url: string | null;
          whatsapp_number: string | null;
          email: string | null;
          pricing_min: number | null;
          pricing_max: number | null;
          languages: string[];
          audience_gender_split: Json | null;
          audience_age_ranges: Json | null;
          audience_top_countries: Json | null;
          search_vector: unknown | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          username: string;
          bio?: string | null;
          gender?: Database["public"]["Enums"]["gender_enum"] | null;
          verified?: boolean;
          location_country: string;
          location_state?: string | null;
          location_city?: string | null;
          followers?: number;
          following?: number;
          avg_views?: number;
          avg_likes?: number;
          engagement_rate?: number;
          categories?: Database["public"]["Enums"]["category_enum"][];
          platforms?: Database["public"]["Enums"]["platform_enum"][];
          profile_image_url?: string | null;
          cover_image_url?: string | null;
          instagram_url?: string | null;
          youtube_url?: string | null;
          whatsapp_number?: string | null;
          email?: string | null;
          pricing_min?: number | null;
          pricing_max?: number | null;
          languages?: string[];
          audience_gender_split?: Json | null;
          audience_age_ranges?: Json | null;
          audience_top_countries?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["creators"]["Insert"]>;
        Relationships: [];
      };
      recent_posts: {
        Row: {
          id: string;
          creator_id: string;
          platform: Database["public"]["Enums"]["platform_enum"];
          thumbnail_url: string | null;
          caption: string | null;
          likes: number | null;
          comments: number | null;
          posted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          platform: Database["public"]["Enums"]["platform_enum"];
          thumbnail_url?: string | null;
          caption?: string | null;
          likes?: number | null;
          comments?: number | null;
          posted_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["recent_posts"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "recent_posts_creator_id_fkey";
            columns: ["creator_id"];
            referencedRelation: "creators";
            referencedColumns: ["id"];
          }
        ];
      };
      favorites: {
        Row: {
          id: string;
          device_id: string;
          creator_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          device_id: string;
          creator_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "favorites_creator_id_fkey";
            columns: ["creator_id"];
            referencedRelation: "creators";
            referencedColumns: ["id"];
          }
        ];
      };
      search_history: {
        Row: {
          id: string;
          device_id: string;
          query_text: string | null;
          filters: Json;
          result_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          device_id: string;
          query_text?: string | null;
          filters?: Json;
          result_count?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["search_history"]["Insert"]>;
        Relationships: [];
      };
      import_logs: {
        Row: {
          id: string;
          source: string;
          rows_imported: number;
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source: string;
          rows_imported?: number;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["import_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      mv_dashboard_stats: {
        Row: {
          total_creators: number | null;
          verified_creators: number | null;
          avg_engagement_rate: number | null;
          avg_followers: number | null;
        };
        Relationships: [];
      };
      mv_platform_distribution: {
        Row: {
          platform: Database["public"]["Enums"]["platform_enum"] | null;
          creator_count: number | null;
        };
        Relationships: [];
      };
      mv_category_distribution: {
        Row: {
          category: Database["public"]["Enums"]["category_enum"] | null;
          creator_count: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      search_creators: {
        Args: {
          p_query?: string | null;
          p_platforms?: Database["public"]["Enums"]["platform_enum"][] | null;
          p_categories?: Database["public"]["Enums"]["category_enum"][] | null;
          p_min_followers?: number | null;
          p_max_followers?: number | null;
          p_min_engagement?: number | null;
          p_max_engagement?: number | null;
          p_country?: string | null;
          p_state?: string | null;
          p_city?: string | null;
          p_language?: string | null;
          p_verified?: boolean | null;
          p_gender?: Database["public"]["Enums"]["gender_enum"] | null;
          p_min_price?: number | null;
          p_max_price?: number | null;
          p_min_avg_views?: number | null;
          p_min_avg_likes?: number | null;
          p_sort_by?: string | null;
          p_sort_dir?: string | null;
          p_page?: number | null;
          p_page_size?: number | null;
        };
        Returns: {
          id: string;
          name: string;
          username: string;
          bio: string | null;
          verified: boolean;
          location_country: string;
          location_state: string | null;
          location_city: string | null;
          followers: number;
          avg_views: number;
          avg_likes: number;
          engagement_rate: number;
          categories: Database["public"]["Enums"]["category_enum"][];
          platforms: Database["public"]["Enums"]["platform_enum"][];
          profile_image_url: string | null;
          total_count: number;
        }[];
      };
      refresh_dashboard_views: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      platform_enum: "instagram" | "youtube" | "linkedin" | "twitter";
      category_enum:
        | "fashion"
        | "lifestyle"
        | "tech"
        | "finance"
        | "gaming"
        | "comedy"
        | "education"
        | "fitness"
        | "beauty"
        | "travel"
        | "food";
      gender_enum: "male" | "female" | "non_binary" | "unspecified";
    };
    CompositeTypes: Record<PropertyKey, never>;
  };
};
