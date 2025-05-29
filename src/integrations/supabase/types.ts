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
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturers: {
        Row: {
          address: Json | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          store_id: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          store_id: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          store_id?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manufacturers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
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
          created_at: string
          id: string
          status: string
          store_id: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          store_id: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          store_id?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variant_combination_values: {
        Row: {
          combination_id: string
          id: string
          variant_value_id: string
        }
        Insert: {
          combination_id: string
          id?: string
          variant_value_id: string
        }
        Update: {
          combination_id?: string
          id?: string
          variant_value_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variant_combination_values_combination_id_fkey"
            columns: ["combination_id"]
            isOneToOne: false
            referencedRelation: "product_variant_combinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variant_combination_values_variant_value_id_fkey"
            columns: ["variant_value_id"]
            isOneToOne: false
            referencedRelation: "product_variant_values"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variant_combinations: {
        Row: {
          compare_at_price: number | null
          cost_per_item: number | null
          created_at: string
          id: string
          is_active: boolean
          price: number | null
          product_id: string
          sku: string | null
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          compare_at_price?: number | null
          cost_per_item?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          price?: number | null
          product_id: string
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          compare_at_price?: number | null
          cost_per_item?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          price?: number | null
          product_id?: string
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variant_combinations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variant_group_prices: {
        Row: {
          created_at: string
          group_price: number | null
          id: string
          product_id: string
          updated_at: string
          variant_value_id: string
        }
        Insert: {
          created_at?: string
          group_price?: number | null
          id?: string
          product_id: string
          updated_at?: string
          variant_value_id: string
        }
        Update: {
          created_at?: string
          group_price?: number | null
          id?: string
          product_id?: string
          updated_at?: string
          variant_value_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variant_group_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variant_group_prices_variant_value_id_fkey"
            columns: ["variant_value_id"]
            isOneToOne: false
            referencedRelation: "product_variant_values"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variant_values: {
        Row: {
          created_at: string
          id: string
          position: number
          updated_at: string
          value: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          position?: number
          updated_at?: string
          value: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          updated_at?: string
          value?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variant_values_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          name: string
          position: number
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position?: number
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category_id: string | null
          compare_at_price: number | null
          continue_selling_when_out_of_stock: boolean
          cost_per_item: number | null
          created_at: string
          description: string | null
          gallery_images: string[] | null
          id: string
          image_url: string | null
          is_active: boolean
          manufacturer_id: string | null
          name: string
          price: number
          profit_margin: number | null
          seo_description: string | null
          seo_title: string | null
          sku: string | null
          stock_quantity: number
          store_id: string
          tags: string[] | null
          track_quantity: boolean
          updated_at: string
          weight: number | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          continue_selling_when_out_of_stock?: boolean
          cost_per_item?: number | null
          created_at?: string
          description?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          manufacturer_id?: string | null
          name: string
          price?: number
          profit_margin?: number | null
          seo_description?: string | null
          seo_title?: string | null
          sku?: string | null
          stock_quantity?: number
          store_id: string
          tags?: string[] | null
          track_quantity?: boolean
          updated_at?: string
          weight?: number | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          continue_selling_when_out_of_stock?: boolean
          cost_per_item?: number | null
          created_at?: string
          description?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          manufacturer_id?: string | null
          name?: string
          price?: number
          profit_margin?: number | null
          seo_description?: string | null
          seo_title?: string | null
          sku?: string | null
          stock_quantity?: number
          store_id?: string
          tags?: string[] | null
          track_quantity?: boolean
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          store_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          created_at: string
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          end_date: string
          id: string
          is_active: boolean
          name: string
          priority: number
          product_id: string
          start_date: string
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          end_date: string
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          product_id: string
          start_date: string
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          end_date?: string
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          product_id?: string
          start_date?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          banner_url: string | null
          contact_info: Json | null
          created_at: string
          id: string
          logo_url: string | null
          payment_settings: Json | null
          price_color: string
          primary_color: string
          promotion_display_format: Database["public"]["Enums"]["promotion_display_format"]
          secondary_color: string
          shipping_settings: Json | null
          show_category: boolean
          show_description: boolean
          show_price: boolean
          show_promotion_badge: boolean
          show_stock_quantity: boolean
          store_description: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          logo_url?: string | null
          payment_settings?: Json | null
          price_color?: string
          primary_color?: string
          promotion_display_format?: Database["public"]["Enums"]["promotion_display_format"]
          secondary_color?: string
          shipping_settings?: Json | null
          show_category?: boolean
          show_description?: boolean
          show_price?: boolean
          show_promotion_badge?: boolean
          show_stock_quantity?: boolean
          store_description?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          logo_url?: string | null
          payment_settings?: Json | null
          price_color?: string
          primary_color?: string
          promotion_display_format?: Database["public"]["Enums"]["promotion_display_format"]
          secondary_color?: string
          shipping_settings?: Json | null
          show_category?: boolean
          show_description?: boolean
          show_price?: boolean
          show_promotion_badge?: boolean
          show_stock_quantity?: boolean
          store_description?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          created_at: string
          custom_domain: string | null
          domain: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_domain?: string | null
          domain: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_domain?: string | null
          domain?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_promotions: {
        Row: {
          created_at: string | null
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"] | null
          discount_value: number | null
          end_date: string | null
          id: string | null
          is_active: boolean | null
          name: string | null
          original_price: number | null
          priority: number | null
          product_id: string | null
          product_name: string | null
          promotional_price: number | null
          start_date: string | null
          store_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_promotional_price: {
        Args: {
          p_original_price: number
          p_discount_type: Database["public"]["Enums"]["discount_type"]
          p_discount_value: number
        }
        Returns: number
      }
      get_store_by_domain: {
        Args: { domain_name: string }
        Returns: string
      }
      get_user_store_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_promotion_current: {
        Args: { p_start_date: string; p_end_date: string; p_is_active: boolean }
        Returns: boolean
      }
      is_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      discount_type: "percentage" | "fixed_amount"
      promotion_display_format: "percentage" | "comparison"
      user_role: "user" | "admin"
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
    Enums: {
      discount_type: ["percentage", "fixed_amount"],
      promotion_display_format: ["percentage", "comparison"],
      user_role: ["user", "admin"],
    },
  },
} as const
