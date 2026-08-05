import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

const makeError = (message) => ({ data: null, error: new Error(message) });

const safeQuery = async (query) => {
  if (!supabaseReady) {
    return makeError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const result = await query;
  return result;
};

export async function saveSurveyResponse(payload) {
  return safeQuery(
    supabase.from('survey_responses').insert([{ ...payload, created_at: new Date().toISOString() }])
  );
}

export async function saveContactMessage(payload) {
  return safeQuery(
    supabase.from('contact_messages').insert([{ ...payload, created_at: new Date().toISOString() }])
  );
}

export async function saveTestimonial(payload) {
  return safeQuery(
    supabase.from('parent_testimonials').insert([{ ...payload, created_at: new Date().toISOString() }])
  );
}

export async function fetchSurveyResponses() {
  return safeQuery(
    supabase.from('survey_responses').select('*').order('created_at', { ascending: false }).limit(100)
  );
}

export async function fetchContactMessages() {
  return safeQuery(
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(100)
  );
}

export async function fetchTestimonials() {
  return safeQuery(
    supabase.from('parent_testimonials').select('*').order('created_at', { ascending: false }).limit(100)
  );
}

export function adminSignIn(email, password) {
  if (!supabaseReady) {
    return Promise.resolve(makeError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'));
  }
  return supabase.auth.signInWithPassword({ email, password });
}

export function adminSignOut() {
  if (!supabaseReady) {
    return Promise.resolve(makeError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'));
  }
  return supabase.auth.signOut();
}

export function getCurrentSession() {
  if (!supabaseReady) {
    return Promise.resolve(makeError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'));
  }
  return supabase.auth.getSession();
}
