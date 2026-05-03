# Database — Finanzas con Paz SaaS

## Tablas actuales probables

- family_expenses
- family_paid_marks
- family_monthly_archives

## Tablas SaaS recomendadas

- profiles
- families
- family_members
- family_invites
- income_sources
- budget_categories
- expenses
- paid_marks
- monthly_archives
- subscription_status

## Regla RLS principal

Un usuario puede acceder a una fila si pertenece a la familia de esa fila.

Ejemplo conceptual:

```sql
exists (
  select 1 from family_members fm
  where fm.family_id = table.family_id
  and fm.user_id = auth.uid()
)
```

## No hacer todavía

No migrar todo sin backup.
No borrar tablas actuales hasta tener migración validada.
