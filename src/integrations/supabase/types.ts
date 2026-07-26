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
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json
          path: string | null
          session_id: string | null
          target: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          path?: string | null
          session_id?: string | null
          target?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          path?: string | null
          session_id?: string | null
          target?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          diff: Json | null
          entity: string
          entity_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          diff?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          diff?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string
          display_order: number
          ends_at: string | null
          href: string | null
          id: string
          image_url: string | null
          is_active: boolean
          message: string | null
          placement: string
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          ends_at?: string | null
          href?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          message?: string | null
          placement?: string
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          ends_at?: string | null
          href?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          message?: string | null
          placement?: string
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      content_categories: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      content_posts: {
        Row: {
          author_name: string | null
          body: string | null
          category_id: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          reading_minutes: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          body?: string | null
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          reading_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          body?: string | null
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          reading_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      ctas: {
        Row: {
          body: string | null
          button_href: string | null
          button_label: string | null
          created_at: string
          id: string
          is_active: boolean
          slug: string
          title: string
          updated_at: string
          variant: string
        }
        Insert: {
          body?: string | null
          button_href?: string | null
          button_label?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          slug: string
          title: string
          updated_at?: string
          variant?: string
        }
        Update: {
          body?: string | null
          button_href?: string | null
          button_label?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          slug?: string
          title?: string
          updated_at?: string
          variant?: string
        }
        Relationships: []
      }
      differentials: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_categories: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          caption: string | null
          category_id: string | null
          created_at: string
          display_order: number
          id: string
          is_published: boolean
          media_type: string
          thumb_url: string | null
          title: string | null
          updated_at: string
          url: string
        }
        Insert: {
          caption?: string | null
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
          media_type?: string
          thumb_url?: string | null
          title?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          caption?: string | null
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
          media_type?: string
          thumb_url?: string | null
          title?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "gallery_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      heroes: {
        Row: {
          created_at: string
          eyebrow: string | null
          id: string
          image_url: string | null
          is_active: boolean
          page_slug: string
          primary_cta_href: string | null
          primary_cta_label: string | null
          secondary_cta_href: string | null
          secondary_cta_label: string | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          eyebrow?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          page_slug: string
          primary_cta_href?: string | null
          primary_cta_label?: string | null
          secondary_cta_href?: string | null
          secondary_cta_label?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          eyebrow?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          page_slug?: string
          primary_cta_href?: string | null
          primary_cta_label?: string | null
          secondary_cta_href?: string | null
          secondary_cta_label?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_sections: {
        Row: {
          body: string | null
          created_at: string
          cta_href: string | null
          cta_label: string | null
          display_order: number
          eyebrow: string | null
          id: string
          image_url: string | null
          is_active: boolean
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
          variant: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          display_order?: number
          eyebrow?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
          variant?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          display_order?: number
          eyebrow?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          variant?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          path: string
          referrer: string | null
          session_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          referrer?: string | null
          session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          body: string | null
          created_at: string
          id: string
          image_url: string | null
          is_published: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_media: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          id: string
          media_type: string
          partner_id: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          media_type?: string
          partner_id: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          media_type?: string
          partner_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_media_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          challenge: string | null
          cover_url: string | null
          created_at: string
          display_order: number
          id: string
          is_featured: boolean
          is_published: boolean
          logo_url: string | null
          metrics: Json
          name: string
          partnership_story: string | null
          result: string | null
          segment: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          solution: string | null
          summary: string | null
          updated_at: string
        }
        Insert: {
          challenge?: string | null
          cover_url?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_featured?: boolean
          is_published?: boolean
          logo_url?: string | null
          metrics?: Json
          name: string
          partnership_story?: string | null
          result?: string | null
          segment?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          solution?: string | null
          summary?: string | null
          updated_at?: string
        }
        Update: {
          challenge?: string | null
          cover_url?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_featured?: boolean
          is_published?: boolean
          logo_url?: string | null
          metrics?: Json
          name?: string
          partnership_story?: string | null
          result?: string | null
          segment?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          solution?: string | null
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_price: number | null
          old_price: number | null
          price_table_id: string | null
          product_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_price?: number | null
          old_price?: number | null
          price_table_id?: string | null
          product_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_price?: number | null
          old_price?: number | null
          price_table_id?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_price_table_id_fkey"
            columns: ["price_table_id"]
            isOneToOne: false
            referencedRelation: "price_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_table_access: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          price_table_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          price_table_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          price_table_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_table_access_price_table_id_fkey"
            columns: ["price_table_id"]
            isOneToOne: false
            referencedRelation: "price_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      price_tables: {
        Row: {
          audience: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_public: boolean
          name: string
          slug: string
          updated_at: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          audience?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_public?: boolean
          name: string
          slug: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          audience?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_public?: boolean
          name?: string
          slug?: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      process_steps: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          step_number: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          step_number: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          step_number?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          id: string
          product_id: string
          question: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          id?: string
          product_id: string
          question: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          id?: string
          product_id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_faqs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_prices: {
        Row: {
          created_at: string
          id: string
          min_quantity: number
          price: number
          price_table_id: string
          product_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          min_quantity?: number
          price: number
          price_table_id: string
          product_id: string
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          min_quantity?: number
          price?: number
          price_table_id?: string
          product_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_prices_price_table_id_fkey"
            columns: ["price_table_id"]
            isOneToOne: false
            referencedRelation: "price_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          differentials: string | null
          display_order: number
          gallery: Json
          id: string
          image_url: string | null
          ingredients: string | null
          is_available: boolean
          is_featured: boolean
          is_published: boolean
          name: string
          occasion: string | null
          production: string | null
          qty_per_person: string | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          story: string | null
          unit: string
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          differentials?: string | null
          display_order?: number
          gallery?: Json
          id?: string
          image_url?: string | null
          ingredients?: string | null
          is_available?: boolean
          is_featured?: boolean
          is_published?: boolean
          name: string
          occasion?: string | null
          production?: string | null
          qty_per_person?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          story?: string | null
          unit?: string
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          differentials?: string | null
          display_order?: number
          gallery?: Json
          id?: string
          image_url?: string | null
          ingredients?: string | null
          is_available?: boolean
          is_featured?: boolean
          is_published?: boolean
          name?: string
          occasion?: string | null
          production?: string | null
          qty_per_person?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          story?: string | null
          unit?: string
          updated_at?: string
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          product_name: string
          quantity: number
          quote_id: string
          unit: string | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name: string
          quantity?: number
          quote_id: string
          unit?: string | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          quote_id?: string
          unit?: string | null
          unit_price?: number | null
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
          city: string | null
          company: string | null
          created_at: string
          email: string | null
          event_date: string | null
          event_type: string | null
          guests: number | null
          id: string
          message: string | null
          name: string
          phone: string
          source: string
          status: string
          total_estimated: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          event_date?: string | null
          event_type?: string | null
          guests?: number | null
          id?: string
          message?: string | null
          name: string
          phone: string
          source?: string
          status?: string
          total_estimated?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          event_date?: string | null
          event_type?: string | null
          guests?: number | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          source?: string
          status?: string
          total_estimated?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          group_name: string
          id: string
          key: string
          label: string | null
          updated_at: string
          value: Json
        }
        Insert: {
          group_name?: string
          id?: string
          key: string
          label?: string | null
          updated_at?: string
          value?: Json
        }
        Update: {
          group_name?: string
          id?: string
          key?: string
          label?: string | null
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      stats: {
        Row: {
          context: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          label: string
          prefix: string | null
          suffix: string | null
          updated_at: string
          value: number
        }
        Insert: {
          context?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          label: string
          prefix?: string | null
          suffix?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          context?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          label?: string
          prefix?: string | null
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      structure_sections: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          metric_label: string | null
          metric_value: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          metric_label?: string | null
          metric_value?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          metric_label?: string | null
          metric_value?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_role: string | null
          avatar_url: string | null
          company: string | null
          created_at: string
          display_order: number
          id: string
          is_published: boolean
          partner_id: string | null
          quote: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          author_name: string
          author_role?: string | null
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
          partner_id?: string | null
          quote: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_role?: string | null
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
          partner_id?: string | null
          quote?: string
          rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit: { Args: { _user_id: string }; Returns: boolean }
      can_view_price_table: {
        Args: { _table_id: string; _user_id: string }
        Returns: boolean
      }
      has_price_table_grant: {
        Args: { _table_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
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
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const
