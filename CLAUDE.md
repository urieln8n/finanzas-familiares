# Finanzas con Paz — Instrucciones globales para Claude Code

## Producto

Finanzas con Paz es una app familiar para que parejas y familias organicen el dinero del hogar con fe, orden y paz.

## Objetivo actual

Convertir la app actual en un SaaS profesional vendible por 9,99 €/mes, sin romper producción.

## Stack actual

- React + Vite.
- Tailwind CSS.
- shadcn/ui.
- Supabase.
- Supabase Auth.
- Vercel.

## Principios obligatorios

1. Trabajar en modo ahorro.
2. Una tarea por vez.
3. Antes de editar, explicar plan y archivos que se tocarán.
4. No leer todo el proyecto salvo que el usuario lo apruebe.
5. No modificar más de 2-3 archivos por tarea sin aprobación.
6. No instalar dependencias sin permiso.
7. No cambiar variables de entorno sin avisar.
8. No usar service_role key en frontend.
9. No romper producción.
10. Después de cada cambio indicar cómo probar.

## Funciones existentes que no se deben romper

- Registro de gastos.
- Modo conectado con Supabase.
- Código familiar.
- Cierre mensual.
- Historial mensual.
- Presupuesto familiar.
- UI mobile-first.

## Variables de entorno actuales

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_DISABLE_LOGIN opcional para desarrollo.

## Fases SaaS

1. Estabilizar app actual.
2. Refactor profesional.
3. UI/UX premium.
4. Auth profesional.
5. Multi-tenant por familias.
6. RLS seguro.
7. Presupuesto editable.
8. Stripe Billing.
9. Paywall.
10. Landing.
11. Onboarding.
12. Lanzamiento beta.

## No construir todavía sin aprobación

- Stripe.
- Multi-tenant completo.
- Migraciones destructivas.
- Roles complejos.
- App móvil nativa.
- IA avanzada.
