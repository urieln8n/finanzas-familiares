import { HeartHandshake, ListChecks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FaithCard() {
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

export function MiniChecklist({ paidCount }) {
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
