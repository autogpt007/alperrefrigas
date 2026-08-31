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
          type: string
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
      blog_post_stats: {
        Row: {
          blog_post_id: string
          country_stats: Json
          created_at: string
          id: string
          last_updated: string
          total_views: number
          unique_views: number
        }
        Insert: {
          blog_post_id: string
          country_stats: Json
          created_at?: string
          id?: string
          last_updated?: string
          total_views?: number
          unique_views?: number
        }
        Update: {
          blog_post_id?: string
          country_stats?: Json
          created_at?: string
          id?: string
          last_updated?: string
          total_views?: number
          unique_views?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_stats_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_views: {
        Row: {
          blog_post_id: string
          country_code: string | null
          country_name: string | null
          created_at: string
          id: string
          referrer: string | null
          user_agent: string | null
          user_id: string | null
          viewer_ip_hash: string
        }
        Insert: {
          blog_post_id: string
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          id?: string
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewer_ip_hash: string
        }
        Update: {
          blog_post_id?: string
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          id?: string
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewer_ip_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_views_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
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
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          min_order_amount: number | null
          updated_at: string
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          updated_at?: string
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          updated_at?: string
          used_count?: number
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
      generated_documents: {
        Row: {
          amount_paid: number
          buyer_address: string | null
          buyer_company: string | null
          buyer_country: string | null
          buyer_email: string | null
          buyer_name: string
          buyer_phone: string | null
          created_at: string
          created_by: string | null
          currency: string
          discount_percent: number
          document_number: string
          document_type: string
          due_date: string | null
          id: string
          items: Json
          notes: string | null
          order_id: string | null
          payment_method: string | null
          payment_terms: string | null
          pdf_path: string | null
          pdf_url: string | null
          po_number: string | null
          ship_to_address: string | null
          shipping_cost: number
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
          validity_days: number
        }
        Insert: {
          amount_paid?: number
          buyer_address?: string | null
          buyer_company?: string | null
          buyer_country?: string | null
          buyer_email?: string | null
          buyer_name: string
          buyer_phone?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          discount_percent?: number
          document_number: string
          document_type: string
          due_date?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_id?: string | null
          payment_method?: string | null
          payment_terms?: string | null
          pdf_path?: string | null
          pdf_url?: string | null
          po_number?: string | null
          ship_to_address?: string | null
          shipping_cost?: number
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          validity_days?: number
        }
        Update: {
          amount_paid?: number
          buyer_address?: string | null
          buyer_company?: string | null
          buyer_country?: string | null
          buyer_email?: string | null
          buyer_name?: string
          buyer_phone?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          discount_percent?: number
          document_number?: string
          document_type?: string
          due_date?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_id?: string | null
          payment_method?: string | null
          payment_terms?: string | null
          pdf_path?: string | null
          pdf_url?: string | null
          po_number?: string | null
          ship_to_address?: string | null
          shipping_cost?: number
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          validity_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
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
      kyc_verifications: {
        Row: {
          admin_notes: string | null
          billing_address: Json | null
          billing_name: string | null
          card_back_url: string | null
          card_front_url: string | null
          created_at: string
          id: string
          id_document_url: string | null
          order_id: string
          selfie_url: string | null
          status: string
          submitted_at: string | null
          token: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          billing_address?: Json | null
          billing_name?: string | null
          card_back_url?: string | null
          card_front_url?: string | null
          created_at?: string
          id?: string
          id_document_url?: string | null
          order_id: string
          selfie_url?: string | null
          status?: string
          submitted_at?: string | null
          token: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          billing_address?: Json | null
          billing_name?: string | null
          card_back_url?: string | null
          card_front_url?: string | null
          created_at?: string
          id?: string
          id_document_url?: string | null
          order_id?: string
          selfie_url?: string | null
          status?: string
          submitted_at?: string | null
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_verifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          configuration_json: Json | null
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
          configuration_json?: Json | null
          created_at?: string | null
          epa_approved?: boolean | null
          id?: string
          order_id: string
          packaging?: string | null
          price: number
          product_id?: string | null
          product_name: string
          quantity: number
          sku?: string | null
        }
        Update: {
          configuration_json?: Json | null
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
            foreignKeyName: "order_items_order_id_fkey"
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
          cashapp_tag: string | null
          created_at: string | null
          customer_email: string
          customer_name: string
          id: string
          items: Json | null
          notes: string | null
          order_number: string | null
          payment_details: Json | null
          payment_method: string | null
          phone: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          status: string | null
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
          zelle_tag: string | null
        }
        Insert: {
          cashapp_tag?: string | null
          created_at?: string | null
          customer_email: string
          customer_name: string
          id?: string
          items?: Json | null
          notes?: string | null
          order_number?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          phone?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string | null
          tax_amount?: number | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          zelle_tag?: string | null
        }
        Update: {
          cashapp_tag?: string | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          id?: string
          items?: Json | null
          notes?: string | null
          order_number?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          phone?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string | null
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          zelle_tag?: string | null
        }
        Relationships: []
      }
      page_content_blocks: {
        Row: {
          block_type: string
          content: Json
          created_at: string
          id: string
          is_active: boolean
          order_index: number
          page_slug: string
          section_key: string
          updated_at: string
        }
        Insert: {
          block_type: string
          content: Json
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          page_slug: string
          section_key: string
          updated_at?: string
        }
        Update: {
          block_type?: string
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          page_slug?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          ac_type: string | null
          applications: Json | null
          availability: string | null
          base_unit_price: number | null
          brand: string | null
          btu: number | null
          cas_number: string | null
          category: string | null
          certificate_urls: Json | null
          chemical_formula: string | null
          comes_with_accessories: Json | null
          comes_with_base: Json | null
          condition: string | null
          container_20ft_price: number | null
          container_40ft_price: number | null
          created_at: string | null
          custom_uplift_20_39: number | null
          custom_uplift_40_half: number | null
          custom_uplift_5_19: number | null
          description: string | null
          dimensions: Json | null
          discount_20ft: number | null
          discount_40ft: number | null
          efficiency_label: string | null
          epa_approved: boolean | null
          frequency: string | null
          google_product_category: string | null
          gtin: string | null
          hazard_class: string | null
          height_cm: number | null
          id: string
          identifier_exists: boolean | null
          images: string[] | null
          length_cm: number | null
          max_room_size: string | null
          mid_bulk_uplift_percent: number | null
          mpn: string | null
          name: string
          packaging: Json | null
          packaging_options: Json | null
          pallet_price: number | null
          phase: string | null
          plug_type: string | null
          price: number
          product_type: string
          q20_units: number | null
          q40_units: number | null
          refrigerant_type: string | null
          sds_url: string | null
          shipping_weight: string | null
          sku: string | null
          stock_quantity: number | null
          technical_specs: Json | null
          thumbnail_url: string | null
          un_number: string | null
          updated_at: string | null
          voltage: string | null
          weight_kg: number | null
          width_cm: number | null
        }
        Insert: {
          ac_type?: string | null
          applications?: Json | null
          availability?: string | null
          base_unit_price?: number | null
          brand?: string | null
          btu?: number | null
          cas_number?: string | null
          category?: string | null
          certificate_urls?: Json | null
          chemical_formula?: string | null
          comes_with_accessories?: Json | null
          comes_with_base?: Json | null
          condition?: string | null
          container_20ft_price?: number | null
          container_40ft_price?: number | null
          created_at?: string | null
          custom_uplift_20_39?: number | null
          custom_uplift_40_half?: number | null
          custom_uplift_5_19?: number | null
          description?: string | null
          dimensions?: Json | null
          discount_20ft?: number | null
          discount_40ft?: number | null
          efficiency_label?: string | null
          epa_approved?: boolean | null
          frequency?: string | null
          google_product_category?: string | null
          gtin?: string | null
          hazard_class?: string | null
          height_cm?: number | null
          id?: string
          identifier_exists?: boolean | null
          images?: string[] | null
          length_cm?: number | null
          max_room_size?: string | null
          mid_bulk_uplift_percent?: number | null
          mpn?: string | null
          name: string
          packaging?: Json | null
          packaging_options?: Json | null
          pallet_price?: number | null
          phase?: string | null
          plug_type?: string | null
          price: number
          product_type: string
          q20_units?: number | null
          q40_units?: number | null
          refrigerant_type?: string | null
          sds_url?: string | null
          shipping_weight?: string | null
          sku?: string | null
          stock_quantity?: number | null
          technical_specs?: Json | null
          thumbnail_url?: string | null
          un_number?: string | null
          updated_at?: string | null
          voltage?: string | null
          weight_kg?: number | null
          width_cm?: number | null
        }
        Update: {
          ac_type?: string | null
          applications?: Json | null
          availability?: string | null
          base_unit_price?: number | null
          brand?: string | null
          btu?: number | null
          cas_number?: string | null
          category?: string | null
          certificate_urls?: Json | null
          chemical_formula?: string | null
          comes_with_accessories?: Json | null
          comes_with_base?: Json | null
          condition?: string | null
          container_20ft_price?: number | null
          container_40ft_price?: number | null
          created_at?: string | null
          custom_uplift_20_39?: number | null
          custom_uplift_40_half?: number | null
          custom_uplift_5_19?: number | null
          description?: string | null
          dimensions?: Json | null
          discount_20ft?: number | null
          discount_40ft?: number | null
          efficiency_label?: string | null
          epa_approved?: boolean | null
          frequency?: string | null
          google_product_category?: string | null
          gtin?: string | null
          hazard_class?: string | null
          height_cm?: number | null
          id?: string
          identifier_exists?: boolean | null
          images?: string[] | null
          length_cm?: number | null
          max_room_size?: string | null
          mid_bulk_uplift_percent?: number | null
          mpn?: string | null
          name?: string
          packaging?: Json | null
          packaging_options?: Json | null
          pallet_price?: number | null
          phase?: string | null
          plug_type?: string | null
          price?: number
          product_type?: string
          q20_units?: number | null
          q40_units?: number | null
          refrigerant_type?: string | null
          sds_url?: string | null
          shipping_weight?: string | null
          sku?: string | null
          stock_quantity?: number | null
          technical_specs?: Json | null
          thumbnail_url?: string | null
          un_number?: string | null
          updated_at?: string | null
          voltage?: string | null
          weight_kg?: number | null
          width_cm?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
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
          quantity: number
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
            foreignKeyName: "quote_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: { new_role: string; target_user_id: string }
        Returns: boolean
      }
      calculate_bulk_price: {
        Args: { base_price: number; package_type: string }
        Returns: number
      }
      can_access_order: {
        Args: { order_num?: string; order_user_id: string }
        Returns: boolean
      }
      generate_order_number: { Args: never; Returns: string }
      generate_quote_number: { Args: never; Returns: string }
      get_current_user_role: { Args: never; Returns: string }
      get_db_health: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_user: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    },
  },
} as const
