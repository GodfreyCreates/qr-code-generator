export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      qr_codes: {
        Row: {
          id: string
          user_id: string
          value: string
          size: number
          bg_color: string
          fg_color: string
          level: string
          include_margin: boolean
          image_settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          value: string
          size?: number
          bg_color?: string
          fg_color?: string
          level?: string
          include_margin?: boolean
          image_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          value?: string
          size?: number
          bg_color?: string
          fg_color?: string
          level?: string
          include_margin?: boolean
          image_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
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
  }
}