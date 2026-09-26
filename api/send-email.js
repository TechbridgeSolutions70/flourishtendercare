import { createClient } from '@supabase/supabase-js';

const activityLabels = {
  testimonial: 'New parent testimonial',
  contact: 'New contact message',
  survey: 'New parent feedback survey',
};

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const recipientsFrom = (value) => {
  const values = Array.isArray(value) ? value : [value];
  return [...new Set(values
    .flatMap((item) => String(item ?? '').split(/[,;\n]+/))
    .map((item) => item.trim())
    .filter(Boolean))];
};

const isEmailAddress = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const decodeEditorHtml = (value) => {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&#39;|&#x27;/gi, "'")
    .replace(/&amp;/gi, '&');
};

const plainTextFromHtml = (value) => decodeEditorHtml(value)
  .replace(/<br\s*\/?>(\s*)/gi, '\n')
  .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
  .replace(/<li>/gi, '- ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/[ \t]+/g, ' ')
  .replace(/\n\s+/g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const renderMessage = (body) => {
  const decoded = decodeEditorHtml(body);
  if (/<\/?[a-z][\s\S]*>/i.test(decoded)) return decoded;
  return `<p style="margin:0;color:#173042;font-size:16px;line-height:1.8;">${escapeHtml(decoded)}</p>`;
};

const renderDataRows = (data) => Object.entries(data)
  .filter(([, value]) => value !== undefined && value !== null && value !== '')
  .map(([key, value]) => `
    <tr>
      <td style="padding:10px 0;color:#56706b;font-weight:700;vertical-align:top;width:32%;">${escapeHtml(key.replace(/_/g, ' '))}</td>
      <td style="padding:10px 0;color:#173042;white-space:pre-wrap;">${escapeHtml(typeof value === 'object' ? JSON.stringify(value, null, 2) : value)}</td>
    </tr>`)
  .join('');

const renderEmail = ({ title, content, buttonLabel, buttonLink }) => `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#edf5f1;font-family:Arial,Helvetica,sans-serif;color:#173042;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#edf5f1;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#ffffff;border:1px solid #d7e6df;border-radius:18px;overflow:hidden;">
            <tr>
              <td align="center" style="padding:28px 24px;background:#0b5f55;">
                <img src="${escapeHtml(process.env.MAIL_LOGO_URL || 'https://flourishtendercare.com.ng/assets/logo1-DT1bMjjn.jpeg')}" width="72" height="72" alt="Flourish Tender Care logo" style="display:block;width:72px;height:72px;border-radius:16px;background:#ffffff;object-fit:cover;border:2px solid #ffffff;" />
                <div style="padding-top:12px;color:#ffffff;font-size:25px;line-height:1.25;font-weight:700;">Flourish Tender Care</div>
                <div style="padding-top:6px;color:#d9eee7;font-size:11px;line-height:1.4;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Nurturing for Greatness</div>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 28px 26px;background:#ffffff;">
                <h1 style="margin:0 0 24px;color:#173042;font-size:25px;line-height:1.3;text-align:center;">${escapeHtml(title)}</h1>
                ${content}
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" style="padding-top:24px;">
                      <a href="${escapeHtml(buttonLink)}" style="display:inline-block;padding:13px 23px;background:#d91c7d;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;">${escapeHtml(buttonLabel)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:22px 24px;background:#f3f8f5;border-top:1px solid #d7e6df;color:#36534e;font-size:13px;line-height:1.8;">
                <strong style="color:#173042;font-size:15px;">Flourish Tender Care</strong><br>
                Peaceville Estate, Badore, Ajah, Lagos, Nigeria<br>
                admin@flourishtendercare.com.ng &nbsp;|&nbsp; +234 803 738 3820
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { subject, body, type, data, to, cc, ctaLabel, ctaLink } = req.body || {};
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.VITE_SUPABASE_URL?.trim();
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const notificationRecipients = recipientsFrom(process.env.RESEND_TO_EMAIL);
  const appName = process.env.MAIL_APP_NAME || 'Flourish Tender Care';
  const isActivity = Boolean(type && activityLabels[type] && data);
  const recipients = recipientsFrom(to);
  const carbonCopy = recipientsFrom(cc);

  if (!apiKey || !fromEmail) {
    return res.status(500).json({ error: 'Resend email service is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in the production environment.' });
  }
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return res.status(500).json({ error: 'Supabase email logging is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the production environment.' });
  }
  if (isActivity && !notificationRecipients.length) {
    return res.status(500).json({ error: 'Automatic email notifications are not configured. Set RESEND_TO_EMAIL in the production environment.' });
  }
  if (isActivity && notificationRecipients.some((recipient) => !isEmailAddress(recipient))) {
    return res.status(500).json({ error: 'Automatic email notification recipients must be valid email addresses separated by commas, semicolons, or new lines.' });
  }
  if (!isActivity && (!subject || !body)) return res.status(400).json({ error: 'Subject and body are required.' });
  if (!isActivity && !recipients.length) return res.status(400).json({ error: 'At least one recipient email is required.' });
  if (!isActivity && [...recipients, ...carbonCopy].some((recipient) => !isEmailAddress(recipient))) {
    return res.status(400).json({ error: 'All recipient and CC values must be valid email addresses separated by commas, semicolons, or new lines.' });
  }

  const buttonLabel = String(ctaLabel || 'Visit our website').trim() || 'Visit our website';
  const buttonLink = String(ctaLink || 'https://flourishtendercare.com.ng').trim() || 'https://flourishtendercare.com.ng';
  const title = isActivity ? activityLabels[type] : subject;
  const content = isActivity
    ? `<p style="margin:0 0 18px;color:#56706b;font-size:15px;line-height:1.8;">A new form submission has been received.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${renderDataRows(data)}</table>`
    : renderMessage(body);
  const html = renderEmail({ title, content, buttonLabel, buttonLink });
  const text = isActivity
    ? Object.entries(data).map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`).join('\n')
    : plainTextFromHtml(body);
  const payload = {
    from: `${appName} <${fromEmail}>`,
    to: isActivity ? notificationRecipients : recipients,
    subject: title,
    html,
    text,
  };
  if (!isActivity && carbonCopy.length) payload.cc = carbonCopy;

  let supabase;
  try {
    supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch (error) {
    console.error('Supabase email logging setup failed:', error);
    return res.status(500).json({ error: 'Unable to initialize Supabase email logging.' });
  }

  let emailLogId;
  try {
    const { data: emailLog, error } = await supabase
      .from('sent_emails')
      .insert({
        email_type: isActivity ? type : 'manual',
        sender_email: fromEmail,
        recipients: payload.to,
        cc: payload.cc || [],
        subject: title,
        html_body: html,
        text_body: text,
        metadata: isActivity ? data : {},
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase email record insert failed:', error);
      return res.status(500).json({ error: 'Email was not sent because it could not be saved to Supabase.' });
    }
    emailLogId = emailLog.id;
  } catch (error) {
    console.error('Supabase email record insert failed:', error);
    return res.status(500).json({ error: 'Email was not sent because it could not be saved to Supabase.' });
  }

  const updateEmailLog = async (updates) => {
    try {
      const { error } = await supabase.from('sent_emails').update(updates).eq('id', emailLogId);
      if (error) console.error('Supabase email record update failed:', error);
    } catch (error) {
      console.error('Supabase email record update failed:', error);
    }
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const responseText = await response.text();
      let providerMessage = responseText;
      try {
        const providerError = responseText ? JSON.parse(responseText) : null;
        providerMessage = providerError?.message || providerError?.error || responseText;
      } catch {
        providerMessage = responseText;
      }

      await updateEmailLog({ status: 'failed', error: providerMessage || 'Failed to send email.' });

      if (/only send testing emails|verify a domain/i.test(providerMessage)) {
        return res.status(response.status).json({
          error: 'Resend is still in testing mode. Verify flourishtendercare.com.ng in Resend Domains, then deploy again before sending to other recipients.',
        });
      }

      return res.status(response.status).json({ error: providerMessage || 'Failed to send email.' });
    }
    const providerResult = await response.json().catch(() => ({}));
    await updateEmailLog({
      status: 'sent',
      provider_message_id: providerResult.id || null,
      sent_at: new Date().toISOString(),
    });
    return res.status(200).json({ success: true, emailLogId });
  } catch (error) {
    await updateEmailLog({ status: 'failed', error: error.message || 'Email send failed.' });
    return res.status(500).json({ error: error.message || 'Email send failed.' });
  }
}
