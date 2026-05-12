-- Explicit deny policies for anon / authenticated roles on all content tables.
-- The service-role key bypasses RLS, so admin actions still work.
-- This is defense-in-depth: Postgres default-denies when RLS is on and no
-- matching policy exists, but explicit policies make audit reviews trivial
-- and prevent accidental write access if a permissive policy is added later.

do $$
declare
  tbl text;
  op text;
  action text;
  policy_name text;
  using_clause text;
begin
  foreach tbl in array array['faqs', 'testimonials', 'hero_slides', 'experts']
  loop
    foreach op in array array['insert', 'update', 'delete']
    loop
      policy_name := format('deny anon %s on %s', op, tbl);
      action := case op when 'insert' then 'with check (false)' else 'using (false)' end;
      using_clause := case
        when op = 'insert' then 'with check (false)'
        when op = 'update' then 'using (false) with check (false)'
        else 'using (false)'
      end;
      execute format('drop policy if exists %I on public.%I', policy_name, tbl);
      execute format(
        'create policy %I on public.%I for %s to anon, authenticated %s',
        policy_name, tbl, op, using_clause
      );
    end loop;
  end loop;
end
$$;
