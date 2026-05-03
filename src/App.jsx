import { useEffect, useMemo, useRef, useState } from "react";
import { Check, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getToday, getStoredFamilyCode, getWeekRange, dateInRange, percentage } from "@/lib/helpers";
import { categories, incomeSources } from "@/data/budget";
import AuthScreen, { LoadingScreen } from "@/components/AuthScreen";
import Hero from "@/components/Hero";
import { DesktopNav, MobileTabs } from "@/components/Navigation";
import { FaithCard, MiniChecklist } from "@/components/FaithCard";
import Notification from "@/components/Notification";
import DashboardView from "@/views/DashboardView";
import MovementsView from "@/views/MovementsView";
import WeekView from "@/views/WeekView";
import SettingsView from "@/views/SettingsView";

// DEV ONLY — bypass temporal de login. Activar con VITE_DISABLE_LOGIN=true en .env.local
const DEV_BYPASS = import.meta.env.VITE_DISABLE_LOGIN === "true";

export default function AppFinanzasFamiliares() {
  const [expenses, setExpenses] = useState([]);
  const [paid, setPaid] = useState({});
  const [monthlyHistory, setMonthlyHistory] = useState([]);
  // DEV: si bypass activo, sesión falsa para entrar directo al dashboard
  const [session, setSession] = useState(
    DEV_BYPASS ? { user: { email: "Modo privado — sin login" } } : null
  );
  const [authLoading, setAuthLoading] = useState(DEV_BYPASS ? false : true);
  const [authMode, setAuthMode] = useState("signin");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authMessage, setAuthMessage] = useState("");
  const [familyCode, setFamilyCode] = useState(getStoredFamilyCode());
  const [onlineMode, setOnlineMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Modo local");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPerson, setFilterPerson] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "info" });
  const notifyTimer = useRef(null);
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
  const weeklySpent = useMemo(
    () => weeklyExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [weeklyExpenses]
  );
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

  // Muestra una notificación flotante. Los errores se quedan hasta que el usuario los cierra;
  // el resto se auto-descartan a los 3,5 s.
  function notify(message, type = "info") {
    setNotification({ message, type });
    clearTimeout(notifyTimer.current);
    if (type !== "error") {
      notifyTimer.current = setTimeout(
        () => setNotification({ message: "", type: "info" }),
        3500
      );
    }
  }

  // Limpia el timer al desmontar para evitar memory leaks
  useEffect(() => () => clearTimeout(notifyTimer.current), []);

  useEffect(() => {
    if (DEV_BYPASS) return; // DEV: bypass activo, no iniciar Supabase Auth

    if (!supabase) {
      setAuthLoading(false);
      setAuthMessage("Falta configurar Supabase");
      return;
    }

    let mounted = true;

    async function initAuth() {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) setAuthMessage(error.message);
      setSession(data?.session || null);
      setAuthLoading(false);
    }

    initAuth();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      data?.subscription?.unsubscribe();
    };
  }, []);

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
        notify("Configura las variables de Supabase para usar el modo pareja.", "error");
        return;
      }

      try {
        setSyncStatus("Conectando...");
        await loadOnlineData();
        if (cancelled) return;

        setSyncStatus("Conectados");

        // El callback de subscribe recibe el status de la conexión; si hay error
        // lo mostramos pero NO desconectamos — puede ser transitorio.
        const handleChannelError = (status) => {
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            notify("Error en sincronización en tiempo real. Los cambios del otro dispositivo pueden no verse.", "warning");
          }
        };

        expensesChannel = supabase
          .channel(`family-expenses-${familyCode}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "family_expenses", filter: `family_code=eq.${familyCode}` },
            () => { if (!cancelled) loadOnlineData(); }
          )
          .subscribe(handleChannelError);

        paidChannel = supabase
          .channel(`family-paid-${familyCode}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "family_paid_marks", filter: `family_code=eq.${familyCode}` },
            () => { if (!cancelled) loadOnlineData(); }
          )
          .subscribe(handleChannelError);

      } catch (err) {
        console.error("Error configurando Realtime:", err);
        setSyncStatus("Error de conexión");
        notify("No se pudo conectar al modo pareja. Comprueba la conexión.", "error");
      }
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
    } catch (err) {
      console.warn("No se pudo cargar el presupuesto guardado:", err);
      notify("No se pudo leer el presupuesto guardado localmente.", "warning");
    }
  }

  async function loadOnlineData() {
    if (!supabase) {
      setSyncStatus("Falta configurar Supabase");
      return;
    }

    try {
      // Gastos — bloquea si falla (son los datos principales)
      const { data: expensesData, error: expensesError } = await supabase
        .from("family_expenses")
        .select("*")
        .eq("family_code", familyCode)
        .order("created_at", { ascending: false });

      if (expensesError) {
        console.error("Error leyendo family_expenses:", expensesError);
        setSyncStatus("Error al cargar gastos");
        notify(`No se pudieron cargar los gastos: ${expensesError.message}`, "error");
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

      // Marcas de pago — independiente: si falla no bloquea los gastos
      const { data: paidData, error: paidError } = await supabase
        .from("family_paid_marks")
        .select("*")
        .eq("family_code", familyCode);

      if (paidError) {
        console.error("Error leyendo family_paid_marks:", paidError);
        notify("No se pudieron cargar las marcas de categorías.", "warning");
      } else {
        const paidMap = {};
        (paidData || []).forEach((item) => {
          paidMap[item.category_id] = item.is_paid;
        });
        setPaid(paidMap);
      }

      // Historial mensual — independiente: si falla no bloquea nada
      const { data: archivesData, error: archivesError } = await supabase
        .from("family_monthly_archives")
        .select("*")
        .eq("family_code", familyCode)
        .order("closed_at", { ascending: false });

      if (archivesError) {
        // Solo warning: tabla puede no existir todavía en proyectos nuevos
        console.warn("Historial mensual no disponible:", archivesError);
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
    } catch (err) {
      console.error("Error inesperado cargando datos online:", err);
      setSyncStatus("Error de conexión");
      notify("Error inesperado al sincronizar. Los datos locales siguen disponibles.", "error");
    }
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
    // Validación mejorada
    const description = form.description.trim();
    const amount = Number(form.amount);

    if (!description) {
      notify("Escribe una descripción para el gasto.", "error");
      return;
    }
    if (description.length < 2) {
      notify("La descripción es demasiado corta.", "error");
      return;
    }
    if (!form.amount || isNaN(amount) || amount <= 0) {
      notify("El importe debe ser un número mayor que 0.", "error");
      return;
    }
    if (amount > 99999) {
      notify("El importe parece demasiado alto. ¿Es correcto?", "warning");
      return;
    }
    if (!form.date) {
      notify("Selecciona una fecha para el gasto.", "error");
      return;
    }

    const payload = {
      id: editingId || crypto.randomUUID(),
      description,
      amount,
      categoryId: form.categoryId,
      person: form.person,
      date: form.date,
      createdAt: editingId
        ? expenses.find((item) => item.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    };

    const saveLocal = () => {
      setExpenses((current) =>
        editingId ? current.map((item) => (item.id === editingId ? payload : item)) : [payload, ...current]
      );
      notify(editingId ? "Gasto actualizado." : "Gasto añadido.", "success");
    };

    setIsSaving(true);
    try {
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
          notify("No se pudo guardar en Supabase. El gasto se guardó localmente.", "warning");
          saveLocal();
        } else {
          notify(editingId ? "Gasto actualizado." : "Gasto añadido.", "success");
          await loadOnlineData();
        }
      } else {
        saveLocal();
      }
    } finally {
      setIsSaving(false);
      resetForm();
    }
  };

  const deleteExpense = async (id) => {
    if (onlineMode && supabase) {
      const { error } = await supabase
        .from("family_expenses")
        .delete()
        .eq("id", id)
        .eq("family_code", familyCode);
      if (error) {
        console.error("Error borrando gasto:", error);
        notify("No se pudo eliminar el gasto. Inténtalo de nuevo.", "error");
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
      if (error) {
        console.error("Error marcando categoría:", error);
        // Revertir el cambio optimista si falló
        setPaid((current) => ({ ...current, [categoryId]: !nextValue }));
        notify("No se pudo guardar la marca de categoría.", "error");
      }
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

    // Primero guardamos localmente para no perder el resumen aunque falle Supabase
    setMonthlyHistory((current) => [archive, ...current]);
    setExpenses([]);
    setPaid({});
    resetForm();

    if (onlineMode && supabase) {
      try {
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
          console.error("Error guardando historial mensual:", archiveError);
          notify(`El resumen del mes no se pudo guardar en Supabase: ${archiveError.message}`, "error");
          return;
        }

        const { error: deleteExpensesError } = await supabase
          .from("family_expenses")
          .delete()
          .eq("family_code", familyCode);
        if (deleteExpensesError) {
          console.error("Error limpiando gastos del mes:", deleteExpensesError);
          notify("No se pudieron borrar los gastos del mes anterior en Supabase.", "error");
          return;
        }

        const { error: deletePaidError } = await supabase
          .from("family_paid_marks")
          .delete()
          .eq("family_code", familyCode);
        if (deletePaidError) {
          console.error("Error limpiando marcas del mes:", deletePaidError);
          notify("No se pudieron borrar las marcas del mes anterior en Supabase.", "error");
          return;
        }

        notify("¡Mes cerrado correctamente! Empezad el mes nuevo con calma.", "success");
        setSyncStatus("Conectados");
      } catch (err) {
        console.error("Error inesperado cerrando el mes:", err);
        notify(`Error inesperado al cerrar el mes: ${err.message}`, "error");
      }
    } else {
      localStorage.removeItem("familia_expenses_v2");
      localStorage.removeItem("familia_paid_v2");
      notify("¡Mes cerrado correctamente! Empezad el mes nuevo con calma.", "success");
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(familyCode);
      notify("Código familiar copiado.", "success");
    } catch (_) {
      notify("No se pudo copiar el código. Cópialo manualmente.", "warning");
    }
  };

  const handleAuthSubmit = async (event) => {
    event?.preventDefault();
    setAuthMessage("");

    if (!supabase) {
      setAuthMessage("Falta configurar Supabase.");
      return;
    }

    const email = authForm.email.trim();
    const password = authForm.password;

    if (!email || !password) {
      setAuthMessage("Escribe email y contraseña.");
      return;
    }

    if (password.length < 6) {
      setAuthMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setAuthLoading(true);

    const response =
      authMode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setAuthLoading(false);

    if (response.error) {
      setAuthMessage(response.error.message);
      return;
    }

    if (authMode === "signup" && !response.data.session) {
      setAuthMessage("Cuenta creada. Revisa tu correo para confirmar el acceso.");
      return;
    }

    setSession(response.data.session || null);
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setAuthMessage("");
  };

  if (authLoading) return <LoadingScreen />;

  if (!session) {
    return (
      <AuthScreen
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        authMessage={authMessage}
        onSubmit={handleAuthSubmit}
      />
    );
  }

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
          session={session}
          onSignOut={handleSignOut}
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
                isSaving={isSaving}
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

      <Notification
        notification={notification}
        onDismiss={() => setNotification({ message: "", type: "info" })}
      />
    </div>
  );
}
