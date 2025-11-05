
export interface Office {
  id: number
  name: string
  type: "OMAPED" | "OREDIS" 
  district: number
  address?: string | null
  phone_number?: string | null
  created_at: string // formato ISO: "2025-10-31T03:00:00Z"
}
