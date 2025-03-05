/*
  # Fix RLS policies for food entries

  1. Changes
    - Update RLS policies for food_entries table to allow inserts and updates
    - Add proper checks for authenticated users
*/

-- Update RLS policies for food_entries
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON food_entries;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON food_entries;

CREATE POLICY "Enable insert for authenticated users"
  ON food_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users"
  ON food_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);


  CREATE POLICY "Enable delete for authenticated users"
  ON food_entries FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
  
  CREATE POLICY "Enable delete for authenticated users"
  ON bookings FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

