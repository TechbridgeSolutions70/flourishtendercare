export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, body, type, data, to } = req.body || {};
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const RESEND_TO_EMAIL = process.env.RESEND_TO_EMAIL || 'techbridgesolutions3@gmail.com';
  const MAIL_APP_NAME = process.env.MAIL_APP_NAME || 'Flourish Tender Care';
  const activityLabels = {
    testimonial: 'New parent testimonial',
    contact: 'New contact message',
    survey: 'New parent feedback survey',
  };
  const isActivity = Boolean(type && activityLabels[type] && data);
  const normalizeRecipients = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };
  const customRecipients = normalizeRecipients(to);

  if (isActivity) {
    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
      return res.status(500).json({ error: 'Resend email service is not configured.' });
    }
  } else if (!subject || !body) {
    return res.status(400).json({ error: 'Subject and body are required.' });
  }

  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    return res.status(500).json({ error: 'Resend email service is not configured.' });
  }

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  const displayData = isActivity ? data : { message: body };
  const emailSubject = isActivity ? activityLabels[type] : subject;
  const emailTitle = isActivity ? 'A new Flourish update needs your attention' : subject;
  const emailRows = Object.entries(displayData)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `<tr><td style="padding:12px 0;color:#5b6b78;font-weight:700;vertical-align:top;width:30%;">${escapeHtml(key.replace(/_/g, ' '))}</td><td style="padding:12px 0;color:#173042;white-space:pre-wrap;">${escapeHtml(typeof value === 'object' ? JSON.stringify(value) : value)}</td></tr>`)
    .join('');
  const introText = isActivity
    ? 'A form was submitted through the Flourish Tender Care website.'
    : 'This message was sent from the Flourish Tender Care admin dashboard on your behalf.';
  const html = `<!doctype html><html><body style="margin:0;background:#f4faf8;font-family:Arial,sans-serif;color:#173042;"><div style="max-width:640px;margin:32px auto;background:#ffffff;border:1px solid #dcebe5;border-radius:20px;overflow:hidden;"><div style="padding:28px 32px;background:#0b5f55;color:#ffffff;"><div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#b9eee0;">Flourish Tender Care</div><h1 style="margin:12px 0 0;font-size:25px;line-height:1.2;">${escapeHtml(emailTitle)}</h1></div><div style="padding:28px 32px;"><p style="margin:0 0 18px;color:#5b6b78;line-height:1.6;">${introText}</p>${isActivity ? `<table style="width:100%;border-collapse:collapse;">${emailRows}</table>` : `<p style="margin:0;white-space:pre-wrap;line-height:1.7;">${escapeHtml(body)}</p>`}<p style="margin:28px 0 0;padding-top:18px;border-top:1px solid #e7f0ed;color:#6d7c85;font-size:13px;">With care,<br><strong>Flourish Tender Care</strong></p></div></div></body></html>`;
  const recipients = isActivity ? [RESEND_TO_EMAIL] : (customRecipients.length ? customRecipients : [RESEND_TO_EMAIL]);
  const payload = {
    from: `${MAIL_APP_NAME} <${RESEND_FROM_EMAIL}>`,
    to: recipients,
    subject: emailSubject,
    html,
    text: isActivity ? Object.entries(displayData).map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`).join('\n') : body,
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText || 'Failed to send email.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Email send failed.' });
  }
}
