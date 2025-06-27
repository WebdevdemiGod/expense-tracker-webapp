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
      budgets: {
        Row: {
          id: number
          user_id: string
          amount: number
          period_type: 'weekly' | 'monthly'
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          amount: number
          period_type: 'weekly' | 'monthly'
          start_date: string
          end_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          amount?: number
          period_type?: 'weekly' | 'monthly'
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
        }
      },
      transactions: {
        Row: {
          id: number
          user_id: string
          description: string | null
          amount: number
          type: string
          category_id: number
          category_name: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          description?: string | null
          amount: number
          type: string
          category_id: number
          category_name: string
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          description?: string | null
          amount?: number
          type?: string
          category_id?: number
          category_name?: string
          date?: string
          created_at?: string
          updated_at?: string
        }
      },
      categories: {
        Row: {
          id: number
          name: string
          type: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          type: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: string
          user_id?: string
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
  
  // Add the budgets table type definition
}

export type Budget = Database['public']['Tables']['budgets']['Row'];
export type InsertBudget = Database['public']['Tables']['budgets']['Insert'];
export type UpdateBudget = Database['public']['Tables']['budgets']['Update'];
