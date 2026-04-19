# ReviseCA - The Ultimate CA Exam Revision Engine (2026)

Premium SaaS for CA Foundation, Intermediate, and Final students in their final 30-day sprint.

## Product Snapshot

- One input (topic or notes file) generates a strict 8-section ICAI-aligned package.
- Freemium model: 3 generations/month free, paid unlock with unlimited generations.
- Clerk auth (email/password + Google), Supabase persistence, Stripe checkout/webhook.
- PDF export with student name/date branding.
- My Revisions with search, reuse-topic flow, and mark-as-revised tracking.

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn-style UI primitives
- Clerk authentication
- Supabase PostgreSQL (+ pgvector-ready)
- Groq structured JSON output (OpenAI-compatible API)
- Stripe subscriptions + one-time payment
- `@react-pdf/renderer` export pipeline

## Folder Structure

```text
.
├── middleware.ts
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── supabase/
│   └── schema.sql
└── src/
    ├── app/
    │   ├── page.tsx
    │   ├── layout.tsx
    │   ├── dashboard/page.tsx
    │   ├── generate/page.tsx
    │   ├── history/page.tsx
    │   ├── history/[id]/page.tsx
    │   ├── pricing/page.tsx
    │   └── api/
    │       ├── generate/route.ts
    │       ├── export-pdf/route.tsx
    │       ├── checkout/
    │       │   ├── one-time/route.ts
    │       │   └── subscription/route.ts
    │       ├── revisions/[id]/reviewed/route.ts
    │       └── stripe/webhook/route.ts
    ├── components/
    │   ├── generation-form.tsx
    │   ├── result-tabs.tsx
    │   ├── pdf-document.tsx
    │   └── ...
    └── lib/
        ├── ai.ts
        ├── file-extract.ts
        ├── stripe.ts
        ├── supabase.ts
        ├── usage.ts
        └── types.ts
```

## Local Setup

1. Install dependencies:
   - `npm install`
2. Copy env file:
   - `cp .env.example .env.local` (or create manually on Windows)
3. Fill `.env.local` values:
   - Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
   - Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - Groq: `GROQ_API_KEY`, optional `GROQ_MODEL`, optional `GROQ_BASE_URL`
   - Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs
   - App URL: `NEXT_PUBLIC_APP_URL`
4. Run SQL in Supabase SQL editor:
   - `supabase/schema.sql`
5. Start dev server:
   - `npm run dev`

## Stripe & Webhook Setup

1. Create Stripe products/prices:
   - Monthly subscription `₹499`
   - One-time price `₹99`
2. Add price IDs to env vars:
   - `STRIPE_MONTHLY_PRICE_ID`
   - `STRIPE_ONE_TIME_PRICE_ID`
3. Forward webhook locally:
   - `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Use returned secret as `STRIPE_WEBHOOK_SECRET`.

## Deploy to Vercel

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add all env vars from `.env.example`.
4. Set production `NEXT_PUBLIC_APP_URL`.
5. Add production Stripe webhook endpoint:
   - `https://<your-domain>/api/stripe/webhook`
6. Redeploy after webhook and env setup.

## Testing Checklist

- Sign up/sign in using Clerk (email/password and Google).
- Free user can generate exactly 3 packages/month.
- Paid checkout redirects and webhook activates paid status.
- Generation with topic-only and notes upload (PDF/TXT/DOCX).
- Result view renders all 8 sections correctly.
- Copy section + mark as revised works.
- History search and reuse-topic flow works.
- PDF export downloads/opens with branded formatting.

## Future Roadmap

- ICAI module RAG with pgvector embeddings.
- Attempt-wise weighting dashboards per paper.
- Batch upload and bulk revision generation.
- Smart spaced repetition calendar + revision reminders.
- Faculty mode for coaching institutes and analytics.
