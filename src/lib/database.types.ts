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
      livros: {
        Row: {
          id: number
          livro: string
          abbrev: string
          testamento: string
          autor: string | null
          capitulos: number
          grupo: string | null
          created_at: string
        }
        Insert: {
          id?: number
          livro: string
          abbrev: string
          testamento: string
          autor?: string | null
          capitulos?: number
          grupo?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          livro?: string
          abbrev?: string
          testamento?: string
          autor?: string | null
          capitulos?: number
          grupo?: string | null
          created_at?: string
        }
      }
      versiculos: {
        Row: {
          id: number
          id_livro: number
          capitulo: number
          versiculo: number
          texto: string
          created_at: string
        }
        Insert: {
          id?: number
          id_livro: number
          capitulo: number
          versiculo: number
          texto: string
          created_at?: string
        }
        Update: {
          id?: number
          id_livro?: number
          capitulo?: number
          versiculo?: number
          texto?: string
          created_at?: string
        }
      }
      anotacoes: {
        Row: {
          id: string
          user_id: string
          id_livro: number
          capitulo: number
          versiculo: number | null
          texto_da_nota: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          id_livro: number
          capitulo: number
          versiculo?: number | null
          texto_da_nota: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          id_livro?: number
          capitulo?: number
          versiculo?: number | null
          texto_da_nota?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
