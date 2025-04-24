/*
  # Create QR codes table and security policies

  1. New Tables
    - `qr_codes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `value` (text, the QR code content)
      - `size` (integer)
      - `bg_color` (text)
      - `fg_color` (text)
      - `level` (text)
      - `include_margin` (boolean)
      - `image_settings` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `qr_codes` table
    - Add policies for:
      - Users can read their own QR codes
      - Users can create QR codes
      - Users can update their own QR codes
      - Users can delete their own QR codes
*/

-- Create QR codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  value text NOT NULL,
  size integer NOT NULL DEFAULT 200,
  bg_color text NOT NULL DEFAULT '#FFFFFF',
  fg_color text NOT NULL DEFAULT '#000000',
  level text NOT NULL DEFAULT 'L',
  include_margin boolean NOT NULL DEFAULT true,
  image_settings jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own QR codes"
  ON qr_codes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create QR codes"
  ON qr_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own QR codes"
  ON qr_codes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own QR codes"
  ON qr_codes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();