# Arquitectura — Finanzas con Paz SaaS

## Stack actual

- React + Vite.
- Tailwind CSS.
- shadcn/ui.
- Supabase Auth.
- Supabase PostgreSQL.
- Vercel.

## Arquitectura actual

```txt
App React
  ↓
Supabase JS Client
  ↓
PostgreSQL + RLS
```

## Arquitectura SaaS objetivo

```txt
Landing pública
  ↓
Auth
  ↓
Onboarding de familia
  ↓
Dashboard privado
  ↓
Supabase client
  ↓
PostgreSQL + RLS por family_id
  ↓
Stripe Billing para acceso Pro
```

## Entidades principales futuras

- profiles
- families
- family_members
- income_sources
- budget_categories
- expenses
- paid_marks
- monthly_archives
- subscription_status

## Seguridad multi-tenant

Cada tabla operativa debe tener `family_id`.
Un usuario solo puede leer/escribir datos donde exista una relación en `family_members`.

## Stripe

No usar claves secretas en frontend.
Stripe debe integrarse mediante:

- Vercel Serverless Functions, o
- Supabase Edge Functions.

Recomendación inicial: Vercel Functions si el proyecto sigue en Vite/Vercel.
