-- Migration 002: Add columns to signals table
-- Run in Supabase SQL Editor

ALTER TABLE public.signals 
  ADD COLUMN IF NOT EXISTS is_done BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS done_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_bagger BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_bandar BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'regular';

-- Update bagger detection
UPDATE public.signals SET is_bagger = true WHERE action = 'BAGGER' OR kode ILIKE '%BAGGER%';
UPDATE public.signals SET is_bandar = true WHERE action = 'BANDAR' OR kode ILIKE '%BANDAR%';
