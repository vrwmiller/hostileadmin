-- 001_create_profiles.sql
-- Migration: create profiles table and trigger to auto-insert profile rows
-- Replay this in Supabase SQL editor (Database -> SQL) or run with psql against your DB.

BEGIN;

-- create a lightweight profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  approved boolean default false,
  created_at timestamptz default now()
);

-- function to insert a profile row when a new auth.user is created
create or replace function public.handle_new_auth_user()
returns trigger language plpgsql as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

-- create the trigger on auth.users (remove existing trigger if present)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

COMMIT;

-- To approve a user for testing, run:
-- update public.profiles set approved = true where id = '<USER_UUID>';
