import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client with persistent auth so admin sessions survive page reloads.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

const safeQuery = async (query) => {
  try {
    const result = await query;
    return result;
  } catch (error) {
    console.error('Supabase query failed:', error);
    return { error, data: null };
  }
};

// Convert camelCase keys to snake_case
const camelToSnake = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const convertKeysToSnakeCase = (obj) => {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[camelToSnake(key)] = value;
  }
  return result;
};

const saveRecord = async (table, payload) => safeQuery(
  supabase.from(table).insert([{ ...payload, created_at: new Date().toISOString() }])
);

export async function saveSurveyResponse(payload) {
  const snakeCasePayload = convertKeysToSnakeCase(payload);
  return saveRecord('survey_responses', snakeCasePayload);
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

export async function deleteSurveyResponse(id) {
  return safeQuery(
    supabase.from('survey_responses').delete().eq('id', id).single()
  );
}

export async function deleteSurveyResponses(ids) {
  return safeQuery(
    supabase.from('survey_responses').delete().in('id', ids)
  );
}

export async function deleteContactMessage(id) {
  return safeQuery(
    supabase.from('contact_messages').delete().eq('id', id).single()
  );
}

export async function deleteContactMessages(ids) {
  return safeQuery(
    supabase.from('contact_messages').delete().in('id', ids)
  );
}

export async function deleteTestimonial(id) {
  return safeQuery(
    supabase.from('parent_testimonials').delete().eq('id', id).single()
  );
}

export async function deleteTestimonials(ids) {
  return safeQuery(
    supabase.from('parent_testimonials').delete().in('id', ids)
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
  return supabase.auth.signInWithPassword({ email, password });
}

export function adminSignOut() {
  return supabase.auth.signOut();
}

export function getCurrentSession() {
  return supabase.auth.getSession();
}
