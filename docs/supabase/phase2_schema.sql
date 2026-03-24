-- Phase 2: Quiz data schema for TriviaMastery
-- Run this in Supabase SQL Editor.

create table if not exists public.games (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id bigint generated always as identity primary key,
  game_id bigint not null references public.games(id) on delete cascade,
  question_text text not null,
  option_1 text not null,
  option_2 text not null,
  option_3 text not null,
  option_4 text not null,
  correct_option_index int not null check (correct_option_index between 0 and 3),
  explanation text,
  category text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_questions_game_id on public.questions(game_id);
create index if not exists idx_questions_game_sort on public.questions(game_id, sort_order);

alter table public.games enable row level security;
alter table public.questions enable row level security;

drop policy if exists "games read all" on public.games;
create policy "games read all"
  on public.games
  for select
  to anon, authenticated
  using (true);

drop policy if exists "questions read all" on public.questions;
create policy "questions read all"
  on public.questions
  for select
  to anon, authenticated
  using (true);

-- Optional: seed one game + sample questions (idempotent upsert style)
insert into public.games (slug, name)
values ('valorant', 'Valorant')
on conflict (slug) do update set name = excluded.name;

with target_game as (
  select id from public.games where slug = 'valorant'
)
insert into public.questions (
  game_id,
  question_text,
  option_1,
  option_2,
  option_3,
  option_4,
  correct_option_index,
  explanation,
  category,
  sort_order
)
select
  g.id,
  q.question_text,
  q.option_1,
  q.option_2,
  q.option_3,
  q.option_4,
  q.correct_option_index,
  q.explanation,
  q.category,
  q.sort_order
from target_game g
cross join (
  values
    (
      'ジェットのアルティメット「ブレードストーム」は、開始時にナイフを何本持っていますか？',
      '3本',
      '5本',
      '6本',
      '7本',
      1,
      'ジェットのアルティメット『ブレードストーム』は、開始時に5本のクナイを所持しており、キルで補充されます。',
      'エージェント',
      1
    ),
    (
      'マップ「バインド」において、AショートからBサイトへ移動できるテレポーターの出口はどこにありますか？',
      'B ウィンドウ (フーカー)',
      'B ロング',
      'B リンク',
      'B エルボー',
      0,
      'バインドのAショートにあるテレポーターは、Bウィンドウ付近に繋がっています。',
      'マップ',
      2
    ),
    (
      'キルジョイの「タレット」の最大HPはいくらですか？（パッチ 8.0以降）',
      '100 HP',
      '125 HP',
      '150 HP',
      '200 HP',
      0,
      'パッチ 8.0でタレットの耐久性が調整され、現在は 100 HP となっています。',
      'エージェント',
      3
    )
) as q(
  question_text,
  option_1,
  option_2,
  option_3,
  option_4,
  correct_option_index,
  explanation,
  category,
  sort_order
)
where not exists (
  select 1
  from public.questions existing
  where existing.game_id = g.id
    and existing.sort_order = q.sort_order
);
