-- Profiles
create table if not exists profiles (
  id uuid primary key,
  username text unique not null,
  email text,
  twitter_handle text unique,
  twitter_image text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

-- Calls
create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  asset text not null default 'BTC',
  date date not null,
  price text,
  quote text,
  outcome text not null default 'waiting' check (outcome in ('waiting','rekt','right','early')),
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists calls_user_id_idx on calls(user_id);
create index if not exists calls_date_idx on calls(date desc);

-- RLS
alter table profiles enable row level security;
alter table calls enable row level security;

-- Profiles: public read, owner write
create policy "Public profiles are viewable by anyone"
  on profiles for select using (is_public = true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Calls: owner full access, public read if profile is public
create policy "Users can manage own calls"
  on calls for all using (auth.uid() = user_id);

create policy "Public calls viewable if profile is public"
  on calls for select using (
    exists (
      select 1 from profiles
      where profiles.id = calls.user_id
      and profiles.is_public = true
    )
  );
