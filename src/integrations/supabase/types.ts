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
      bundle_items: {
        Row: {
          bundle_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
        }
        Insert: {
          bundle_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
        }
        Update: {
          bundle_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "product_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "active_promotions"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "bundle_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
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
          promotion_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          promotion_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          promotion_id?: string | null
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
            referencedRelation: "active_promotions"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "active_promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          payment_method: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          status: string
          store_id: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string
          store_id: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
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
      product_bundles: {
        Row: {
          bundle_price: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          store_id: string
          updated_at: string
        }
        Insert: {
          bundle_price: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          store_id: string
          updated_at?: string
        }
        Update: {
          bundle_price?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_bundles_store_id_fkey"
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
            referencedRelation: "active_promotions"
            referencedColumns: ["product_id"]
          },
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
            referencedRelation: "active_promotions"
            referencedColumns: ["product_id"]
          },
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
            referencedRelation: "active_promotions"
            referencedColumns: ["product_id"]
          },
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
          height: number | null
          id: string
          image_url: string | null
          is_active: boolean
          length: number | null
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
          width: number | null
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
          height?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          length?: number | null
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
          width?: number | null
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
          height?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          length?: number | null
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
          width?: number | null
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
          address: Json | null
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          store_id: string | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
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
      promotion_coupons: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          promotion_id: string
          updated_at: string
          usage_count: number
          usage_limit: number | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          promotion_id: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          promotion_id?: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promotion_coupons_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "active_promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_coupons_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_usage: {
        Row: {
          coupon_id: string | null
          id: string
          order_id: string | null
          promotion_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          coupon_id?: string | null
          id?: string
          order_id?: string | null
          promotion_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string | null
          id?: string
          order_id?: string | null
          promotion_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "promotion_coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_usage_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "active_promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_usage_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          category_id: string | null
          category_ids: Json | null
          created_at: string
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          end_date: string
          id: string
          is_active: boolean
          minimum_purchase_amount: number | null
          name: string
          priority: number
          product_id: string | null
          product_ids: Json | null
          promotion_type: string | null
          start_date: string
          status: Database["public"]["Enums"]["promotion_status"]
          store_id: string
          updated_at: string
          usage_limit: number | null
          usage_limit_per_customer: number | null
        }
        Insert: {
          category_id?: string | null
          category_ids?: Json | null
          created_at?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          end_date: string
          id?: string
          is_active?: boolean
          minimum_purchase_amount?: number | null
          name: string
          priority?: number
          product_id?: string | null
          product_ids?: Json | null
          promotion_type?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["promotion_status"]
          store_id: string
          updated_at?: string
          usage_limit?: number | null
          usage_limit_per_customer?: number | null
        }
        Update: {
          category_id?: string | null
          category_ids?: Json | null
          created_at?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          end_date?: string
          id?: string
          is_active?: boolean
          minimum_purchase_amount?: number | null
          name?: string
          priority?: number
          product_id?: string | null
          product_ids?: Json | null
          promotion_type?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["promotion_status"]
          store_id?: string
          updated_at?: string
          usage_limit?: number | null
          usage_limit_per_customer?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "active_promotions"
            referencedColumns: ["product_id"]
          },
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
      quantity_discounts: {
        Row: {
          created_at: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          id: string
          is_active: boolean
          min_quantity: number
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          id?: string
          is_active?: boolean
          min_quantity: number
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          id?: string
          is_active?: boolean
          min_quantity?: number
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quantity_discounts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "active_promotions"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "quantity_discounts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          is_used: boolean
          referral_code: string
          referred_user_id: string | null
          referrer_user_id: string
          reward_amount: number
          reward_type: string
          updated_at: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_used?: boolean
          referral_code: string
          referred_user_id?: string | null
          referrer_user_id: string
          reward_amount?: number
          reward_type?: string
          updated_at?: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_used?: boolean
          referral_code?: string
          referred_user_id?: string | null
          referrer_user_id?: string
          reward_amount?: number
          reward_type?: string
          updated_at?: string
          used_at?: string | null
        }
        Relationships: []
      }
      shipping_methods: {
        Row: {
          api_headers: Json | null
          api_url: string | null
          created_at: string
          delivery_days: number | null
          delivery_label_type:
            | Database["public"]["Enums"]["delivery_label_type"]
            | null
          id: string
          is_active: boolean
          name: string
          price: number | null
          store_id: string
          type: Database["public"]["Enums"]["shipping_method_type"]
          updated_at: string
        }
        Insert: {
          api_headers?: Json | null
          api_url?: string | null
          created_at?: string
          delivery_days?: number | null
          delivery_label_type?:
            | Database["public"]["Enums"]["delivery_label_type"]
            | null
          id?: string
          is_active?: boolean
          name: string
          price?: number | null
          store_id: string
          type: Database["public"]["Enums"]["shipping_method_type"]
          updated_at?: string
        }
        Update: {
          api_headers?: Json | null
          api_url?: string | null
          created_at?: string
          delivery_days?: number | null
          delivery_label_type?:
            | Database["public"]["Enums"]["delivery_label_type"]
            | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number | null
          store_id?: string
          type?: Database["public"]["Enums"]["shipping_method_type"]
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          banner_url: string | null
          contact_info: Json | null
          created_at: string
          free_shipping_enabled: boolean
          free_shipping_message: string | null
          free_shipping_threshold: number | null
          id: string
          logo_url: string | null
          origin_address: Json | null
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
          free_shipping_enabled?: boolean
          free_shipping_message?: string | null
          free_shipping_threshold?: number | null
          id?: string
          logo_url?: string | null
          origin_address?: Json | null
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
          free_shipping_enabled?: boolean
          free_shipping_message?: string | null
          free_shipping_threshold?: number | null
          id?: string
          logo_url?: string | null
          origin_address?: Json | null
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
      user_addresses: {
        Row: {
          city: string
          complement: string | null
          created_at: string
          id: string
          is_default: boolean
          name: string
          neighborhood: string
          number: string
          state: string
          street: string
          updated_at: string
          user_id: string
          zip_code: string
        }
        Insert: {
          city: string
          complement?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          neighborhood: string
          number: string
          state: string
          street: string
          updated_at?: string
          user_id: string
          zip_code: string
        }
        Update: {
          city?: string
          complement?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          neighborhood?: string
          number?: string
          state?: string
          street?: string
          updated_at?: string
          user_id?: string
          zip_code?: string
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
      is_store_admin: {
        Args: { store_uuid: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      delivery_label_type: "days" | "guaranteed"
      discount_type: "percentage" | "fixed_amount"
      promotion_display_format: "percentage" | "comparison"
      promotion_status:
        | "draft"
        | "scheduled"
        | "active"
        | "expired"
        | "inactive"
      shipping_method_type: "express" | "api"
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
      delivery_label_type: ["days", "guaranteed"],
      discount_type: ["percentage", "fixed_amount"],
      promotion_display_format: ["percentage", "comparison"],
      promotion_status: ["draft", "scheduled", "active", "expired", "inactive"],
      shipping_method_type: ["express", "api"],
      user_role: ["user", "admin"],
    },
  },
} as const
