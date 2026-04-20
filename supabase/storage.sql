-- Storage bucket for admin-uploaded images (testimonial photos, hero slides, expert photos).
-- Run once in Supabase SQL editor. The bucket is public-read; writes only via service-role.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
