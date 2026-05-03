import { TrendingUp, Wallet, ReceiptText, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SummaryCard, InfoPill } from "@/components/SummaryCard";
import { CategoryCard } from "@/components/CategoryCard";
import MovementList from "@/components/MovementList";
import { categories, currency } from "@/data/budget";
import { classNames } from "@/lib/helpers";

export default function DashboardView({
  totalIncome,
  totalBudget,
  totalSpent,
  remainingGlobal,
  generalProgress,
  status,
  paid,
  togglePaid,
  spentByCategory,
  topCategory,
  weeklyBudget,
  weeklySpent,
  weeklyRemaining,
  startEdit,
  latestExpenses,
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Ingresos" amount={totalIncome} helper="Total familiar mensual" icon={TrendingUp} />
        <SummaryCard title="Presupuesto" amount={totalBudget} helper="Todo asignado" icon={Wallet} />
        <SummaryCard title="Gastado" amount={totalSpent} helper="Movimientos registrados" icon={ReceiptText} />
        <SummaryCard
          title="Disponible"
          amount={remainingGlobal}
          helper={remainingGlobal >= 0 ? "Dentro del plan" : "Revisar urgente"}
          icon={Target}
          danger={remainingGlobal < 0}
        />
      </div>

      <Card className="overflow-hidden rounded-[1.75rem] border-0 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Progreso del mes</p>
              <h2 className="mt-1 text-2xl font-black">{Math.round(generalProgress)}% del presupuesto usado</h2>
              <p className="mt-1 text-sm text-slate-500">
                La meta es registrar todo y revisar juntos cada semana, sin culpas.
              </p>
            </div>
            <div className={classNames("rounded-2xl px-4 py-3 text-sm font-bold ring-1", status.tone)}>
              {status.label}
            </div>
          </div>
          <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-500 transition-all"
              style={{ width: `${generalProgress}%` }}
            />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <InfoPill
              title="Esta semana"
              value={currency.format(weeklyRemaining)}
              helper={`Disponible de ${currency.format(weeklyBudget)}`}
            />
            <InfoPill
              title="Categoría más usada"
              value={topCategory?.short || "—"}
              helper={topCategory ? currency.format(topCategory.spent) : "Sin gastos"}
            />
            <InfoPill title="Última revisión" value="Domingo" helper="20 minutos juntos" />
          </div>
        </CardContent>
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black">Categorías del mes</h2>
            <p className="text-sm text-slate-500">Presupuesto, gastado, restante y estado de pago.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              spent={spentByCategory[category.id] || 0}
              isPaid={!!paid[category.id]}
              onToggle={() => togglePaid(category.id)}
            />
          ))}
        </div>
      </section>

      <Card className="rounded-[1.75rem] border-0 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Últimos movimientos</h2>
              <p className="text-sm text-slate-500">Lo más reciente registrado por vosotros.</p>
            </div>
          </div>
          <MovementList expenses={latestExpenses} emptyText="Todavía no hay movimientos." onEdit={startEdit} compact />
        </CardContent>
      </Card>
    </div>
  );
}
