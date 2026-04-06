import { useState, useEffect } from "react";
import { dataService } from "@/api/dataService";
import { useNavigate } from "react-router-dom";
import { Tag, LogOut, Settings, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import DashboardCard from "../components/ui/DashboardCard";
import ProgressRing from "../components/ui/ProgressRing";
import MiniChart from "../components/ui/MiniChart";
import moment from "moment";

// Seed data from screenshots
const SEED_MEASUREMENTS = [
  // Weight data
  { type: "weight", date: "2026-03-07", value: 67, goal_value: 60, unit: "kg" },
  { type: "weight", date: "2026-03-13", value: 66.5, goal_value: 60, unit: "kg" },
  { type: "weight", date: "2026-03-20", value: 66, goal_value: 60, unit: "kg" },
  { type: "weight", date: "2026-03-31", value: 65.5, goal_value: 60, unit: "kg" },
  { type: "weight", date: "2026-04-06", value: 65, goal_value: 60, unit: "kg" },
  // Chest data
  { type: "chest", date: "2026-03-07", value: 89, unit: "cm" },
  { type: "chest", date: "2026-03-13", value: 85, unit: "cm" },
  { type: "chest", date: "2026-03-20", value: 82, unit: "cm" },
  { type: "chest", date: "2026-03-31", value: 79, unit: "cm" },
  { type: "chest", date: "2026-04-06", value: 78, unit: "cm" },
  // Waist data
  { type: "waist", date: "2026-03-07", value: 80, unit: "cm" },
  { type: "waist", date: "2026-03-18", value: 73, unit: "cm" },
  { type: "waist", date: "2026-03-31", value: 68, unit: "cm" },
  { type: "waist", date: "2026-04-06", value: 68, unit: "cm" },
  // Shoulder data
  { type: "shoulder", date: "2026-03-07", value: 33, unit: "cm" },
  { type: "shoulder", date: "2026-03-13", value: 31, unit: "cm" },
  { type: "shoulder", date: "2026-03-20", value: 30, unit: "cm" },
  { type: "shoulder", date: "2026-03-31", value: 28, unit: "cm" },
  { type: "shoulder", date: "2026-04-06", value: 27, unit: "cm" },
  // Hips data
  { type: "hips", date: "2026-03-07", value: 62, unit: "cm" },
  { type: "hips", date: "2026-03-13", value: 59, unit: "cm" },
  { type: "hips", date: "2026-03-20", value: 57, unit: "cm" },
  { type: "hips", date: "2026-03-31", value: 51, unit: "cm" },
  { type: "hips", date: "2026-04-06", value: 50, unit: "cm" },
  // Thigh data
  { type: "thigh", date: "2026-03-07", value: 96, unit: "cm" },
  { type: "thigh", date: "2026-03-13", value: 94, unit: "cm" },
  { type: "thigh", date: "2026-03-20", value: 92, unit: "cm" },
  { type: "thigh", date: "2026-03-31", value: 90, unit: "cm" },
  { type: "thigh", date: "2026-04-06", value: 89, unit: "cm" },
];

export default function Home() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [todayReport, setTodayReport] = useState(null);
  const [measurements, setMeasurements] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const today = moment().format("YYYY-MM-DD");

    // Load measurements for current user - only seed if none exist
    let allMeasurements = await dataService.entities.Measurement.filter({ user_id: user.id });
    if (allMeasurements.length === 0) {
      await Promise.all(
        SEED_MEASUREMENTS.map((m) => dataService.entities.Measurement.create({ ...m, user_id: user.id }))
      );
      allMeasurements = await dataService.entities.Measurement.filter({ user_id: user.id });
    }

    const [reports] = await Promise.all([
      dataService.entities.DailyReport.filter({ date: today, user_id: user.id }),
    ]);
    if (reports.length > 0) setTodayReport(reports[0]);

    const grouped = {};
    ["weight", "shoulder", "chest", "waist", "hips", "thigh"].forEach((type) => {
      const items = allMeasurements
        .filter((m) => m.type === type)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      if (items.length > 0) {
        const latest = items[items.length - 1];
        const prev = items.length > 1 ? items[items.length - 2] : null;
        const first = items[0];
        grouped[type] = {
          current: latest.value,
          change: prev ? latest.value - prev.value : 0,
          totalChange: latest.value - first.value,
          goal: latest.goal_value,
          unit: latest.unit || (type === "weight" ? "kg" : "cm"),
          history: items.map((i) => i.value),
        };
      }
    });
    setMeasurements(grouped);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const report = todayReport || {};
  const mealsConsumed = report.meals_count || 0;
  const caloriePercent = report.calories_goal ? Math.round((report.calories_consumed / report.calories_goal) * 100) : 0;
  const stepsPercent = report.steps_goal ? Math.round((report.steps / report.steps_goal) * 100) : 0;
  const exercisePercent = report.exercises_goal ? Math.round((report.exercises_done / report.exercises_goal) * 100) : 0;

  const weight = measurements.weight;
  const typeLabels = {
    weight: "current weight",
    chest: "chest circumference",
    waist: "waist circumference",
    shoulder: "shoulder circumference",
    hips: "hip circumference",
    thigh: "thigh circumference",
  };

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Home</h1>
        <div className="relative">
          <button
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold active:scale-[0.95] transition-transform"
          >
            M
          </button>
          {showLogoutMenu && (
            <div className="absolute right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-40">
              <button
                onClick={() => {
                  navigate("/settings");
                  setShowLogoutMenu(false);
                }}
                className="w-full px-4 py-2 flex items-center gap-2 text-foreground hover:bg-primary/10 rounded-t-lg text-sm"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 flex items-center gap-2 text-destructive hover:bg-destructive/10 rounded-b-lg text-sm border-t border-border"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Steps Widget at Top */}
        <DashboardCard onClick={() => navigate("/steps")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{(report.steps || 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Steps today</p>
              <p className="text-xs text-muted-foreground mt-0.5">Goal: {(report.steps_goal || 7000).toLocaleString()} steps</p>
            </div>
            <ProgressRing percentage={stepsPercent} size={70} label />
          </div>
        </DashboardCard>

        {/* Quick Stats Row - Nutrition and Exercises */}
        <div className="grid grid-cols-2 gap-2">
          {/* Nutrition */}
          <DashboardCard onClick={() => navigate("/racion")}>
            <div className="text-center">
              <p className="text-3xl font-bold">{report.calories_consumed || 0}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
              <p className="text-[10px] text-muted-foreground mt-1">Goal: {report.calories_goal || 1766}</p>
              <div className="mt-2 h-1 bg-secondary rounded-full">
                <div
                  className="h-1 bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(caloriePercent, 100)}%` }}
                />
              </div>
            </div>
          </DashboardCard>

          {/* Exercises/Trainings */}
          <DashboardCard onClick={() => navigate("/exercises")}>
            <div className="text-center">
              <p className="text-3xl font-bold">{report.exercises_done || 0}</p>
              <p className="text-xs text-muted-foreground">Trainings</p>
              <p className="text-[10px] text-muted-foreground mt-1">Goal: {report.exercises_goal || 3}</p>
              <div className="mt-2 h-1 bg-secondary rounded-full">
                <div
                  className="h-1 bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(exercisePercent, 100)}%` }}
                />
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Measurements with Charts */}
        {weight && (
          <DashboardCard onClick={() => navigate("/measurements/weight")}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{weight.current}</span>
                  <span className="text-sm text-muted-foreground">kg</span>
                  {weight.change !== 0 && (
                    <span className={`text-sm font-medium ${weight.change < 0 ? "text-primary" : "text-destructive"}`}>
                      {weight.change < 0 ? "↓" : "↑"} {Math.abs(weight.change.toFixed(1))}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">current weight</p>
                {weight.goal && <p className="text-xs text-muted-foreground">Goal: {weight.goal} kg</p>}
              </div>
              <MiniChart data={weight.history} />
            </div>
          </DashboardCard>
        )}

        {/* Body measurements */}
        {["chest", "waist", "shoulder", "hips", "thigh"].map((type) => {
          const m = measurements[type];
          if (!m) return null;
          return (
            <DashboardCard key={type} onClick={() => navigate(`/measurements/${type}`)}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-3xl font-bold">{m.current}</span>
                    <span className="text-sm text-muted-foreground">{m.unit}</span>
                    {m.change !== 0 && (
                      <span className={`text-sm font-medium ${m.change < 0 ? "text-primary" : "text-destructive"}`}>
                        {m.change < 0 ? "↓" : "↑"} {Math.abs(m.change)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{typeLabels[type]}</p>
                </div>
                <MiniChart data={m.history} />
              </div>
            </DashboardCard>
          );
        })}


        {!todayReport?.submitted && (
          <button
            className="w-full py-3 bg-primary rounded-2xl text-primary-foreground font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            onClick={async () => {
              const today = moment().format("YYYY-MM-DD");

              // Gather all data for today
              const caloriesConsumed = report.calories_consumed || 0;
              const proteinConsumed = report.protein_consumed || 0;
              const stepsCount = report.steps || 0;
              const exercisesDone = report.exercises_done || 0;
              const mealsCount = report.meals_count || 0;

              // Create today's report with all data
              const created = await dataService.entities.DailyReport.create({
                user_id: user.id,
                date: today,
                steps: stepsCount,
                calories_consumed: caloriesConsumed,
                protein_consumed: proteinConsumed,
                exercises_done: exercisesDone,
                meals_count: mealsCount,
                calories_goal: 1766,
                steps_goal: 7000,
                exercises_goal: 3,
                submitted: true,
              });

              setTodayReport(created);
              alert("✓ Report saved for " + today);
            }}
          >
            <CheckCircle className="w-5 h-5" />
            Save today
          </button>
        )}
      </div>
    </div>
  );
}
