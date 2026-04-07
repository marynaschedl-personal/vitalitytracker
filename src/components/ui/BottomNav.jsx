import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Utensils, Dumbbell, Footprints, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

const getTabs = (t) => [
  { path: "/", icon: LayoutGrid, labelKey: "nav_home" },
  { path: "/racion", icon: Utensils, labelKey: "nav_nutrition" },
  { path: "/exercises", icon: Dumbbell, labelKey: "nav_workouts" },
  { path: "/steps", icon: Footprints, labelKey: "nav_steps" },
  { path: "/measurements", icon: Ruler, labelKey: "nav_measures" },
];

export default function BottomNav() {
  const location = useLocation();
  const { t } = useLanguage();
  const tabs = getTabs(t);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const isActive =
            tab.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{t(tab.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
