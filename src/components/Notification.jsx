import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { classNames } from "@/lib/helpers";

const STYLES = {
  error:   { bar: "bg-rose-600 text-white",    icon: AlertTriangle },
  success: { bar: "bg-emerald-600 text-white", icon: CheckCircle2  },
  warning: { bar: "bg-amber-500 text-white",   icon: AlertTriangle },
  info:    { bar: "bg-slate-800 text-white",   icon: Info          },
};

export default function Notification({ notification, onDismiss }) {
  if (!notification?.message) return null;

  const { bar, icon: Icon } = STYLES[notification.type] ?? STYLES.info;

  return (
    <div
      className={classNames(
        "fixed bottom-6 left-1/2 z-50 flex max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3 shadow-2xl",
        bar
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <p className="text-sm font-semibold">{notification.message}</p>
      <button
        onClick={onDismiss}
        className="ml-2 rounded-full p-0.5 hover:bg-white/20"
        aria-label="Cerrar"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
