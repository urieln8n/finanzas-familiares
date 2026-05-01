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
  Pencil,
  X,
  CalendarDays,
  TrendingUp,
  ReceiptText,
  Filter,
  Target,
  Crown,
  Check,
  AlertTriangle,
  RotateCcw,
  Settings,
  BarChart3,
  ListChecks,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

/*
  FINANZAS CON PAZ — APP FAMILIAR PROFESIONAL

  Funciona en modo local y también en modo pareja conectado con Supabase.

  Variables necesarias para modo conectado:
  VITE_SUPABASE_URL=tu_url
  VITE_SUPABASE_ANON_KEY=tu_anon_key

  SQL recomendado en Supabase:

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
*/

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const categories = [
  {
    id: "dios",
    name: "Dios primero",
    short: "Dios",
    budget: 280,
    icon: HeartHandshake,
    note: "Diezmo y ofrenda",
    envelope: "Sobre de Dios",
    gradient: "from-amber-400 via-yellow-300 to-orange-300",
    soft: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    priority: 1,
  },
  {
    id: "casa",
    name: "Casa / recibos",
    short: "Casa",
    budget: 1173,
    icon: Home,
    note: "Alquiler, internet, agua, luz, gas, MyBox/teléfono",
    envelope: "La Caixa / recibos",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    soft: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
    priority: 2,
  },
  {
    id: "comida",
    name: "Comida",
    short: "Comida",
    budget: 480,
    icon: Utensils,
    note: "Comida casa + comedor de Uriel",
    envelope: "Sobre comida",
    gradient: "from-emerald-500 via-green-400 to-teal-400",
    soft: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    priority: 3,
  },
  {
    id: "transporte",
    name: "Transporte",
    short: "Transporte",
    budget: 40,
    icon: Car,
    note: "Transporte mensual",
    envelope: "Sobre transporte",
    gradient: "from-cyan-500 via-sky-400 to-blue-400",
    soft: "bg-cyan-50",
    text: "text-cyan-700",
    ring: "ring-cyan-200",
    priority: 4,
  },
  {
    id: "deudas",
    name: "Deudas",
    short: "Deudas",
    budget: 350,
    icon: Landmark,
    note: "Abogada + préstamos",
    envelope: "Cuenta de deudas",
    gradient: "from-rose-500 via-red-400 to-orange-400",
    soft: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
    priority: 5,
  },
  {
    id: "ahorro",
    name: "Ahorro",
    short: "Ahorro",
    budget: 100,
    icon: PiggyBank,
    note: "Ahorro familiar",
    envelope: "Cuenta futuro",
    gradient: "from-lime-500 via-green-500 to-emerald-500",
    soft: "bg-lime-50",
    text: "text-lime-700",
    ring: "ring-lime-200",
    priority: 6,
  },
  {
    id: "emergencias",
    name: "Emergencias",
    short: "Emergencias",
    budget: 117,
    icon: ShieldAlert,
    note: "Solo emergencias reales",
    envelope: "Cuenta futuro",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    soft: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-200",
    priority: 7,
  },
  {
    id: "personal_andres",
    name: "Personal Andrés",
    short: "Andrés",
    budget: 80,
    icon: User,
    note: "Libre, sin justificar",
    envelope: "Sobre Andrés",
    gradient: "from-slate-700 via-slate-600 to-slate-500",
    soft: "bg-slate-100",
    text: "text-slate-700",
    ring: "ring-slate-200",
    priority: 8,
  },
  {
    id: "personal_esposa",
    name: "Personal esposa",
    short: "Esposa",
    budget: 80,
    icon: Users,
    note: "Libre, sin justificar",
    envelope: "Sobre esposa",
    gradient: "from-pink-500 via-rose-400 to-fuchsia-400",
    soft: "bg-pink-50",
    text: "text-pink-700",
    ring: "ring-pink-200",
    priority: 9,
  },
  {
    id: "extras",
    name: "Extras",
    short: "Extras",
    budget: 0,
    icon: Sparkles,
    note: "Solo si entra dinero extra",
    envelope: "Extras",
    gradient: "from-zinc-500 via-stone-400 to-neutral-400",
    soft: "bg-zinc-50",
    text: "text-zinc-700",
    ring: "ring-zinc-200",
    priority: 10,
  },
];

const incomeSources = [
  { id: "andres", name: "Ingreso Andrés", amount: 1500 },
  { id: "esposa", name: "Ingreso esposa", amount: 700 },
  { id: "habitacion", name: "Alquiler habitación", amount: 420 },
  { id: "imv", name: "Ingreso mínimo vital", amount: 80 },
];

const quickExpenses = [
  { label: "Compra", categoryId: "comida", description: "Compra supermercado" },
  { label: "Recibo", categoryId: "casa", description: "Pago recibo" },
  { label: "Deuda", categoryId: "deudas", description: "Pago deuda" },
  { label: "Personal", categoryId: "personal_andres", description: "Gasto personal" },
];

const tabs = [
  { id: "dashboard", label: "Panel", icon: BarChart3 },
  { id: "movimientos", label: "Movimientos", icon: ReceiptText },
  { id: "semana", label: "Semana", icon: CalendarDays },
  { id: "ajustes", label: "Ajustes", icon: Settings },
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
  return localStorage.getItem("family_code_v2") || "FAMILIA-RENDON";
}

function getWeekRange(date = new Date()) {
  const current = new Date(date);
  const day = current.getDay() || 7;
  const monday = new Date(current);
  monday.setDate(current.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function dateInRange(dateString, start, end) {
  const value = new Date(`${dateString}T12:00:00`);
  return value >= start && value <= end;
}

function percentage(value, total) {
  if (!total || total <= 0) return 0;
  return Math.min(Math.max((value / total) * 100, 0), 100);
}

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

export default function AppFinanzasFamiliares() {
  const [expenses, setExpenses] = useState([]);
  const [paid, setPaid] = useState({});
  const [monthlyHistory, setMonthlyHistory] = useState([]);
  const [familyCode, setFamilyCode] = useState(getStoredFamilyCode());
  const [onlineMode, setOnlineMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Modo local");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPerson, setFilterPerson] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    categoryId: "comida",
    person: "Ambos",
    date: getToday(),
  });

  const totalIncome = useMemo(() => incomeSources.reduce((sum, item) => sum + item.amount, 0), []);
  const totalBudget = useMemo(() => categories.reduce((sum, item) => sum + item.budget, 0), []);
  const totalSpent = useMemo(() => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0), [expenses]);
  const remainingGlobal = totalBudget - totalSpent;
  const generalProgress = percentage(totalSpent, totalBudget);

  const spentByCategory = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      acc[expense.categoryId] = (acc[expense.categoryId] || 0) + Number(expense.amount || 0);
      return acc;
    }, {});
  }, [expenses]);

  const { monday, sunday } = useMemo(() => getWeekRange(), []);
  const weeklyExpenses = useMemo(
    () => expenses.filter((expense) => dateInRange(expense.date, monday, sunday)),
    [expenses, monday, sunday]
  );
  const weeklySpent = useMemo(() => weeklyExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0), [weeklyExpenses]);
  const weeklyBudget = Math.round(totalBudget / 4.33);
  const weeklyRemaining = weeklyBudget - weeklySpent;

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const categoryMatch = filterCategory === "all" || expense.categoryId === filterCategory;
      const personMatch = filterPerson === "all" || expense.person === filterPerson;
      return categoryMatch && personMatch;
    });
  }, [expenses, filterCategory, filterPerson]);

  const paidCount = useMemo(() => categories.filter((category) => paid[category.id]).length, [paid]);
  const topCategory = useMemo(() => {
    return [...categories]
      .map((category) => ({ ...category, spent: spentByCategory[category.id] || 0 }))
      .sort((a, b) => b.spent - a.spent)[0];
  }, [spentByCategory]);

  const status = useMemo(() => {
    if (remainingGlobal < 0) {
      return {
        label: "Revisar gastos",
        detail: "El mes ya superó el presupuesto. Revisad juntos qué se puede ajustar.",
        tone: "bg-rose-50 text-rose-700 ring-rose-200",
        icon: AlertTriangle,
      };
    }
    if (generalProgress >= 85) {
      return {
        label: "Atención esta semana",
        detail: "Estáis cerca del límite. Conviene controlar comida, extras y gastos pequeños.",
        tone: "bg-amber-50 text-amber-700 ring-amber-200",
        icon: AlertTriangle,
      };
    }
    return {
      label: "Mes en orden",
      detail: "La casa está organizada. Seguid registrando cada movimiento con calma.",
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      icon: Check,
    };
  }, [generalProgress, remainingGlobal]);

  useEffect(() => {
    localStorage.setItem("family_code_v2", familyCode);
  }, [familyCode]);

  useEffect(() => {
    loadLocalData();
  }, []);

  useEffect(() => {
    if (!onlineMode) {
      localStorage.setItem("familia_expenses_v2", JSON.stringify(expenses));
      localStorage.setItem("familia_paid_v2", JSON.stringify(paid));
      localStorage.setItem("familia_monthly_history_v2", JSON.stringify(monthlyHistory));
    }
  }, [expenses, paid, monthlyHistory, onlineMode]);

  useEffect(() => {
    let cancelled = false;
    let expensesChannel = null;
    let paidChannel = null;

    async function setupRealtime() {
      if (!onlineMode) return;

      if (!supabase) {
        setOnlineMode(false);
        setSyncStatus("Falta configurar Supabase");
        return;
      }

      setSyncStatus("Conectando...");
      await loadOnlineData();
      if (cancelled) return;

      setSyncStatus("Conectados");

      expensesChannel = supabase
        .channel(`family-expenses-${familyCode}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "family_expenses", filter: `family_code=eq.${familyCode}` },
          () => loadOnlineData()
        )
        .subscribe();

      paidChannel = supabase
        .channel(`family-paid-${familyCode}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "family_paid_marks", filter: `family_code=eq.${familyCode}` },
          () => loadOnlineData()
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
      const savedExpensesV2 = localStorage.getItem("familia_expenses_v2");
      const savedPaidV2 = localStorage.getItem("familia_paid_v2");
      const savedExpensesV1 = localStorage.getItem("familia_expenses_v1");
      const savedPaidV1 = localStorage.getItem("familia_paid_v1");
      const savedHistory = localStorage.getItem("familia_monthly_history_v2");
      if (savedExpensesV2 || savedExpensesV1) setExpenses(JSON.parse(savedExpensesV2 || savedExpensesV1));
      if (savedPaidV2 || savedPaidV1) setPaid(JSON.parse(savedPaidV2 || savedPaidV1));
      if (savedHistory) setMonthlyHistory(JSON.parse(savedHistory));
    } catch (error) {
      console.warn("No se pudo cargar el presupuesto guardado", error);
    }
  }

  async function loadOnlineData() {
    if (!supabase) {
      setSyncStatus("Falta configurar Supabase");
      return;
    }

    const { data: expensesData, error: expensesError } = await supabase
      .from("family_expenses")
      .select("*")
      .eq("family_code", familyCode)
      .order("created_at", { ascending: false });

    if (expensesError) {
      console.error("Error leyendo family_expenses:", expensesError);
      setSyncStatus(`Error gastos: ${expensesError.message}`);
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

    const { data: paidData, error: paidError } = await supabase
      .from("family_paid_marks")
      .select("*")
      .eq("family_code", familyCode);

    if (paidError) {
      console.error("Error leyendo family_paid_marks:", paidError);
      setSyncStatus(`Error marcas: ${paidError.message}`);
    } else {
      const paidMap = {};
      (paidData || []).forEach((item) => {
        paidMap[item.category_id] = item.is_paid;
      });
      setPaid(paidMap);
    }

    const { data: archivesData, error: archivesError } = await supabase
      .from("family_monthly_archives")
      .select("*")
      .eq("family_code", familyCode)
      .order("closed_at", { ascending: false });

    if (archivesError) {
      console.warn("Historial mensual no disponible todavía:", archivesError);
    } else {
      setMonthlyHistory(
        (archivesData || []).map((item) => ({
          id: item.id,
          familyCode: item.family_code,
          monthKey: item.month_key,
          monthName: item.month_name,
          closedAt: item.closed_at,
          totalIncome: Number(item.total_income || 0),
          totalBudget: Number(item.total_budget || 0),
          totalSpent: Number(item.total_spent || 0),
          remaining: Number(item.remaining || 0),
          expensesCount: Number(item.expenses_count || 0),
          categorySummary: item.category_summary || [],
        }))
      );
    }

    setSyncStatus("Conectados");
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      description: "",
      amount: "",
      categoryId: "comida",
      person: "Ambos",
      date: getToday(),
    });
  }

  function startEdit(expense) {
    setEditingId(expense.id);
    setForm({
      description: expense.description,
      amount: String(expense.amount),
      categoryId: expense.categoryId,
      person: expense.person,
      date: expense.date,
    });
    setActiveTab("movimientos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applyQuickExpense(item) {
    setForm((current) => ({
      ...current,
      description: item.description,
      categoryId: item.categoryId,
      person: item.categoryId.includes("personal") ? "Andrés" : "Ambos",
    }));
  }

  const saveExpense = async () => {
    const amount = Number(form.amount);

    if (!form.description.trim()) {
      setSyncStatus("Escribe una descripción");
      return;
    }

    if (!amount || amount <= 0) {
      setSyncStatus("Escribe un importe válido");
      return;
    }

    const payload = {
      id: editingId || crypto.randomUUID(),
      description: form.description.trim(),
      amount,
      categoryId: form.categoryId,
      person: form.person,
      date: form.date || getToday(),
      createdAt: editingId ? expenses.find((item) => item.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
    };

    const saveLocal = () => {
      setExpenses((current) => (editingId ? current.map((item) => (item.id === editingId ? payload : item)) : [payload, ...current]));
      setSyncStatus(editingId ? "Gasto actualizado" : "Gasto añadido");
      setTimeout(() => setSyncStatus(onlineMode ? "Conectados" : "Modo local"), 1200);
    };

    if (onlineMode && supabase) {
      const record = {
        id: payload.id,
        family_code: familyCode,
        description: payload.description,
        amount: payload.amount,
        category_id: payload.categoryId,
        person: payload.person,
        expense_date: payload.date,
        created_at: payload.createdAt,
      };

      const { error } = editingId
        ? await supabase.from("family_expenses").update(record).eq("id", editingId).eq("family_code", familyCode)
        : await supabase.from("family_expenses").insert(record);

      if (error) {
        console.error("Error guardando en Supabase:", error);
        setSyncStatus("Error Supabase: guardado local");
        saveLocal();
      } else {
        setSyncStatus(editingId ? "Gasto actualizado" : "Gasto añadido");
        await loadOnlineData();
      }
    } else {
      saveLocal();
    }

    resetForm();
  };

  const deleteExpense = async (id) => {
    if (onlineMode && supabase) {
      const { error } = await supabase.from("family_expenses").delete().eq("id", id).eq("family_code", familyCode);
      if (error) {
        setSyncStatus("No se pudo borrar");
        return;
      }
    } else {
      setExpenses((current) => current.filter((item) => item.id !== id));
    }

    if (editingId === id) resetForm();
  };

  const togglePaid = async (categoryId) => {
    const nextValue = !paid[categoryId];
    setPaid((current) => ({ ...current, [categoryId]: nextValue }));

    if (onlineMode && supabase) {
      const { error } = await supabase.from("family_paid_marks").upsert(
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
    if (!window.confirm("¿Quieres cerrar este mes, guardar el resumen y empezar un mes nuevo?")) return;

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthName = now.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    const categorySummary = categories.map((category) => {
      const spent = spentByCategory[category.id] || 0;
      return {
        id: category.id,
        name: category.name,
        budget: category.budget,
        spent,
        remaining: category.budget - spent,
        paid: !!paid[category.id],
      };
    });

    const archive = {
      id: crypto.randomUUID(),
      familyCode,
      monthKey,
      monthName,
      closedAt: now.toISOString(),
      totalIncome,
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      expensesCount: expenses.length,
      categorySummary,
    };

    setMonthlyHistory((current) => [archive, ...current]);

    if (onlineMode && supabase) {
      const { error: archiveError } = await supabase.from("family_monthly_archives").insert({
        id: archive.id,
        family_code: archive.familyCode,
        month_key: archive.monthKey,
        month_name: archive.monthName,
        closed_at: archive.closedAt,
        total_income: archive.totalIncome,
        total_budget: archive.totalBudget,
        total_spent: archive.totalSpent,
        remaining: archive.remaining,
        expenses_count: archive.expensesCount,
        category_summary: archive.categorySummary,
      });

      if (archiveError) {
        console.warn("No se pudo guardar el historial en Supabase. Se guardó localmente.", archiveError);
        setSyncStatus("Historial guardado local");
      }

      await supabase.from("family_expenses").delete().eq("family_code", familyCode);
      await supabase.from("family_paid_marks").delete().eq("family_code", familyCode);
      await loadOnlineData();
    } else {
      localStorage.removeItem("familia_expenses_v2");
      localStorage.removeItem("familia_paid_v2");
      setExpenses([]);
      setPaid({});
    }

    resetForm();
    setSyncStatus("Mes cerrado");
    setTimeout(() => setSyncStatus(onlineMode ? "Conectados" : "Modo local"), 1200);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(familyCode);
      setSyncStatus("Código copiado");
      setTimeout(() => setSyncStatus(onlineMode ? "Conectados" : "Modo local"), 1200);
    } catch (_) {
      setSyncStatus("No se pudo copiar");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fef3c7,transparent_30%),radial-gradient(circle_at_top_right,#dbeafe,transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
        <Hero
          onlineMode={onlineMode}
          setOnlineMode={setOnlineMode}
          syncStatus={syncStatus}
          familyCode={familyCode}
          setFamilyCode={setFamilyCode}
          copyCode={copyCode}
          resetMonth={resetMonth}
          status={status}
        />

        <MobileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <DesktopNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <FaithCard />
            <MiniChecklist paidCount={paidCount} />
          </aside>

          <main className="space-y-6">
            {activeTab === "dashboard" && (
              <DashboardView
                totalIncome={totalIncome}
                totalBudget={totalBudget}
                totalSpent={totalSpent}
                remainingGlobal={remainingGlobal}
                generalProgress={generalProgress}
                status={status}
                paid={paid}
                togglePaid={togglePaid}
                spentByCategory={spentByCategory}
                topCategory={topCategory}
                weeklyBudget={weeklyBudget}
                weeklySpent={weeklySpent}
                weeklyRemaining={weeklyRemaining}
                startEdit={startEdit}
                latestExpenses={expenses.slice(0, 5)}
              />
            )}

            {activeTab === "movimientos" && (
              <MovementsView
                form={form}
                setForm={setForm}
                editingId={editingId}
                saveExpense={saveExpense}
                resetForm={resetForm}
                applyQuickExpense={applyQuickExpense}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterPerson={filterPerson}
                setFilterPerson={setFilterPerson}
                filteredExpenses={filteredExpenses}
                deleteExpense={deleteExpense}
                startEdit={startEdit}
              />
            )}

            {activeTab === "semana" && (
              <WeekView
                weeklyBudget={weeklyBudget}
                weeklySpent={weeklySpent}
                weeklyRemaining={weeklyRemaining}
                weeklyExpenses={weeklyExpenses}
                spentByCategory={spentByCategory}
                monday={monday}
                sunday={sunday}
              />
            )}

            {activeTab === "ajustes" && (
              <SettingsView
                totalIncome={totalIncome}
                totalBudget={totalBudget}
                familyCode={familyCode}
                setFamilyCode={setFamilyCode}
                onlineMode={onlineMode}
                setOnlineMode={setOnlineMode}
                syncStatus={syncStatus}
                copyCode={copyCode}
                resetMonth={resetMonth}
                monthlyHistory={monthlyHistory}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function Hero({ onlineMode, setOnlineMode, syncStatus, familyCode, setFamilyCode, copyCode, resetMonth, status }) {
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
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">Nuestro hogar, organizado con fe, orden y paz.</h1>
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
              <div className={classNames("rounded-full p-2", onlineMode ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10 text-white/70")}>
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
              <Button onClick={() => setOnlineMode((value) => !value)} className="rounded-2xl bg-white text-slate-950 hover:bg-white/90">
                {onlineMode ? "Usar local" : "Conectar"}
              </Button>
              <Button onClick={resetMonth} variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <RotateCcw className="mr-2 h-4 w-4" /> Mes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function DesktopNav({ activeTab, setActiveTab }) {
  return (
    <Card className="rounded-[1.75rem] border-0 bg-white/75 shadow-xl shadow-slate-200/60 backdrop-blur">
      <CardContent className="p-3">
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={classNames(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
                  active ? "bg-slate-950 text-white shadow-lg shadow-slate-300" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function MobileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="sticky top-3 z-30 mt-4 rounded-3xl bg-white/85 p-2 shadow-xl shadow-slate-200/80 backdrop-blur lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={classNames("flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold", active ? "bg-slate-950 text-white" : "text-slate-500")}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FaithCard() {
  return (
    <Card className="mt-4 overflow-hidden rounded-[1.75rem] border-0 bg-gradient-to-br from-amber-300 to-orange-400 text-slate-950 shadow-xl shadow-amber-200/60">
      <CardContent className="p-5">
        <HeartHandshake className="mb-4 h-8 w-8" />
        <p className="text-sm font-black uppercase tracking-wide">Principio de la casa</p>
        <p className="mt-2 text-lg font-black leading-tight">Primero honramos a Dios, después administramos con sabiduría.</p>
      </CardContent>
    </Card>
  );
}

function MiniChecklist({ paidCount }) {
  return (
    <Card className="mt-4 rounded-[1.75rem] border-0 bg-white/75 shadow-xl shadow-slate-200/60 backdrop-blur">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-slate-600" />
          <p className="font-bold">Bloques separados</p>
        </div>
        <p className="text-3xl font-black">{paidCount}/10</p>
        <p className="mt-1 text-sm text-slate-500">Marcad cada categoría cuando el dinero esté apartado o pagado.</p>
      </CardContent>
    </Card>
  );
}

function DashboardView({ totalIncome, totalBudget, totalSpent, remainingGlobal, generalProgress, status, paid, togglePaid, spentByCategory, topCategory, weeklyBudget, weeklySpent, weeklyRemaining, startEdit, latestExpenses }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Ingresos" amount={totalIncome} helper="Total familiar mensual" icon={TrendingUp} />
        <SummaryCard title="Presupuesto" amount={totalBudget} helper="Todo asignado" icon={Wallet} />
        <SummaryCard title="Gastado" amount={totalSpent} helper="Movimientos registrados" icon={ReceiptText} />
        <SummaryCard title="Disponible" amount={remainingGlobal} helper={remainingGlobal >= 0 ? "Dentro del plan" : "Revisar urgente"} icon={Target} danger={remainingGlobal < 0} />
      </div>

      <Card className="overflow-hidden rounded-[1.75rem] border-0 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Progreso del mes</p>
              <h2 className="mt-1 text-2xl font-black">{Math.round(generalProgress)}% del presupuesto usado</h2>
              <p className="mt-1 text-sm text-slate-500">La meta es registrar todo y revisar juntos cada semana, sin culpas.</p>
            </div>
            <div className={classNames("rounded-2xl px-4 py-3 text-sm font-bold ring-1", status.tone)}>{status.label}</div>
          </div>
          <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-500 transition-all" style={{ width: `${generalProgress}%` }} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <InfoPill title="Esta semana" value={currency.format(weeklyRemaining)} helper={`Disponible de ${currency.format(weeklyBudget)}`} />
            <InfoPill title="Categoría más usada" value={topCategory?.short || "—"} helper={topCategory ? currency.format(topCategory.spent) : "Sin gastos"} />
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
            <CategoryCard key={category.id} category={category} index={index} spent={spentByCategory[category.id] || 0} isPaid={!!paid[category.id]} onToggle={() => togglePaid(category.id)} />
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

function MovementsView({ form, setForm, editingId, saveExpense, resetForm, applyQuickExpense, filterCategory, setFilterCategory, filterPerson, setFilterPerson, filteredExpenses, deleteExpense, startEdit }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <div className="space-y-4">
        <Card className="rounded-[1.75rem] border-0 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
          <CardContent className="p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">{editingId ? "Editar gasto" : "Añadir gasto"}</h2>
                <p className="text-sm text-slate-500">Cada gasto pequeño cuenta. Si se gasta, se apunta.</p>
              </div>
              {editingId && (
                <button onClick={resetForm} className="rounded-full bg-slate-100 p-2 hover:bg-slate-200">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              {quickExpenses.map((item) => (
                <button key={item.label} onClick={() => applyQuickExpense(item)} className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200">
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <FieldLabel label="Descripción">
                <input
                  className="input-pro"
                  placeholder="Ej: compra Mercadona"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </FieldLabel>

              <div className="grid grid-cols-2 gap-3">
                <FieldLabel label="Importe">
                  <input
                    className="input-pro"
                    placeholder="0"
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </FieldLabel>
                <FieldLabel label="Fecha">
                  <input className="input-pro" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </FieldLabel>
              </div>

              <FieldLabel label="Categoría">
                <select className="input-pro" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Quién lo registró">
                <select className="input-pro" value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })}>
                  <option>Ambos</option>
                  <option>Andrés</option>
                  <option>Esposa</option>
                </select>
              </FieldLabel>

              <Button onClick={saveExpense} className="w-full rounded-2xl bg-slate-950 py-6 text-base font-black hover:bg-slate-800">
                {editingId ? <Pencil className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingId ? "Guardar cambios" : "Añadir gasto"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[1.75rem] border-0 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-5">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-black">Movimientos</h2>
              <p className="text-sm text-slate-500">Filtra por categoría o por persona.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 md:w-[360px]">
              <select className="input-pro" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.short}
                  </option>
                ))}
              </select>
              <select className="input-pro" value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)}>
                <option value="all">Todos</option>
                <option>Ambos</option>
                <option>Andrés</option>
                <option>Esposa</option>
              </select>
            </div>
          </div>
          <MovementList expenses={filteredExpenses} emptyText="No hay movimientos con esos filtros." onDelete={deleteExpense} onEdit={startEdit} />
        </CardContent>
      </Card>
    </div>
  );
}

function WeekView({ weeklyBudget, weeklySpent, weeklyRemaining, weeklyExpenses, monday, sunday }) {
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

function SettingsView({ totalIncome, totalBudget, familyCode, setFamilyCode, onlineMode, setOnlineMode, syncStatus, copyCode, resetMonth, monthlyHistory }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="rounded-[1.75rem] border-0 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-5">
          <h2 className="text-2xl font-black">Configuración familiar</h2>
          <p className="mt-1 text-sm text-slate-500">Usad el mismo código en los dos móviles.</p>

          <div className="mt-5 space-y-4">
            <FieldLabel label="Código familiar">
              <div className="flex gap-2">
                <input className="input-pro" value={familyCode} onChange={(e) => setFamilyCode(e.target.value.trim().toUpperCase())} />
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
                <Button onClick={() => setOnlineMode((value) => !value)} className="rounded-2xl bg-slate-950 hover:bg-slate-800">
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
              <div key={income.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
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
            <p className="mt-1 text-sm text-amber-700">Todo está asignado. No sobra sin destino: cada euro tiene una misión.</p>
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
                <div key={month.id} className="grid gap-3 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100 md:grid-cols-5 md:items-center">
                  <div className="md:col-span-2">
                    <p className="font-black capitalize">{month.monthName}</p>
                    <p className="text-xs text-slate-500">{month.expensesCount} movimientos · cerrado el {new Date(month.closedAt).toLocaleDateString("es-ES")}</p>
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

function SummaryCard({ title, amount, helper, icon: Icon, danger = false }) {
  return (
    <Card className="rounded-[1.75rem] border-0 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <div className={classNames("rounded-2xl p-2", danger ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-700")}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className={classNames("text-3xl font-black tracking-tight", danger ? "text-rose-600" : "text-slate-950")}>{currency.format(amount)}</p>
        <p className="mt-1 text-xs font-medium text-slate-500">{helper}</p>
      </CardContent>
    </Card>
  );
}

function CategoryCard({ category, spent, isPaid, onToggle, index }) {
  const Icon = category.icon;
  const remaining = category.budget - spent;
  const isOver = remaining < 0;
  const progress = category.budget > 0 ? percentage(spent, category.budget) : spent > 0 ? 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.025 }}>
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
              <button onClick={onToggle} className={classNames("rounded-full p-1 transition", isPaid ? "text-emerald-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700")}> 
                {isPaid ? <CheckCircle2 className="h-7 w-7" /> : <Circle className="h-7 w-7" />}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <MiniMetric label="Plan" value={currency.format(category.budget)} />
              <MiniMetric label="Gastado" value={currency.format(spent)} />
              <MiniMetric label="Queda" value={currency.format(remaining)} danger={isOver} />
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className={classNames("h-full rounded-full bg-gradient-to-r", isOver ? "from-rose-500 to-red-500" : category.gradient)} style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs font-bold">
              <span className={category.text}>{category.envelope}</span>
              <span className={isPaid ? "text-emerald-600" : "text-slate-400"}>{isPaid ? "Separado/pagado" : "Pendiente"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WeeklyCategory({ category, spent }) {
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
          <p className={classNames("text-sm font-black", remaining < 0 ? "text-rose-600" : "text-emerald-600")}>{currency.format(remaining)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MovementList({ expenses, emptyText, onDelete, onEdit, compact = false }) {
  if (!expenses.length) {
    return <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm font-medium text-slate-500 ring-1 ring-slate-100">{emptyText}</div>;
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => {
        const category = categories.find((item) => item.id === expense.categoryId) || categories[0];
        const Icon = category.icon;
        return (
          <div key={expense.id} className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100 transition hover:bg-white hover:shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <div className={classNames("hidden rounded-2xl p-2 ring-1 sm:block", category.soft, category.text, category.ring)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-black">{expense.description}</p>
                <p className="truncate text-xs font-medium text-slate-500">
                  {category.short} · {expense.person} · {new Date(`${expense.date}T12:00:00`).toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <strong className="text-sm md:text-base">{currency.format(expense.amount)}</strong>
              {!compact && onEdit && (
                <button onClick={() => onEdit(expense)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950">
                  <Pencil className="h-4 w-4" />
                </button>
              )}
              {!compact && onDelete && (
                <button onClick={() => onDelete(expense.id)} className="rounded-full p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniMetric({ label, value, danger = false }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={classNames("mt-1 text-sm font-black", danger ? "text-rose-600" : "text-slate-800")}>{value}</p>
    </div>
  );
}

function InfoPill({ title, value, helper }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function InfoPillDark({ title, value }) {
  return (
    <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-wide text-white/45">{title}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function FieldLabel({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  );
}
