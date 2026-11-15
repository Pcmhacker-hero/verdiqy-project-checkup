REVOKE INSERT, UPDATE ON public.profiles FROM authenticated;
GRANT INSERT (id, display_name, codeforces_handle, target_rating, last_active_date, onboarded, timezone, avatar_url, cf_rating, cf_max_rating, cf_rank, cf_title_photo, cf_country, cf_city, cf_organization, cf_first_name, cf_last_name, cf_registered_at, cf_synced_at, public_badges, updated_at) ON public.profiles TO authenticated;
GRANT UPDATE (display_name, codeforces_handle, target_rating, last_active_date, onboarded, timezone, avatar_url, cf_rating, cf_max_rating, cf_rank, cf_title_photo, cf_country, cf_city, cf_organization, cf_first_name, cf_last_name, cf_registered_at, cf_synced_at, public_badges, updated_at) ON public.profiles TO authenticated;

REVOKE INSERT, UPDATE ON public.daily_plans FROM authenticated;
GRANT INSERT (id, user_id, plan_date, coach_note, problem_ids, status, task_count, ai_summary, started_at, completed_at) ON public.daily_plans TO authenticated;
GRANT UPDATE (coach_note, problem_ids, status, task_count, ai_summary, started_at, completed_at) ON public.daily_plans TO authenticated;

REVOKE INSERT, UPDATE ON public.recommendations FROM authenticated;
GRANT INSERT (id, user_id, problem_id, status, rationale, focus_topic, est_minutes, position, kind, ai_feedback, reviewed_at, resolved_at) ON public.recommendations TO authenticated;
GRANT UPDATE (status, rationale, focus_topic, est_minutes, position, kind, ai_feedback, reviewed_at, resolved_at) ON public.recommendations TO authenticated;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT _user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;