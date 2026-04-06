import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Scale, Ruler } from "lucide-react";
import DashboardCard from "@/components/ui/DashboardCard";

const measurementTypes = [
  { type: "weight", label: "Weight", icon: Scale },
  { type: "shoulder", label: "Shoulder circumference", icon: Ruler },
  { type: "chest", label: "Chest circumference", icon: Ruler },
  { type: "waist", label: "Waist circumference", icon: Ruler },
  { type: "hips", label: "Hip circumference", icon: Ruler },
  { type: "thigh", label: "Thigh circumference", icon: Ruler },
];

export default function Measurements() {
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Measurements</h1>
      </div>

      <div className="space-y-2">
        {measurementTypes.map(({ type, label, icon: Icon }) => (
          <DashboardCard key={type} onClick={() => navigate(`/measurements/${type}`)} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}