# Stripe — Finanzas con Paz Pro

## Plan objetivo

- Nombre: Finanzas con Paz Pro
- Precio: 9,99 €/mes
- Prueba gratuita: opcional 7 días

## Variables necesarias

Frontend:

- VITE_STRIPE_PRICE_ID si se necesita mostrar precio público.

Backend:

- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

Nunca poner `STRIPE_SECRET_KEY` en React.

## Flujo

1. Usuario crea familia.
2. Usuario inicia Checkout.
3. Stripe procesa pago.
4. Webhook actualiza `subscription_status`.
5. App consulta estado.
6. Si está activo, desbloquea app.
7. Si no, muestra paywall.
