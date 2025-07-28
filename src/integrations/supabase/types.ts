export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      adverts: {
        Row: {
          content: string
          created_at: string
          dismissible: boolean
          end_date: string | null
          id: string
          is_active: boolean
          order_index: number
          start_date: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          dismissible?: boolean
          end_date?: string | null
          id?: string
          is_active?: boolean
          order_index?: number
          start_date?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          dismissible?: boolean
          end_date?: string | null
          id?: string
          is_active?: boolean
          order_index?: number
          start_date?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      asic_miners: {
        Row: {
          available_units: number
          brand: string
          created_at: string
          daily_earnings_btc: number
          efficiency: number
          hashrate_th: number
          id: string
          image_url: string | null
          location: string
          min_purchase_fraction: number
          model: string
          noise_level: number | null
          power_consumption: number
          price: number
          roi_months: number
          status: string
          temperature: number | null
          total_units: number
          updated_at: string
        }
        Insert: {
          available_units?: number
          brand: string
          created_at?: string
          daily_earnings_btc: number
          efficiency: number
          hashrate_th: number
          id?: string
          image_url?: string | null
          location?: string
          min_purchase_fraction?: number
          model: string
          noise_level?: number | null
          power_consumption: number
          price: number
          roi_months: number
          status?: string
          temperature?: number | null
          total_units?: number
          updated_at?: string
        }
        Update: {
          available_units?: number
          brand?: string
          created_at?: string
          daily_earnings_btc?: number
          efficiency?: number
          hashrate_th?: number
          id?: string
          image_url?: string | null
          location?: string
          min_purchase_fraction?: number
          model?: string
          noise_level?: number | null
          power_consumption?: number
          price?: number
          roi_months?: number
          status?: string
          temperature?: number | null
          total_units?: number
          updated_at?: string
        }
        Relationships: []
      }
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
      contact_info: {
        Row: {
          category: string
          contact_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          label: string
          order_index: number
          updated_at: string
          value: string
        }
        Insert: {
          category: string
          contact_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label: string
          order_index?: number
          updated_at?: string
          value: string
        }
        Update: {
          category?: string
          contact_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label?: string
          order_index?: number
          updated_at?: string
          value?: string
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
      coupons: {
        Row: {
          code: string
          created_at: string
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          minimum_order_amount: number | null
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          minimum_order_amount?: number | null
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          minimum_order_amount?: number | null
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      featured_products: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          order_index: number
          product_id: string
          section_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          product_id: string
          section_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          product_id?: string
          section_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean | null
          page_name: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean | null
          page_name: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
          page_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      miner_ownerships: {
        Row: {
          created_at: string
          id: string
          miner_id: string
          ownership_fraction: number
          purchase_date: string
          purchase_price: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          miner_id: string
          ownership_fraction: number
          purchase_date?: string
          purchase_price: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          miner_id?: string
          ownership_fraction?: number
          purchase_date?: string
          purchase_price?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "miner_ownerships_miner_id_fkey"
            columns: ["miner_id"]
            isOneToOne: false
            referencedRelation: "asic_miners"
            referencedColumns: ["id"]
          },
        ]
      }
      mining_payouts: {
        Row: {
          amount_btc: number
          amount_usd: number
          btc_price_usd: number
          created_at: string
          id: string
          ownership_id: string
          payout_date: string
          status: string
          transaction_hash: string | null
          user_id: string
        }
        Insert: {
          amount_btc: number
          amount_usd: number
          btc_price_usd: number
          created_at?: string
          id?: string
          ownership_id: string
          payout_date?: string
          status?: string
          transaction_hash?: string | null
          user_id: string
        }
        Update: {
          amount_btc?: number
          amount_usd?: number
          btc_price_usd?: number
          created_at?: string
          id?: string
          ownership_id?: string
          payout_date?: string
          status?: string
          transaction_hash?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mining_payouts_ownership_id_fkey"
            columns: ["ownership_id"]
            isOneToOne: false
            referencedRelation: "miner_ownerships"
            referencedColumns: ["id"]
          },
        ]
      }
      mining_stats: {
        Row: {
          actual_hashrate_th: number
          btc_mined: number
          created_at: string
          date: string
          id: string
          maintenance_notes: string | null
          miner_id: string
          power_consumption_kwh: number
          uptime_percentage: number
        }
        Insert: {
          actual_hashrate_th: number
          btc_mined: number
          created_at?: string
          date: string
          id?: string
          maintenance_notes?: string | null
          miner_id: string
          power_consumption_kwh: number
          uptime_percentage?: number
        }
        Update: {
          actual_hashrate_th?: number
          btc_mined?: number
          created_at?: string
          date?: string
          id?: string
          maintenance_notes?: string | null
          miner_id?: string
          power_consumption_kwh?: number
          uptime_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "mining_stats_miner_id_fkey"
            columns: ["miner_id"]
            isOneToOne: false
            referencedRelation: "asic_miners"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          name: string | null
          source: string | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
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
          payment_details: Json | null
          payment_method: string | null
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
          payment_details?: Json | null
          payment_method?: string | null
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
          payment_details?: Json | null
          payment_method?: string | null
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
          container_20ft_price: number | null
          container_40ft_price: number | null
          created_at: string | null
          description: string | null
          dimensions: Json | null
          discount_20ft: number | null
          discount_40ft: number | null
          epa_approved: boolean | null
          gtin: string | null
          hazard_class: string | null
          id: string
          images: string[] | null
          name: string
          packaging: Json | null
          packaging_options: Json | null
          pallet_price: number | null
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
          container_20ft_price?: number | null
          container_40ft_price?: number | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          discount_20ft?: number | null
          discount_40ft?: number | null
          epa_approved?: boolean | null
          gtin?: string | null
          hazard_class?: string | null
          id?: string
          images?: string[] | null
          name: string
          packaging?: Json | null
          packaging_options?: Json | null
          pallet_price?: number | null
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
          container_20ft_price?: number | null
          container_40ft_price?: number | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          discount_20ft?: number | null
          discount_40ft?: number | null
          epa_approved?: boolean | null
          gtin?: string | null
          hazard_class?: string | null
          id?: string
          images?: string[] | null
          name?: string
          packaging?: Json | null
          packaging_options?: Json | null
          pallet_price?: number | null
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
      quote_items: {
        Row: {
          created_at: string
          id: string
          packaging: string | null
          product_id: string | null
          product_name: string
          quantity: number
          quote_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          packaging?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          quote_id: string
        }
        Update: {
          created_at?: string
          id?: string
          packaging?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_quote_items_quote_id"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          company_name: string | null
          created_at: string
          customer_email: string
          customer_name: string
          id: string
          notes: string | null
          phone: string | null
          quote_number: string | null
          shipping_address: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          quote_number?: string | null
          shipping_address?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          quote_number?: string | null
          shipping_address?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_audit: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          target_user_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string | null
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
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string | null
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
      testimonials: {
        Row: {
          approved: boolean | null
          company: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          order_index: number | null
          position: string | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          company?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          order_index?: number | null
          position?: string | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          company?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          order_index?: number | null
          position?: string | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          updated_at: string
          user_id: string
          verified: boolean
          wallet_address: string
          wallet_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          updated_at?: string
          user_id: string
          verified?: boolean
          wallet_address: string
          wallet_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          updated_at?: string
          user_id?: string
          verified?: boolean
          wallet_address?: string
          wallet_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: { target_user_id: string; new_role: string }
        Returns: boolean
      }
      calculate_bulk_price: {
        Args: { base_price: number; package_type: string }
        Returns: number
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_quote_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
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
