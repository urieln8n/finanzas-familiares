import { motion } from "framer-motion";
import { Wifi, WifiOff, Copy, RotateCcw, Crown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { classNames } from "@/lib/helpers";

export default function Hero({
  onlineMode,
  setOnlineMode,
  syncStatus,
  familyCode,
  setFamilyCode,
  copyCode,
  resetMonth,
  status,
  session,
  onSignOut,
}) {
  const StatusIcon = status.icon;
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-300/50"
    >
      <div className="relative p-5 md:p-8">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-emerald-400 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80 ring-1 ring-white/15 backdrop-blur">
              <Crown className="h-4 w-4 text-amber-300" /> Finanzas con Paz
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">
              Nuestro hogar, organizado con fe, orden y paz.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
              Primero Dios. Después casa, comida, deudas, ahorro y libertad personal para los dos. Registrad cada gasto y revisad juntos sin discutir.
            </p>

            <div className={classNames("mt-5 inline-flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ring-1", status.tone)}>
              <StatusIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">{status.label}</p>
                <p className="opacity-80">{status.detail}</p>
              </div>
            </div>
          </div>

          <div className="w-full rounded-3xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur lg:w-[360px]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Modo pareja</p>
                <p className="text-xs text-white/60">{syncStatus}</p>
              </div>
              <div
                className={classNames(
                  "rounded-full p-2",
                  onlineMode ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10 text-white/70"
                )}
              >
                {onlineMode ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
              </div>
            </div>

            <div className="flex rounded-2xl bg-white/10 p-1 ring-1 ring-white/10">
              <input
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-semibold uppercase outline-none placeholder:text-white/40"
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value.trim().toUpperCase())}
                placeholder="Código familiar"
              />
              <button onClick={copyCode} className="rounded-xl px-3 hover:bg-white/10" title="Copiar código">
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                onClick={() => setOnlineMode((value) => !value)}
                className="rounded-2xl bg-white text-slate-950 hover:bg-white/90"
              >
                {onlineMode ? "Usar local" : "Conectar"}
              </Button>
              <Button
                onClick={resetMonth}
                variant="outline"
                className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Mes
              </Button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-3 py-2 text-xs text-white/70 ring-1 ring-white/10">
              <span className="truncate">{session?.user?.email}</span>
              <button
                onClick={onSignOut}
                className="inline-flex items-center gap-1 rounded-xl px-2 py-1 font-bold text-white hover:bg-white/10"
              >
                <LogOut className="h-3.5 w-3.5" /> Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
