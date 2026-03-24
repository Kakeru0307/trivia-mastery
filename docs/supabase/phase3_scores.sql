-- Phase 3: Score history table + RLS for TriviaMastery
-- Run this in Supabase SQL Editor after phase2_schema.sql.

create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id bigint not null references public.games(id) on delete cascade,
  total_questions int not null check (total_questions > 0),
  correct_answers int not null check (correct_answers >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_attempts_user_id on public.quiz_attempts(user_id);
create index if not exists idx_quiz_attempts_game_id on public.quiz_attempts(game_id);
create index if not exists idx_quiz_attempts_created_at on public.quiz_attempts(created_at desc);

alter table public.quiz_attempts enable row level security;

drop policy if exists "quiz_attempts_select_own" on public.quiz_attempts;
create policy "quiz_attempts_select_own"
  on public.quiz_attempts
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
create policy "quiz_attempts_insert_own"
  on public.quiz_attempts
  for insert
  to authenticated
  with check (auth.uid() = user_id);
