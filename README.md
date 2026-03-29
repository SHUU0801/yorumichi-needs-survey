# YORUMICHI Needs Survey

Cloud Run deployable configuration for the `yorumichi-side-effect` service is included in this repository.

## Local production check

```bash
pnpm install
pnpm build
PORT=8080 pnpm start
```

Open `http://localhost:8080`.

## Deploy to Cloud Run

```bash
gcloud run deploy yorumichi-side-effect \
  --source . \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --set-env-vars VITE_APP_ID=YOUR_APP_ID,VITE_OAUTH_PORTAL_URL=https://YOUR-OAUTH-PORTAL,OAUTH_SERVER_URL=https://YOUR-OAUTH-API,JWT_SECRET=YOUR_SECRET
```

If the survey mail should be sent via Resend, also set:

```bash
--set-env-vars RESEND_API_KEY=YOUR_RESEND_API_KEY
```

If you prefer Gmail SMTP instead of Resend, set:

```bash
--set-env-vars SMTP_USER=YOUR_GMAIL_ADDRESS,SMTP_PASS=YOUR_APP_PASSWORD
```

## Runtime behavior

- `GET /healthz`: health check endpoint for Cloud Run
- `GET /app-config.js`: runtime config for client-side OAuth settings
- `POST /api/survey`: survey submission endpoint
- `POST /api/trpc/*`: tRPC API

## Survey CSV storage

Set these environment variables to persist survey responses to Google Cloud Storage as CSV:

```bash
GCS_BUCKET_NAME=YOUR_BUCKET_NAME
GCS_CSV_OBJECT=survey/survey-responses.csv
```

Stored CSV columns include survey answers, `clientIp`, and any geo headers available on the incoming request.
