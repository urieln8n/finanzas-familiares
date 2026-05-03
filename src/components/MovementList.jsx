import { Pencil, Trash2 } from "lucide-react";
import { categories, currency } from "@/data/budget";
import { classNames } from "@/lib/helpers";

export default function MovementList({ expenses, emptyText, onDelete, onEdit, compact = false }) {
  if (!expenses.length) {
    return (
      <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm font-medium text-slate-500 ring-1 ring-slate-100">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => {
        const category = categories.find((item) => item.id === expense.categoryId) || categories[0];
        const Icon = category.icon;
        return (
          <div
            key={expense.id}
            className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100 transition hover:bg-white hover:shadow-sm"
          >
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
                <button
                  onClick={() => onEdit(expense)}
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
              {!compact && onDelete && (
                <button
                  onClick={() => onDelete(expense.id)}
                  className="rounded-full p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                >
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
