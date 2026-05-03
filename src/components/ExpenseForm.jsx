import { Plus, Pencil, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categories, quickExpenses } from "@/data/budget";
import FieldLabel from "@/components/FieldLabel";

export default function ExpenseForm({ form, setForm, editingId, saveExpense, resetForm, applyQuickExpense, isSaving = false }) {
  return (
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
            <button
              key={item.label}
              onClick={() => applyQuickExpense(item)}
              className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200"
            >
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
              <input
                className="input-pro"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </FieldLabel>
          </div>

          <FieldLabel label="Categoría">
            <select
              className="input-pro"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FieldLabel>

          <FieldLabel label="Quién lo registró">
            <select
              className="input-pro"
              value={form.person}
              onChange={(e) => setForm({ ...form, person: e.target.value })}
            >
              <option>Ambos</option>
              <option>Andrés</option>
              <option>Esposa</option>
            </select>
          </FieldLabel>

          <Button
            onClick={saveExpense}
            disabled={isSaving}
            className="w-full rounded-2xl bg-slate-950 py-6 text-base font-black hover:bg-slate-800 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white inline-block" />
                Guardando...
              </>
            ) : (
              <>
                {editingId ? <Pencil className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingId ? "Guardar cambios" : "Añadir gasto"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
