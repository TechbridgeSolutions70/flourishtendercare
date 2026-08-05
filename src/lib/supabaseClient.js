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

  try {
    const result = await query;
    return result;
  } catch (error) {
    console.error('Supabase query failed', error);
    return makeError(error?.message || 'An unexpected Supabase error occurred.');
  }
};

const saveRecord = async (table, payload) => safeQuery(
  supabase.from(table).insert([{ ...payload, created_at: new Date().toISOString() }])
);

export async function saveSurveyResponse(payload) {
  return saveRecord('survey_responses', payload);
}

export async function saveContactMessage(payload) {
  return saveRecord('contact_messages', payload);
}

export async function saveTestimonial(payload) {
  return saveRecord('parent_testimonials', payload);
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
