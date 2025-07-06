export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          banner_image_url: string | null
          body: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published: boolean | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          banner_image_url?: string | null
          body?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          banner_image_url?: string | null
          body?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published?: boolean | null
          reading_time?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          order_index: number
          pdf_url: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          order_index?: number
          pdf_url: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          order_index?: number
          pdf_url?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          epa_approved: boolean | null
          id: string
          order_id: string
          packaging: string | null
          price: number
          product_id: string | null
          product_name: string
          quantity: number
          sku: string | null
        }
        Insert: {
          created_at?: string | null
          epa_approved?: boolean | null
          id?: string
          order_id: string
          packaging?: string | null
          price: number
          product_id?: string | null
          product_name: string
          quantity?: number
          sku?: string | null
        }
        Update: {
          created_at?: string | null
          epa_approved?: boolean | null
          id?: string
          order_id?: string
          packaging?: string | null
          price?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_items_order_id"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_email: string
          customer_name: string
          id: string
          items: Json | null
          notes: string | null
          order_number: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          status: string | null
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          customer_name: string
          id?: string
          items?: Json | null
          notes?: string | null
          order_number?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string | null
          tax_amount?: number | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          id?: string
          items?: Json | null
          notes?: string | null
          order_number?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string | null
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          applications: Json | null
          availability: string | null
          brand: string | null
          cas_number: string | null
          category: string | null
          certificate_urls: Json | null
          chemical_formula: string | null
          condition: string | null
          created_at: string | null
          description: string | null
          dimensions: Json | null
          epa_approved: boolean | null
          gtin: string | null
          hazard_class: string | null
          id: string
          images: string[] | null
          name: string
          packaging: Json | null
          price: number
          sds_url: string | null
          shipping_weight: string | null
          sku: string | null
          stock_quantity: number | null
          technical_specs: Json | null
          thumbnail_url: string | null
          un_number: string | null
          updated_at: string | null
        }
        Insert: {
          applications?: Json | null
          availability?: string | null
          brand?: string | null
          cas_number?: string | null
          category?: string | null
          certificate_urls?: Json | null
          chemical_formula?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          epa_approved?: boolean | null
          gtin?: string | null
          hazard_class?: string | null
          id?: string
          images?: string[] | null
          name: string
          packaging?: Json | null
          price: number
          sds_url?: string | null
          shipping_weight?: string | null
          sku?: string | null
          stock_quantity?: number | null
          technical_specs?: Json | null
          thumbnail_url?: string | null
          un_number?: string | null
          updated_at?: string | null
        }
        Update: {
          applications?: Json | null
          availability?: string | null
          brand?: string | null
          cas_number?: string | null
          category?: string | null
          certificate_urls?: Json | null
          chemical_formula?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          epa_approved?: boolean | null
          gtin?: string | null
          hazard_class?: string | null
          id?: string
          images?: string[] | null
          name?: string
          packaging?: Json | null
          price?: number
          sds_url?: string | null
          shipping_weight?: string | null
          sku?: string | null
          stock_quantity?: number | null
          technical_specs?: Json | null
          thumbnail_url?: string | null
          un_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      table: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          order_index: number
          position: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          order_index?: number
          position: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          order_index?: number
          position?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
