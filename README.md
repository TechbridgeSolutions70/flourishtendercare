# Flourish Tender Care — Local dev & env setup

This project is a Vite + React frontend with serverless API functions (for Vercel). Follow these steps to run the app and test admin features locally.

## Required environment variables
Create a `.env` file in the project root (do not commit it). Use `.env.example` as a template.

Example `.env` contents:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional (server-side email sending via SendGrid). Required only for real email sends.
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=sender@example.com
SENDGRID_TO_EMAIL=recipient@example.com
MAIL_APP_NAME=Flourish Tender Care
MAIL_SIGNATURE=Best regards,\nFlourish Tender Care Team
```

Notes:
- Variables prefixed with `VITE_` are available to the frontend via `import.meta.env`.
- Server-side API functions read from `process.env` (these must be set in your deployment provider or in `.env` when running locally).

## Run locally

Install deps:
```bash
npm install
```

Start dev server:
```bash
npm run dev
```

Build for production and preview (bundles `dist`):
```bash
npm run build
npm run preview
```

## Test the email endpoint (dev)
If you do not provide SendGrid keys, the local server will respond with a mock success (for development). To test:

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test from local","body":"Hello from the admin dashboard"}'
```

If SendGrid credentials are set in `.env` and you deploy to Vercel, the endpoint will send a real email using the SendGrid API.

## Troubleshooting
- If the dashboard shows "Supabase is not configured" ensure `.env` exists and contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- If `fetch` to your Supabase host fails with DNS errors (e.g. `ERR_NAME_NOT_RESOLVED`), check network connectivity, VPN, or firewall.

If you want, I can help run local tests after you add the SendGrid keys (do not paste secrets here). Alternatively, I can leave the local mock enabled and you can deploy to test real email sending.
# flourishtendercare