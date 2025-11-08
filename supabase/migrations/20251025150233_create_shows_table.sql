/*
  # Planner Digo - Shows Management

  ## Overview
  Creates the database schema for managing musical shows and performances for autonomous musicians.

  ## Tables Created
  
  ### `shows`
  Main table to store show/performance information:
  - `id` (uuid, primary key) - Unique identifier for each show
  - `user_id` (uuid) - Reference to authenticated user (future-proof for multi-user)
  - `date` (date) - Date of the show
  - `local` (text) - Venue/location name
  - `horario` (text) - Start time (formatted as HH:MM)
  - `duracao` (text) - Duration of the show (e.g., "2h", "3h30min")
  - `valor` (decimal) - Payment amount/cachê
  - `status` (text) - Payment status: "Pago" or "Pendente"
  - `observacoes` (text, nullable) - Additional notes/observations
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - RLS (Row Level Security) enabled on `shows` table
  - Policy: Authenticated users can read all shows (single-user app context)
  - Policy: Authenticated users can insert their own shows
  - Policy: Authenticated users can update all shows
  - Policy: Authenticated users can delete all shows

  ## Notes
  - Uses decimal type for precise financial calculations
  - All timestamps use timezone awareness
  - Status field constrained to "Pago" or "Pendente" values
  - Future-ready for multi-user expansion with user_id field
*/

CREATE TABLE IF NOT EXISTS shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
  date date NOT NULL,
  local text NOT NULL,
  horario text NOT NULL,
  duracao text NOT NULL,
  valor decimal(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pago', 'Pendente')),
  observacoes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all shows"
  ON shows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert shows"
  ON shows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update all shows"
  ON shows FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete all shows"
  ON shows FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS shows_date_idx ON shows(date);
CREATE INDEX IF NOT EXISTS shows_user_id_idx ON shows(user_id);
CREATE INDEX IF NOT EXISTS shows_status_idx ON shows(status);