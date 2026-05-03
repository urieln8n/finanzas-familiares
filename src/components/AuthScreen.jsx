import { motion } from "framer-motion";
import { LockKeyhole, Mail, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FieldLabel from "@/components/FieldLabel";
import { InfoPill } from "@/components/SummaryCard";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        <p className="font-black">Cargando Finanzas con Paz...</p>
      </div>
    </div>
  );
}

export default function AuthScreen({ authMode, setAuthMode, authForm, setAuthForm, authMessage, onSubmit }) {
  const isSignIn = authMode === "signin";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fef3c7,transparent_30%),radial-gradient(circle_at_top_right,#dbeafe,transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-xl shadow-slate-300/60">
            <Crown className="h-4 w-4 text-amber-300" /> Finanzas con Paz
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Accede a vuestro hogar financiero.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Un espacio privado para que tú y tu esposa organicéis gastos, recibos, deudas, ahorro y diezmo con fe, orden y paz.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <InfoPill title="Fe" value="Dios primero" helper="Diezmo y ofrenda" />
            <InfoPill title="Orden" value="2.700 €" helper="Presupuesto familiar" />
            <InfoPill title="Paz" value="Pareja" helper="Sin discusiones" />
          </div>
        </motion.div>

        <Card className="rounded-[2rem] border-0 bg-white/90 shadow-2xl shadow-slate-300/70 backdrop-blur">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-300">
                <LockKeyhole className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black">{isSignIn ? "Entrar" : "Crear cuenta"}</h2>
              <p className="mt-1 text-sm text-slate-500">Usad vuestro email y contraseña.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <FieldLabel label="Email">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="input-pro pl-11"
                    type="email"
                    placeholder="tu@email.com"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  />
                </div>
              </FieldLabel>

              <FieldLabel label="Contraseña">
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="input-pro pl-11"
                    type="password"
                    placeholder="mínimo 6 caracteres"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  />
                </div>
              </FieldLabel>

              {authMessage && (
                <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 ring-1 ring-amber-100">
                  {authMessage}
                </div>
              )}

              <Button type="submit" className="w-full rounded-2xl bg-slate-950 py-6 text-base font-black hover:bg-slate-800">
                {isSignIn ? "Entrar a la app" : "Crear cuenta"}
              </Button>
            </form>

            <button
              onClick={() => setAuthMode(isSignIn ? "signup" : "signin")}
              className="mt-5 w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-200"
            >
              {isSignIn ? "No tengo cuenta, crear una" : "Ya tengo cuenta, entrar"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
