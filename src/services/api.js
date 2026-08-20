import { supabase } from '../config/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function authFetch(path, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  getExpiringSoon: () => authFetch('/api/pantry/expiring-soon'),
  getInsights: () => authFetch('/api/pantry/insights'),
  suggestRecipes: (ingredients) =>
    authFetch('/api/recipes/suggest', {
      method: 'POST',
      body: JSON.stringify({ ingredients }),
    }),
  registerPushToken: (expoPushToken) =>
    authFetch('/api/notifications/register-token', {
      method: 'POST',
      body: JSON.stringify({ expoPushToken }),
    }),
};