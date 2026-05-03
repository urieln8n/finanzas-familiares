import { Card, CardContent } from "@/components/ui/card";
import { currency } from "@/data/budget";
import { classNames } from "@/lib/helpers";

export function SummaryCard({ title, amount, helper, icon: Icon, danger = false }) {
  return (
    <Card className="rounded-[1.75rem] border-0 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <div className={classNames("rounded-2xl p-2", danger ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-700")}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className={classNames("text-3xl font-black tracking-tight", danger ? "text-rose-600" : "text-slate-950")}>
          {currency.format(amount)}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500">{helper}</p>
      </CardContent>
    </Card>
  );
}

export function MiniMetric({ label, value, danger = false }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={classNames("mt-1 text-sm font-black", danger ? "text-rose-600" : "text-slate-800")}>{value}</p>
    </div>
  );
}

export function InfoPill({ title, value, helper }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

export function InfoPillDark({ title, value }) {
  return (
    <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-wide text-white/45">{title}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
