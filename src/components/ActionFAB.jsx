import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { Plus, Utensils, Ruler, Footprints, Dumbbell } from "lucide-react";

export default function ActionFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const actions = [
    { label: t('fab_add_food'), icon: Utensils, path: '/racion', color: 'bg-blue-500' },
    { label: t('fab_measurement'), icon: Ruler, path: '/measurements', color: 'bg-yellow-500' },
    { label: t('fab_steps'), icon: Footprints, path: '/steps', color: 'bg-green-500' },
    { label: t('fab_training'), icon: Dumbbell, path: '/exercises', color: 'bg-red-500' },
  ];

  const handleActionClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 active:scale-95 transition-all z-40"
        title="Quick actions"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Expandable action items */}
      {isOpen && (
        <>
          {/* Backdrop - click to close */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Action buttons stack upward */}
          <div className="fixed bottom-40 right-6 flex flex-col gap-3 z-40">
            {actions.map((action, index) => {
              const Icon = action.icon;
              const delay = index * 50;
              return (
                <button
                  key={action.path}
                  onClick={() => handleActionClick(action.path)}
                  style={{
                    animation: `slideUp 0.3s ease-out ${delay}ms backwards`,
                  }}
                  className="flex items-center gap-3 bg-card border border-border rounded-full px-4 py-3 shadow-lg hover:shadow-xl hover:bg-muted active:scale-95 transition-all whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* CSS animation */}
          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </>
      )}
    </>
  );
}
