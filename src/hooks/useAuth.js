import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DEV_BYPASS = import.meta.env.VITE_DISABLE_LOGIN === "true";

export function useAuth() {
  const [session, setSession] = useState(
    DEV_BYPASS ? { user: { email: "Modo privado — sin login" } } : null
  );
  const [authLoading, setAuthLoading] = useState(DEV_BYPASS ? false : true);
  const [authMode, setAuthMode] = useState("signin");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    if (DEV_BYPASS) return;

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

  return {
    session,
    authLoading,
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    authMessage,
    handleAuthSubmit,
    handleSignOut,
  };
}
