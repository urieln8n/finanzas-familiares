import { Card, CardContent } from "@/components/ui/card";
import ExpenseForm from "@/components/ExpenseForm";
import MovementList from "@/components/MovementList";
import { categories } from "@/data/budget";

export default function MovementsView({
  form,
  setForm,
  editingId,
  saveExpense,
  resetForm,
  applyQuickExpense,
  filterCategory,
  setFilterCategory,
  filterPerson,
  setFilterPerson,
  filteredExpenses,
  deleteExpense,
  startEdit,
  isSaving,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <div className="space-y-4">
        <ExpenseForm
          form={form}
          setForm={setForm}
          editingId={editingId}
          saveExpense={saveExpense}
          resetForm={resetForm}
          applyQuickExpense={applyQuickExpense}
          isSaving={isSaving}
        />
      </div>

      <Card className="rounded-[1.75rem] border-0 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
        <CardContent className="p-5">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-black">Movimientos</h2>
              <p className="text-sm text-slate-500">Filtra por categoría o por persona.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 md:w-[360px]">
              <select
                className="input-pro"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.short}
                  </option>
                ))}
              </select>
              <select
                className="input-pro"
                value={filterPerson}
                onChange={(e) => setFilterPerson(e.target.value)}
              >
                <option value="all">Todos</option>
                <option>Ambos</option>
                <option>Andrés</option>
                <option>Esposa</option>
              </select>
            </div>
          </div>
          <MovementList
            expenses={filteredExpenses}
            emptyText="No hay movimientos con esos filtros."
            onDelete={deleteExpense}
            onEdit={startEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
