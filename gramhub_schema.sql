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
