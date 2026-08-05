export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, body } = req.body || {};
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
  const SENDGRID_TO_EMAIL = process.env.SENDGRID_TO_EMAIL;
  const MAIL_APP_NAME = process.env.MAIL_APP_NAME || 'Admin Dashboard';
  const MAIL_SIGNATURE = process.env.MAIL_SIGNATURE || 'Best regards,\nYour school team';

  if (!subject || !body) {
    return res.status(400).json({ error: 'Subject and body are required.' });
  }

  // In development, allow a graceful mock so the dashboard can function
  const isProd = process.env.NODE_ENV === 'production';
  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL || !SENDGRID_TO_EMAIL) {
    if (!isProd) {
      // Log the email payload server-side for debugging and return success
      // This prevents the dashboard from breaking in local development when
      // SendGrid credentials are not provided.
      // eslint-disable-next-line no-console
      console.log('[dev-email-mock] subject:', subject);
      // eslint-disable-next-line no-console
      console.log('[dev-email-mock] body:', body);
      return res.status(200).json({ success: true, mocked: true });
    }

    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  const payload = {
    personalizations: [
      {
        to: [{ email: SENDGRID_TO_EMAIL }],
      },
    ],
    from: {
      email: SENDGRID_FROM_EMAIL,
      name: MAIL_APP_NAME,
    },
    subject,
    content: [
      {
        type: 'text/plain',
        value: `${body}\n\n${MAIL_SIGNATURE}`,
      },
    ],
  };

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
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
