export type Trip = {
  id: string
  user_id: string
  country: string
  city: string | null
  entry_date: string  // ISO date string "YYYY-MM-DD"
  exit_date: string   // ISO date string "YYYY-MM-DD"
  purpose: string
  notes: string | null
  created_at: string
}

export type TripInsert = {
  country: string
  city: string | null
  entry_date: string
  exit_date: string
  purpose: string
  notes: string | null
}

export type TripUpdate = Partial<TripInsert>
