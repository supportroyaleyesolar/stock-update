-- ================================================================
-- ROYAL EYE SOLAR POWER - SUPABASE DATABASE SETUP
-- Run this entire script in: Supabase → SQL Editor → New Query
-- ================================================================

-- 1. Create the inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
  product_id       TEXT        PRIMARY KEY,
  name             TEXT        NOT NULL,
  category         TEXT        NOT NULL,
  brand            TEXT        NOT NULL,
  daily_stock      INTEGER     NOT NULL DEFAULT 0,
  price            NUMERIC     NOT NULL DEFAULT 0,
  mrp              NUMERIC,
  verified_date    TEXT,
  badge            TEXT,
  spec_capacity    TEXT,
  spec_type        TEXT,
  spec_efficiency  TEXT,
  spec_warranty    TEXT,
  spec_voltage     TEXT,
  spec_highlights  TEXT,
  sort_order       INTEGER     NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Auto-update the updated_at column on every change
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_inventory_updated_at ON public.inventory;
CREATE TRIGGER trg_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 3. Enable Row Level Security (but allow all operations from the anon key)
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Allow anyone with the anon key to read
CREATE POLICY "Allow anon read" ON public.inventory
  FOR SELECT USING (true);

-- Allow anyone with the anon key to insert/update/delete
-- (your PIN login protects access — change this to service_role if you want stricter control)
CREATE POLICY "Allow anon write" ON public.inventory
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Enable Realtime on this table (so changes broadcast to all clients)
ALTER TABLE public.inventory REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;

-- ================================================================
-- Done! Now copy your Project URL and anon key from:
-- Supabase Dashboard → Settings → API
-- and paste them into js/storage.js
-- ================================================================
