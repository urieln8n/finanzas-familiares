import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  HeartHandshake,
  Home,
  Utensils,
  Car,
  Landmark,
  PiggyBank,
  ShieldAlert,
  User,
  Users,
  Sparkles,
  Wifi,
  WifiOff,
  Copy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

/*
  APP WEB FAMILIAR CON MODO COMPARTIDO

  Esta app ya funciona en modo local. Para que tú y tu esposa estéis conectados en tiempo real,
  conecta Supabase siguiendo estos pasos:

  1) Crea un proyecto gratis en Supabase.
  2) En SQL Editor, ejecuta este SQL:

  create table if not exists family_expenses (
    id uuid primary key default gen_random_uuid(),
    family_code text not null,
    description text not null,
    amount numeric not null,
    category_id text not null,
    person text not null,
    expense_date date not null,
    created_at timestamptz default now()
  );

  create table if not exists family_paid_marks (
    id uuid primary key default gen_random_uuid(),
    family_code text not null,
    category_id text not null,
    is_paid boolean not null default false,
    updated_at timestamptz default now(),
    unique(family_code, category_id)
  );

  alter table family_expenses enable row level security;
  alter table family_paid_marks enable row level security;

  create policy "family_expenses_open_mvp" on family_expenses
    for all using (true) with check (true);

  create policy "family_paid_marks_open_mvp" on family_paid_marks
    for all using (true) with check (true);

  3) En Authentication > Policies / Realtime, activa realtime para estas tablas si tu proyecto lo pide.
  4) En tu proyecto web crea estas variables:
     VITE_SUPABASE_URL=tu_url
     VITE_SUPABASE_ANON_KEY=tu_anon_key
  5) Instala Supabase:
     npm install @supabase/supabase-js

  Nota: Las policies anteriores son para MVP familiar rápido. Para producción, conviene añadir login real.
*/

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const initialCategories = [
  { id: "dios", name: "Dios primero", budget: 280, icon: HeartHandshake, note: "Diezmo y ofrenda" },
  { id: "casa", name: "Casa / recibos", budget: 1173, icon: Home, note: "Alquiler, internet, agua, luz, gas, MyBox/teléfono" },
  { id: "comida", name: "Comida", budget: 480, icon: Utensils, note: "Comida casa + comedor de Uriel" },
  { id: "transporte", name: "Transporte", budget: 40, icon: Car, note: "Transporte mensual" },
  { id: "deudas", name: "Deudas", budget: 350, icon: Landmark, note: "Abogada + préstamos" },
  { id: "ahorro", name: "Ahorro", budget: 100, icon: PiggyBank, note: "Ahorro familiar" },
  { id: "emergencias", name: "Emergencias", budget: 117, icon: ShieldAlert, note: "Solo emergencias reales" },
  { id: "personal_andres", name: "Dinero personal Andrés", budget: 80, icon: User, note: "Libre, sin justificar" },
  { id: "personal_esposa", name: "Dinero personal esposa", budget: 80, icon: Users, note: "Libre, sin justificar" },
  { id: "extras", name: "Extras", budget: 0, icon: Sparkles, note: "Solo si entra dinero extra" },
];

const incomeSources = [
  { name: "Ingreso Andrés", amount: 1500 },
  { name: "Ingreso esposa", amount: 700 },
  { name: "Alquiler habitación", amount: 420 },
  { name: "Ingreso mínimo vital", amount: 80 },
];

const currency = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getStoredFamilyCode() {
  return localStorage.getItem("family_code_v1") || "FAMILIA-RENDON";
}

export default function AppFinanzasFamiliares() {
  const [categories] = useState(initialCategories);
  const [expenses, setExpenses] = useState([]);
  const [paid, setPaid] = useState({});
  const [familyCode, setFamilyCode] = useState(getStoredFamilyCode());
  const [onlineMode, setOnlineMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Modo local");
  const [form, setForm] = useState({
    description: "",
    amount: "",
    categoryId: "comida",
    person: "Ambos",
    date: getToday(),
  });

  const totalIncome = useMemo(() => incomeSources.reduce((sum, item) => sum + item.amount, 0), []);
  const totalBudget = useMemo(() => categories.reduce((sum, item) => sum + item.budget, 0), [categories]);
  const totalSpent = useMemo(() => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0), [expenses]);
  const remainingGlobal = totalBudget - totalSpent;

  const spentByCategory = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      acc[expense.categoryId] = (acc[expense.categoryId] || 0) + Number(expense.amount || 0);
      return acc;
    }, {});
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("family_code_v1", familyCode);
  }, [familyCode]);

  useEffect(() => {
    loadLocalData();
  }, []);

  useEffect(() => {
    if (!onlineMode) {
      localStorage.setItem("familia_expenses_v1", JSON.stringify(expenses));
      localStorage.setItem("familia_paid_v1", JSON.stringify(paid));
    }
  }, [expenses, paid, onlineMode]);

  useEffect(() => {
    let cancelled = false;
    let expensesChannel = null;
    let paidChannel = null;

    async function setupRealtime() {
      if (!onlineMode) return;

      const client = await waitForSupabaseClient();
      if (!client || cancelled) {
        setOnlineMode(false);
        setSyncStatus("Falta configurar Supabase");
        return;
      }

      setSyncStatus("Conectando...");
      await loadOnlineData(client);
      if (cancelled) return;

      setSyncStatus("Conectados");

      expensesChannel = client
        .channel(`family-expenses-${familyCode}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "family_expenses", filter: `family_code=eq.${familyCode}` },
          () => loadOnlineData(client)
        )
        .subscribe();

      paidChannel = client
        .channel(`family-paid-${familyCode}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "family_paid_marks", filter: `family_code=eq.${familyCode}` },
          () => loadOnlineData(client)
        )
        .subscribe();
    }

    setupRealtime();

    return () => {
      cancelled = true;
      if (expensesChannel && supabase) supabase.removeChannel(expensesChannel);
      if (paidChannel && supabase) supabase.removeChannel(paidChannel);
    };
  }, [onlineMode, familyCode]);

  function loadLocalData() {
    try {
      const savedExpenses = localStorage.getItem("familia_expenses_v1");
      const savedPaid = localStorage.getItem("familia_paid_v1");
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      if (savedPaid) setPaid(JSON.parse(savedPaid));
    } catch (error) {
      console.warn("No se pudo cargar el presupuesto guardado", error);
    }
  }

  async function waitForSupabaseClient() {
    for (let i = 0; i < 20; i += 1) {
      if (supabase) return supabase;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    return null;
  }

  async function loadOnlineData(client) {
    const [{ data: expensesData, error: expensesError }, { data: paidData, error: paidError }] = await Promise.all([
      client.from("family_expenses").select("*").eq("family_code", familyCode).order("created_at", { ascending: false }),
      client.from("family_paid_marks").select("*").eq("family_code", familyCode),
    ]);

    if (expensesError || paidError) {
      setSyncStatus("Error de conexión");
      return;
    }

    setExpenses(
      (expensesData || []).map((item) => ({
        id: item.id,
        description: item.description,
        amount: Number(item.amount),
        categoryId: item.category_id,
        person: item.person,
        date: item.expense_date,
        createdAt: item.created_at,
      }))
    );

    const paidMap = {};
    (paidData || []).forEach((item) => {
      paidMap[item.category_id] = item.is_paid;
    });
    setPaid(paidMap);
  }

  const addExpense = async () => {
    const amount = Number(form.amount);
    if (!form.description.trim() || !amount || amount <= 0) return;

    const newExpense = {
      id: crypto.randomUUID(),
      ...form,
      amount,
      createdAt: new Date().toISOString(),
    };

    if (onlineMode) {
      const client = await waitForSupabaseClient();
      if (!client) return;
      const { error } = await client.from("family_expenses").insert({
        id: newExpense.id,
        family_code: familyCode,
        description: newExpense.description,
        amount: newExpense.amount,
        category_id: newExpense.categoryId,
        person: newExpense.person,
        expense_date: newExpense.date,
        created_at: newExpense.createdAt,
      });
      if (error) {
        setSyncStatus("No se pudo guardar");
        return;
      }
    } else {
      setExpenses((current) => [newExpense, ...current]);
    }

    setForm({
      description: "",
      amount: "",
      categoryId: form.categoryId,
      person: form.person,
      date: getToday(),
    });
  };

  const deleteExpense = async (id) => {
    if (onlineMode) {
      const client = await waitForSupabaseClient();
      if (!client) return;
      const { error } = await client.from("family_expenses").delete().eq("id", id).eq("family_code", familyCode);
      if (error) {
        setSyncStatus("No se pudo borrar");
        return;
      }
    } else {
      setExpenses((current) => current.filter((item) => item.id !== id));
    }
  };

  const togglePaid = async (categoryId) => {
    const nextValue = !paid[categoryId];
    setPaid((current) => ({ ...current, [categoryId]: nextValue }));

    if (onlineMode) {
      const client = await waitForSupabaseClient();
      if (!client) return;
      const { error } = await client.from("family_paid_marks").upsert(
        {
          family_code: familyCode,
          category_id: categoryId,
          is_paid: nextValue,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "family_code,category_id" }
      );
      if (error) setSyncStatus("No se pudo marcar");
    }
  };

  const resetMonth = async () => {
    if (!window.confirm("¿Seguro que quieres empezar un nuevo mes? Se borrarán gastos y marcas pagadas.")) return;

    if (onlineMode) {
      const client = await waitForSupabaseClient();
      if (!client) return;
      await client.from("family_expenses").delete().eq("family_code", familyCode);
      await client.from("family_paid_marks").delete().eq("family_code", familyCode);
    } else {
      localStorage.removeItem("familia_expenses_v1");
      localStorage.removeItem("familia_paid_v1");
      setExpenses([]);
      setPaid({});
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(familyCode);
    } catch (_) {
      // Ignorar si el navegador no permite copiar.
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 rounded-3xl bg-white p-5 shadow-sm md:p-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                <Wallet className="h-4 w-4" />
                Sistema financiero familiar conectado
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Presupuesto de Andrés y su esposa</h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Primero Dios, luego casa, comida, deudas, ahorro y dinero personal. Cada gasto se marca aquí para que los dos sepan cómo va el mes.
              </p>
            </div>
            <Button onClick={resetMonth} variant="outline" className="rounded-2xl">
              Nuevo mes
            </Button>
          </div>
        </motion.div>

        <Card className="mb-6 rounded-3xl border-0 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 font-semibold">
                {onlineMode ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
                {onlineMode ? "Modo pareja conectado" : "Modo local"}
              </div>
              <p className="text-sm text-slate-500">
                Estado: {syncStatus}. Usad el mismo código familiar en los dos móviles para ver los mismos gastos.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex rounded-2xl border border-slate-200 bg-white p-1">
                <input
                  className="w-full min-w-0 rounded-xl px-3 py-2 outline-none md:w-52"
                  value={familyCode}
                  onChange={(e) => setFamilyCode(e.target.value.trim().toUpperCase())}
                  placeholder="Código familiar"
                />
                <button onClick={copyCode} className="rounded-xl px-3 hover:bg-slate-100" title="Copiar código">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={() => setOnlineMode((value) => !value)} className="rounded-2xl">
                {onlineMode ? "Usar local" : "Conectar pareja"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <SummaryCard title="Ingresos" amount={totalIncome} helper="Total familiar mensual" />
          <SummaryCard title="Presupuesto" amount={totalBudget} helper="Todo asignado" />
          <SummaryCard title="Gastado / marcado" amount={totalSpent} helper="Gastos registrados" />
          <SummaryCard title="Disponible" amount={remainingGlobal} helper={remainingGlobal >= 0 ? "Dentro del plan" : "Revisar gastos"} danger={remainingGlobal < 0} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold">Categorías del mes</h2>
              <span className="text-sm text-slate-500">Marca cada bloque cuando esté separado o pagado</span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const spent = spentByCategory[category.id] || 0;
                const remaining = category.budget - spent;
                const progress = category.budget > 0 ? Math.min((spent / category.budget) * 100, 100) : 0;
                const isOver = remaining < 0;

                return (
                  <Card key={category.id} className="rounded-3xl border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className="rounded-2xl bg-slate-100 p-2">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-xs text-slate-500">{category.note}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePaid(category.id)}
                          className="rounded-full p-1 text-slate-600 hover:bg-slate-100"
                          aria-label="Marcar como separado o pagado"
                        >
                          {paid[category.id] ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                        </button>
                      </div>

                      <div className="mb-2 flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold">{currency.format(category.budget)}</p>
                          <p className="text-xs text-slate-500">Presupuesto</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${isOver ? "text-red-600" : "text-slate-700"}`}>{currency.format(remaining)}</p>
                          <p className="text-xs text-slate-500">Queda</p>
                        </div>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${isOver ? "bg-red-500" : "bg-slate-900"}`} style={{ width: `${progress}%` }} />
                      </div>

                      <div className="mt-2 flex justify-between text-xs text-slate-500">
                        <span>Gastado: {currency.format(spent)}</span>
                        <span>{paid[category.id] ? "Separado/pagado" : "Pendiente"}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="p-5">
                <h2 className="mb-4 text-xl font-bold">Añadir gasto</h2>
                <div className="space-y-3">
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                    placeholder="Ej: compra Mercadona"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                      placeholder="Importe"
                      type="number"
                      min="0"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    />
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>

                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                    value={form.person}
                    onChange={(e) => setForm({ ...form, person: e.target.value })}
                  >
                    <option>Ambos</option>
                    <option>Andrés</option>
                    <option>Esposa</option>
                  </select>

                  <Button onClick={addExpense} className="w-full rounded-2xl py-6 text-base">
                    <Plus className="mr-2 h-4 w-4" /> Añadir gasto
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="p-5">
                <h2 className="mb-4 text-xl font-bold">Ingresos del mes</h2>
                <div className="space-y-2">
                  {incomeSources.map((income) => (
                    <div key={income.name} className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="text-slate-600">{income.name}</span>
                      <strong>{currency.format(income.amount)}</strong>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <section className="mt-6">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Movimientos registrados</h2>
                <span className="text-sm text-slate-500">{expenses.length} gastos</span>
              </div>

              {expenses.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
                  Todavía no hay gastos. Cuando compréis algo o paguéis un recibo, lo añadís aquí.
                </div>
              ) : (
                <div className="space-y-2">
                  {expenses.map((expense) => {
                    const category = categories.find((item) => item.id === expense.categoryId);
                    return (
                      <div key={expense.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                        <div>
                          <p className="font-semibold">{expense.description}</p>
                          <p className="text-xs text-slate-500">
                            {category?.name} · {expense.person} · {expense.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <strong>{currency.format(expense.amount)}</strong>
                          <button onClick={() => deleteExpense(expense.id)} className="rounded-full p-2 text-slate-500 hover:bg-white hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ title, amount, helper, danger = false }) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="p-5">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className={`mt-2 text-3xl font-bold ${danger ? "text-red-600" : "text-slate-900"}`}>{currency.format(amount)}</p>
        <p className="mt-1 text-xs text-slate-500">{helper}</p>
      </CardContent>
    </Card>
  );
}
