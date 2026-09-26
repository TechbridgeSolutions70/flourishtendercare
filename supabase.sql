-- Flourish Tender Care Supabase schema
-- Paste this entire file into the Supabase SQL Editor and run it.

create extension if not exists pgcrypto;

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  parent_name text,
  children_names text,
  class text,
  email text,
  phone text,
  parent_type text,
  overall_satisfaction text,
  school_environment text,
  communication_school text,
  could_recommend text,
  school_facilities text,
  school_values text,
  teacher_satisfaction text,
  teacher_matrix jsonb not null default '{}'::jsonb,
  teacher_communication text,
  child_treated_with_love text,
  teacher_approachability text,
  teacher_motivation text,
  had_teacher_concern text,
  concern_resolution text,
  appreciate_teacher text,
  improvement_suggestions text,
  portal_usage text,
  portal_functionality text,
  portal_features text,
  improvement_priority text,
  improvement_comments text,
  general_comments text,
  created_at timestamptz not null default timezone('utc'::text, now())
);


create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.parent_testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.sent_emails (
  id uuid primary key default gen_random_uuid(),
  email_type text not null,
  sender_email text not null,
  recipients text[] not null default '{}',
  cc text[] not null default '{}',
  subject text not null,
  html_body text not null,
  text_body text not null,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  provider_message_id text,
  error text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  sent_at timestamptz
);

alter table public.parent_testimonials
  add column if not exists is_published boolean not null default false;

create index if not exists survey_responses_created_at_idx
  on public.survey_responses (created_at desc);
create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
create index if not exists parent_testimonials_created_at_idx
  on public.parent_testimonials (created_at desc);
create index if not exists sent_emails_created_at_idx
  on public.sent_emails (created_at desc);

alter table public.survey_responses enable row level security;
alter table public.contact_messages enable row level security;
alter table public.parent_testimonials enable row level security;
alter table public.sent_emails enable row level security;

-- Public visitors may submit forms.
drop policy if exists "Public can submit survey responses" on public.survey_responses;
create policy "Public can submit survey responses"
  on public.survey_responses for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can send contact messages" on public.contact_messages;
create policy "Public can send contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can submit testimonials" on public.parent_testimonials;
create policy "Public can submit testimonials"
  on public.parent_testimonials for insert
  to anon, authenticated
  with check (is_published = false);

drop policy if exists "Public can view testimonials" on public.parent_testimonials;
create policy "Public can view testimonials"
  on public.parent_testimonials for select
  to anon, authenticated
  using (is_published = true);

-- Only this Supabase Auth user may access dashboard data.
-- Create the matching user in Authentication > Users with this email first.
-- Email: admin@flourishtendercare.com.ng
-- Auth user ID: 0491c1b1-c2cc-41e8-ae93-15fd7d2d642a
drop policy if exists "Authenticated admins can read survey responses" on public.survey_responses;
create policy "Authenticated admins can read survey responses"
  on public.survey_responses for select
  to authenticated
  using (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid);

drop policy if exists "Authenticated admins can delete survey responses" on public.survey_responses;
create policy "Authenticated admins can delete survey responses"
  on public.survey_responses for delete
  to authenticated
  using (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid);

drop policy if exists "Authenticated admins can read contact messages" on public.contact_messages;
create policy "Authenticated admins can read contact messages"
  on public.contact_messages for select
  to authenticated
  using (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid);

drop policy if exists "Authenticated admins can delete contact messages" on public.contact_messages;
create policy "Authenticated admins can delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid);

drop policy if exists "Authenticated admins can read testimonials" on public.parent_testimonials;
create policy "Authenticated admins can read testimonials"
  on public.parent_testimonials for select
  to authenticated
  using (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid);

drop policy if exists "Authenticated admins can read sent emails" on public.sent_emails;
create policy "Authenticated admins can read sent emails"
  on public.sent_emails for select
  to authenticated
  using (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid);

drop policy if exists "Authenticated admins can create sent emails" on public.sent_emails;
create policy "Authenticated admins can create sent emails"
  on public.sent_emails for insert
  to authenticated
  with check (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid);

drop policy if exists "Authenticated admins can update sent emails" on public.sent_emails;
create policy "Authenticated admins can update sent emails"
  on public.sent_emails for update
  to authenticated
  using (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid)
  with check (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid);

drop policy if exists "Authenticated admins can delete sent emails" on public.sent_emails;
create policy "Authenticated admins can delete sent emails"
  on public.sent_emails for delete
  to authenticated
  using (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid);

drop policy if exists "Authenticated admins can delete testimonials" on public.parent_testimonials;
create policy "Authenticated admins can delete testimonials"
  on public.parent_testimonials for delete
  to authenticated
  using (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid);

drop policy if exists "Authenticated admins can publish testimonials" on public.parent_testimonials;
create policy "Authenticated admins can publish testimonials"
  on public.parent_testimonials for update
  to authenticated
  using (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid)
  with check (auth.uid() = '0491c1b1-c2cc-41e8-ae93-15fd7d2d642a'::uuid);

grant usage on schema public to anon, authenticated;
grant insert on public.survey_responses, public.contact_messages, public.parent_testimonials to anon, authenticated;
grant select on public.parent_testimonials to anon, authenticated;
grant select, delete on public.survey_responses, public.contact_messages, public.parent_testimonials to authenticated;
grant select, insert, update, delete on public.sent_emails to authenticated;
grant update (is_published) on public.parent_testimonials to authenticated;
