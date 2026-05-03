import { Copy, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MiniMetric } from "@/components/SummaryCard";
import FieldLabel from "@/components/FieldLabel";
import { incomeSources, currency } from "@/data/budget";

export default function SettingsView({
  totalIncome,
  totalBudget,
  familyCode,
  setFamilyCode,
  onlineMode,
  setOnlineMode,
  syncStatus,
  copyCode,
  resetMonth,
  monthlyHistory,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="rounded-[1.75rem] border-0 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-5">
          <h2 className="text-2xl font-black">Configuración familiar</h2>
          <p className="mt-1 text-sm text-slate-500">Usad el mismo código en los dos móviles.</p>

          <div className="mt-5 space-y-4">
            <FieldLabel label="Código familiar">
              <div className="flex gap-2">
                <input
                  className="input-pro"
                  value={familyCode}
                  onChange={(e) => setFamilyCode(e.target.value.trim().toUpperCase())}
                />
                <Button onClick={copyCode} variant="outline" className="rounded-2xl">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </FieldLabel>

            <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black">Modo conectado</p>
                  <p className="text-sm text-slate-500">Estado: {syncStatus}</p>
                </div>
                <Button
                  onClick={() => setOnlineMode((value) => !value)}
                  className="rounded-2xl bg-slate-950 hover:bg-slate-800"
                >
                  {onlineMode ? "Desconectar" : "Conectar"}
                </Button>
              </div>
            </div>

            <Button onClick={resetMonth} variant="outline" className="w-full rounded-2xl py-6 font-black">
              <RotateCcw className="mr-2 h-4 w-4" /> Cerrar mes y empezar nuevo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border-0 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-5">
          <h2 className="text-2xl font-black">Presupuesto base</h2>
          <p className="mt-1 text-sm text-slate-500">Ingresos y bloques actuales de vuestro hogar.</p>

          <div className="mt-5 grid gap-3">
            {incomeSources.map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
              >
                <span className="font-semibold text-slate-600">{income.name}</span>
                <strong>{currency.format(income.amount)}</strong>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-4 text-white">
              <span className="font-black">Total ingresos</span>
              <strong>{currency.format(totalIncome)}</strong>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-amber-50 p-4 ring-1 ring-amber-100">
            <p className="font-black text-amber-800">Presupuesto mensual: {currency.format(totalBudget)}</p>
            <p className="mt-1 text-sm text-amber-700">
              Todo está asignado. No sobra sin destino: cada euro tiene una misión.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border-0 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur xl:col-span-2">
        <CardContent className="p-5">
          <h2 className="text-2xl font-black">Historial mensual</h2>
          <p className="mt-1 text-sm text-slate-500">Cada vez que cerréis el mes, se guarda un resumen aquí.</p>

          <div className="mt-5 space-y-3">
            {monthlyHistory.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-center text-sm font-medium text-slate-500 ring-1 ring-slate-100">
                Todavía no hay meses cerrados.
              </div>
            ) : (
              monthlyHistory.map((month) => (
                <div
                  key={month.id}
                  className="grid gap-3 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100 md:grid-cols-5 md:items-center"
                >
                  <div className="md:col-span-2">
                    <p className="font-black capitalize">{month.monthName}</p>
                    <p className="text-xs text-slate-500">
                      {month.expensesCount} movimientos · cerrado el{" "}
                      {new Date(month.closedAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <MiniMetric label="Ingresos" value={currency.format(month.totalIncome)} />
                  <MiniMetric label="Gastado" value={currency.format(month.totalSpent)} />
                  <MiniMetric label="Resultado" value={currency.format(month.remaining)} danger={month.remaining < 0} />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
