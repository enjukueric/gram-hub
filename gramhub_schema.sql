-- Gram Hub schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/mzjicrhoyftmzeqqjzbj/sql/new

create table if not exists gramhub_posts (
  id text primary key,
  title text not null,
  type text default 'photo',
  status text default 'idea',
  caption text,
  hashtags text,
  notes text,
  scheduled_date text,
  scheduled_time text,
  posted_date text,
  analytics jsonb,
  tagged_product jsonb,
  created_at timestamptz default now()
);

create table if not exists gramhub_hashtag_sets (
  id text primary key,
  name text not null,
  hashtags text,
  created_at timestamptz default now()
);

create table if not exists gramhub_caption_templates (
  id text primary key,
  name text not null,
  content text,
  created_at timestamptz default now()
);

create table if not exists gramhub_reminders (
  id text primary key,
  label text not null,
  time text,
  days jsonb,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists gramhub_products (
  id text primary key,
  name text not null,
  url text,
  sku text,
  created_at timestamptz default now()
);

-- Allow open access (no login required — single user app)
alter table gramhub_posts enable row level security;
alter table gramhub_hashtag_sets enable row level security;
alter table gramhub_caption_templates enable row level security;
alter table gramhub_reminders enable row level security;

create policy "open_posts" on gramhub_posts for all using (true) with check (true);
create policy "open_hashtags" on gramhub_hashtag_sets for all using (true) with check (true);
create policy "open_captions" on gramhub_caption_templates for all using (true) with check (true);
create policy "open_reminders" on gramhub_reminders for all using (true) with check (true);

alter table gramhub_products enable row level security;
create policy "open_products" on gramhub_products for all using (true) with check (true);

-- If gramhub_posts already exists, run this to add the new column:
-- alter table gramhub_posts add column if not exists tagged_product jsonb;

-- ============ CATALOG DETAILS TABLE (images + descriptions for Studio) ============
-- Run update_catalog.py to populate this table after creating it.

create table if not exists gramhub_catalog (
  sku text primary key,
  name text,
  url text,
  img text,
  description text
);

alter table gramhub_catalog enable row level security;
create policy "open_catalog" on gramhub_catalog for all using (true) with check (true);

-- Add carousel slides support to posts (run if table already exists):
alter table gramhub_posts add column if not exists slides jsonb;

-- ============ SUPABASE STORAGE (for Studio image uploads) ============
-- In Supabase dashboard → Storage → New bucket:
--   Name: gramhub-uploads
--   Public: YES
-- Then add this policy so anyone can upload:
-- create policy "open_uploads" on storage.objects for all using (bucket_id = 'gramhub-uploads') with check (bucket_id = 'gramhub-uploads');

-- ============ CONFIG TABLE (for email notifications) ============
-- Run this in Supabase SQL Editor to add email reminder support

create table if not exists gramhub_config (
  key text primary key,
  value text not null
);

alter table gramhub_config enable row level security;
create policy "open_config" on gramhub_config for all using (true) with check (true);

-- ============ SERVER-SIDE REMINDER CRON ============
-- Run this AFTER deploying the send-reminders Edge Function.
-- Requires pg_cron and pg_net extensions (both enabled by default on Supabase).

-- Enable extensions if not already on:
-- create extension if not exists pg_cron;
-- create extension if not exists pg_net;

select cron.schedule(
  'gramhub-send-reminders',
  '* * * * *',
  $$
  select net.http_post(
    url    := 'https://mzjicrhoyftmzeqqjzbj.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16amljcmhveWZ0bXplcXFqemJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTA2MjIsImV4cCI6MjA4OTY2NjYyMn0.AnCmuMZQhvBg_vU5tx4oaNo18eJdieX02d4uawfeEI0'
    ),
    body   := '{}'::jsonb
  );
  $$
);

-- To remove the cron job later:
-- select cron.unschedule('gramhub-send-reminders');
