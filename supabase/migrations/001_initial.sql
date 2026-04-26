-- Stamped: trips table + RLS policies
-- Run this in the Supabase SQL Editor

CREATE TABLE trips (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country     text NOT NULL,
  city        text,
  entry_date  date NOT NULL,
  exit_date   date NOT NULL,
  purpose     text NOT NULL,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT entry_before_exit CHECK (entry_date < exit_date)
);

-- Index for fast per-user queries sorted by entry_date
CREATE INDEX trips_user_entry ON trips (user_id, entry_date DESC);

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Users can only access their own rows
CREATE POLICY "select own trips"
  ON trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "insert own trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update own trips"
  ON trips FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete own trips"
  ON trips FOR DELETE
  USING (auth.uid() = user_id);
