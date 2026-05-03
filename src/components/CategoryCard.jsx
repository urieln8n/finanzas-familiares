import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MiniMetric } from "@/components/SummaryCard";
import { currency } from "@/data/budget";
import { classNames, percentage } from "@/lib/helpers";

export function CategoryCard({ category, spent, isPaid, onToggle, index }) {
  const Icon = category.icon;
  const remaining = category.budget - spent;
  const isOver = remaining < 0;
  const progress = category.budget > 0 ? percentage(spent, category.budget) : spent > 0 ? 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.025 }}
    >
      <Card className="overflow-hidden rounded-[1.75rem] border-0 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-2xl">
        <CardContent className="p-0">
          <div className={classNames("h-2 bg-gradient-to-r", category.gradient)} />
          <div className="p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className={classNames("rounded-2xl p-3 ring-1", category.soft, category.text, category.ring)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black leading-tight">{category.name}</h3>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">{category.note}</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className={classNames(
                  "rounded-full p-1 transition",
                  isPaid ? "text-emerald-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                )}
              >
                {isPaid ? <CheckCircle2 className="h-7 w-7" /> : <Circle className="h-7 w-7" />}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <MiniMetric label="Plan" value={currency.format(category.budget)} />
              <MiniMetric label="Gastado" value={currency.format(spent)} />
              <MiniMetric label="Queda" value={currency.format(remaining)} danger={isOver} />
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={classNames("h-full rounded-full bg-gradient-to-r", isOver ? "from-rose-500 to-red-500" : category.gradient)}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs font-bold">
              <span className={category.text}>{category.envelope}</span>
              <span className={isPaid ? "text-emerald-600" : "text-slate-400"}>
                {isPaid ? "Separado/pagado" : "Pendiente"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function WeeklyCategory({ category, spent }) {
  const weeklyPlan = Math.round(category.budget / 4.33);
  const remaining = weeklyPlan - spent;
  const Icon = category.icon;
  return (
    <Card className="rounded-[1.5rem] border-0 bg-white/85 shadow-lg shadow-slate-200/60 backdrop-blur">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className={classNames("rounded-2xl p-2 ring-1", category.soft, category.text, category.ring)}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-black">{category.short}</p>
            <p className="text-xs text-slate-500">Plan semanal: {currency.format(weeklyPlan)}</p>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-500">Gastado</p>
            <p className="text-xl font-black">{currency.format(spent)}</p>
          </div>
          <p className={classNames("text-sm font-black", remaining < 0 ? "text-rose-600" : "text-emerald-600")}>
            {currency.format(remaining)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
