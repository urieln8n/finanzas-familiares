import { Card, CardContent } from "@/components/ui/card";
import { tabs } from "@/data/budget";
import { classNames } from "@/lib/helpers";

export function DesktopNav({ activeTab, setActiveTab }) {
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
                  active
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
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

export function MobileTabs({ activeTab, setActiveTab }) {
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
              className={classNames(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold",
                active ? "bg-slate-950 text-white" : "text-slate-500"
              )}
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
