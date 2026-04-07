import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Scale, Ruler } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import DashboardCard from "@/components/ui/DashboardCard";

const getMeasurementTypes = (t) => [
  { type: "weight", labelKey: "measurements_weight", icon: Scale },
  { type: "shoulder", labelKey: "measurements_shoulder", icon: Ruler },
  { type: "chest", labelKey: "measurements_chest", icon: Ruler },
  { type: "waist", labelKey: "measurements_waist", icon: Ruler },
  { type: "hips", labelKey: "measurements_hip", icon: Ruler },
  { type: "thigh", labelKey: "measurements_thigh", icon: Ruler },
];

export default function Measurements() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const measurementTypes = getMeasurementTypes(t);

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">{t('measurements_title')}</h1>
      </div>

      <div className="space-y-2">
        {measurementTypes.map(({ type, labelKey, icon: Icon }) => (
          <DashboardCard key={type} onClick={() => navigate(`/measurements/${type}`)} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t(labelKey)}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}