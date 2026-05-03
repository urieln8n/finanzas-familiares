---
name: finanzas-saas
description: Skill para desarrollar Finanzas con Paz como SaaS profesional por fases pequeñas, en modo ahorro de contexto, sin romper producción.
disable-model-invocation: true
---

# Finanzas con Paz — Skill SaaS Profesional

## Objetivo

Ayudar a convertir Finanzas con Paz en un SaaS profesional para parejas y familias, con enfoque en fe, orden financiero, presupuesto familiar, gastos compartidos, historial mensual y futura suscripción de 9,99 €/mes.

## Reglas obligatorias

1. Trabajar siempre en modo ahorro de contexto.
2. No leer todo el proyecto salvo que sea necesario.
3. Antes de modificar código, explicar el plan.
4. No modificar más de 2 o 3 archivos por tarea sin aprobación.
5. No romper producción.
6. No borrar funcionalidades existentes.
7. No tocar Supabase, Auth, Vercel, Stripe o variables de entorno si la tarea no lo requiere.
8. No usar service_role key en frontend.
9. No poner claves privadas en React.
10. No hacer refactor grande de golpe.
11. Mantener npm run build funcionando.
12. Después de cada cambio, explicar cómo probar.

## Contexto del producto

Nombre: Finanzas con Paz.

Producto:
App familiar para que parejas organicen su dinero con fe, claridad y paz.

Funciones actuales o esperadas:
- Presupuesto familiar.
- Registro de gastos.
- Categorías.
- Diezmo/ofrenda.
- Deudas.
- Ahorro.
- Emergencias.
- Dinero personal.
- Historial mensual.
- Cierre de mes.
- Supabase.
- Vercel.
- Futuro SaaS de 9,99 €/mes.

## Roadmap recomendado

1. Estabilizar app actual.
2. Refactor profesional por componentes.
3. Mejorar UI/UX premium.
4. Auth estable.
5. Multi-tenant: hogares/familias.
6. RLS seguro en Supabase.
7. Presupuesto editable.
8. Historial mensual profesional.
9. Landing page.
10. Stripe 9,99 €/mes.
11. Paywall.
12. Onboarding.
13. Panel de cuenta.
14. Beta privada.

## Antes de modificar código

Responder siempre:

1. Objetivo de la tarea.
2. Archivos que necesitas revisar.
3. Archivos que probablemente modificarás.
4. Riesgo.
5. Plan breve.
6. Comando para probar.
7. Pregunta: ¿Apruebas que haga este cambio?

No modificar hasta recibir aprobación.

## Después de modificar código

Responder:

1. Archivos modificados.
2. Qué cambió.
3. Qué no se tocó.
4. Cómo probar.
5. Comando recomendado:
   - npm run build
   - npm run dev si aplica
6. Commit recomendado.

## Si el usuario pide SaaS completo

No construir todo de golpe.

Primero proponer fases pequeñas.

No implementar Stripe antes de tener:
- Auth estable.
- Multi-tenant.
- RLS seguro.
- Presupuesto editable.
- Landing preparada.

## Si el usuario pide UI/UX

Mejorar solo una pantalla o componente por vez.

No tocar:
- Supabase.
- Auth.
- Stripe.
- Vercel.
- Variables de entorno.
- Lógica de negocio.

## Si el usuario pide refactor

Refactor incremental:

1. Extraer datos estáticos.
2. Extraer utilidades.
3. Extraer cliente Supabase.
4. Extraer componentes.
5. Extraer views.
6. Extraer hooks.

Nunca refactorizar todo el proyecto en una sola tarea.

## Comandos útiles

Probar desarrollo:

npm run dev

Probar producción:

npm run build

## Prioridad actual

Mantener Finanzas con Paz funcionando para uso real con la esposa del usuario, y avanzar hacia SaaS profesional sin romper la versión estable.
