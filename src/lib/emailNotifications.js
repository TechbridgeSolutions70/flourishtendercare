export async function notifyAdminOfActivity(type, data) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || 'Unable to notify the admin by email.');
    }

    return { success: true };
  } catch (error) {
    console.error('Admin email notification failed:', error);
    return { success: false, error };
  }
}