# Finanzas con Paz — Reglas para Claude Code

## Contexto del proyecto
Finanzas con Paz es una app React + Vite + Tailwind + Supabase + Vercel para presupuesto familiar.

Objetivo actual:
Convertir la app en una app profesional y estable, trabajando por fases pequeñas para no romper producción ni gastar toda la cuota de Claude Pro.

## Reglas obligatorias
- No leer todo el proyecto si no es necesario.
- No hacer auditorías completas salvo que se pidan.
- Preguntar antes de abrir muchos archivos.
- No modificar más de 2 o 3 archivos por tarea sin aprobación.
- No tocar Supabase, Auth, Vercel o variables de entorno si la tarea no lo requiere.
- No cambiar VITE_SUPABASE_URL.
- No cambiar VITE_SUPABASE_ANON_KEY.
- No usar service_role key en frontend.
- No borrar funcionalidades existentes.
- No romper producción.

## Funciones que deben seguir funcionando
- Registro de gastos.
- Modo conectado con Supabase.
- Código familiar.
- Cierre mensual.
- Historial mensual.
- Presupuesto familiar.
- Diseño mobile-first.

## Comandos del proyecto
npm run dev
npm run build

## Estilo del producto
- Nombre: Finanzas con Paz.
- Enfoque: parejas, familias, fe, orden y paz financiera.
- UI moderna, limpia, premium y fácil de usar.
- Precio futuro objetivo: 9,99 €/mes.

## Forma correcta de trabajar
Claude debe trabajar siempre por tareas pequeñas.

Después de cada cambio debe decir:
1. Archivos modificados.
2. Qué cambió.
3. Cómo probar.
4. Comando recomendado.
5. Commit recomendado.