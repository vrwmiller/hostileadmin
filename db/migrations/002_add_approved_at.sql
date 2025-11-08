-- 002_add_approved_at.sql
-- Migration: add approved_at timestamp for profiles

BEGIN;

alter table if exists public.profiles
  add column if not exists approved_at timestamptz;

COMMIT;
