-- Add bio and achievements columns to experts for the modal card.

alter table public.experts
  add column if not exists bio text,
  add column if not exists achievements text;
