import { useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoPillDark } from "@/components/SummaryCard";
import { WeeklyCategory } from "@/components/CategoryCard";
import MovementList from "@/components/MovementList";
import { categories, currency } from "@/data/budget";

export default function WeekView({ weeklyBudget, weeklySpent, weeklyRemaining, weeklyExpenses, monday, sunday }) {
  const byCategory = useMemo(() => {
    return weeklyExpenses.reduce((acc, item) => {
      acc[item.categoryId] = (acc[item.categoryId] || 0) + Number(item.amount || 0);
      return acc;
    }, {});
  }, [weeklyExpenses]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[1.75rem] border-0 bg-slate-950 text-white shadow-2xl shadow-slate-300/70">
        <CardContent className="relative p-6">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-2 flex items-center gap-2 text-white/70">
              <CalendarDays className="h-5 w-5" />
              <span className="text-sm font-bold">Resumen semanal</span>
            </div>
            <h2 className="text-3xl font-black">{currency.format(weeklyRemaining)} disponibles esta semana</h2>
            <p className="mt-2 text-sm text-white/65">
              Semana del {monday.toLocaleDateString("es-ES")} al {sunday.toLocaleDateString("es-ES")}.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <InfoPillDark title="Presupuesto semanal" value={currency.format(weeklyBudget)} />
              <InfoPillDark title="Gastado" value={currency.format(weeklySpent)} />
              <InfoPillDark title="Movimientos" value={weeklyExpenses.length} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <WeeklyCategory key={category.id} category={category} spent={byCategory[category.id] || 0} />
        ))}
      </div>

      <Card className="rounded-[1.75rem] border-0 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-5">
          <h2 className="text-xl font-black">Gastos de esta semana</h2>
          <p className="mb-4 text-sm text-slate-500">Ideal para revisar juntos el domingo.</p>
          <MovementList expenses={weeklyExpenses} emptyText="Todavía no hay gastos esta semana." compact />
        </CardContent>
      </Card>
    </div>
  );
}
