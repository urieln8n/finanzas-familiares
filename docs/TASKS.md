# Tasks — Finanzas con Paz SaaS

## Fase 0 — Estabilización

- [ ] T001 — Confirmar build local y deploy Vercel.
- [ ] T002 — Confirmar Supabase conectado.
- [ ] T003 — Confirmar registro de gastos.
- [ ] T004 — Confirmar cierre mensual e historial.
- [ ] T005 — Crear backup Git y tag estable.

## Fase 1 — Refactor profesional

- [ ] T010 — Extraer datos de presupuesto a `src/data/budget.js`.
- [ ] T011 — Extraer navegación a `src/data/navigation.js`.
- [ ] T012 — Extraer cliente Supabase a `src/lib/supabase.js`.
- [ ] T013 — Extraer utilidades a `src/lib/utils.js`.
- [ ] T014 — Extraer formato moneda a `src/lib/currency.js`.
- [ ] T015 — Extraer AuthScreen.
- [ ] T016 — Extraer Hero/layout.
- [ ] T017 — Extraer DashboardView.
- [ ] T018 — Extraer MovementsView.
- [ ] T019 — Extraer WeekView.
- [ ] T020 — Extraer SettingsView.

## Fase 2 — UI/UX SaaS premium

- [ ] T030 — Mejorar dashboard mobile-first.
- [ ] T031 — Mejorar navegación desktop/móvil.
- [ ] T032 — Mejorar formulario de gastos.
- [ ] T033 — Mejorar movimientos y filtros.
- [ ] T034 — Mejorar ajustes e historial.
- [ ] T035 — Crear estados vacíos y loading states.
- [ ] T036 — Crear sistema de notificaciones visuales.

## Fase 3 — Auth profesional

- [ ] T040 — Crear `useAuth`.
- [ ] T041 — Login/registro estable.
- [ ] T042 — Recuperar contraseña.
- [ ] T043 — Cerrar sesión.
- [ ] T044 — Bypass temporal `VITE_DISABLE_LOGIN`.
- [ ] T045 — Mensajes de error en español.

## Fase 4 — Multi-tenant

- [ ] T050 — Diseñar tablas: profiles, families, family_members.
- [ ] T051 — Crear onboarding de familia.
- [ ] T052 — Invitar pareja.
- [ ] T053 — Asociar gastos a family_id.
- [ ] T054 — Asociar presupuestos a family_id.

## Fase 5 — Supabase RLS seguro

- [ ] T060 — Activar RLS en todas las tablas.
- [ ] T061 — Crear policies por membresía familiar.
- [ ] T062 — Quitar policies abiertas `using(true)`.
- [ ] T063 — Probar que una familia no ve datos de otra.

## Fase 6 — Presupuesto editable

- [ ] T070 — Crear ingresos editables.
- [ ] T071 — Crear categorías editables.
- [ ] T072 — Crear presupuesto default para nuevas familias.
- [ ] T073 — Crear metas de ahorro.

## Fase 7 — SaaS 9,99 €/mes

- [ ] T080 — Diseñar tabla subscription_status.
- [ ] T081 — Crear Stripe Checkout.
- [ ] T082 — Crear webhook Stripe.
- [ ] T083 — Crear paywall.
- [ ] T084 — Crear portal de cliente.
- [ ] T085 — Crear prueba gratuita.

## Fase 8 — Landing y lanzamiento

- [ ] T090 — Crear landing SaaS.
- [ ] T091 — Crear pricing 9,99 €/mes.
- [ ] T092 — Crear FAQ.
- [ ] T093 — Crear onboarding.
- [ ] T094 — Crear checklist beta.
