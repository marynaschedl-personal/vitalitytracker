import { useState, useEffect } from "react";
import { apiClient } from "@/api/apiClient";
import { useNavigate, useLocation } from "react-router-dom";
import { Tag, LogOut, Settings, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import DashboardCard from "../components/ui/DashboardCard";
import ProgressRing from "../components/ui/ProgressRing";
import MiniChart from "../components/ui/MiniChart";
import moment from "moment";

// Format number to remove unnecessary decimals
const formatNumber = (num) => {
  if (typeof num !== 'number') return num;
  // Round to 1 decimal place, then remove trailing zeros
  const rounded = Math.round(num * 10) / 10;
  return Number.isInteger(rounded) ? Math.round(rounded) : rounded;
};


export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const [todayReport, setTodayReport] = useState(null);
  const [measurements, setMeasurements] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    loadData();
  }, [location.pathname]);

  async function loadData() {
    const today = moment().format("YYYY-MM-DD");

    // Load measurements for current user via API
    let allMeasurements = [];
    try {
      allMeasurements = await apiClient.entities.Measurement.list();
    } catch (error) {
      console.error('Error loading measurements:', error);
    }

    // Load daily reports via API
    let reports = [];
    try {
      const allReports = await apiClient.entities.DailyReport.list();
      reports = allReports.filter((r) => {
        // Convert date to YYYY-MM-DD format for comparison
        const reportDate = moment(r.date).format("YYYY-MM-DD");
        return reportDate === today;
      });
      if (reports.length > 0) setTodayReport(reports[0]);
    } catch (error) {
      console.error('Error loading daily reports:', error);
    }

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
          current: Number(latest.value),
          change: prev ? Number(latest.value) - Number(prev.value) : 0,
          totalChange: Number(latest.value) - Number(first.value),
          goal: Number(latest.goal_value),
          unit: latest.unit || (type === "weight" ? "kg" : "cm"),
          history: items.map((i) => Number(i.value)),
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
    weight: t('home_current_weight'),
    chest: t('home_chest_label'),
    waist: t('home_waist_label'),
    shoulder: t('home_shoulder_label'),
    hips: t('home_hip_label'),
    thigh: t('home_thigh_label'),
  };

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{t('home_title')}</h1>
          <p className="text-xs text-muted-foreground mt-1">{t('home_subtitle')}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold active:scale-[0.95] transition-transform"
          >
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </button>
          {showLogoutMenu && (
            <div className="absolute right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-40">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
              </div>
              <button
                onClick={() => {
                  navigate("/settings");
                  setShowLogoutMenu(false);
                }}
                className="w-full px-4 py-2 flex items-center gap-2 text-foreground hover:bg-primary/10 rounded-t-lg text-sm"
              >
                <Settings className="w-4 h-4" />
                {t('home_settings')}
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 flex items-center gap-2 text-destructive hover:bg-destructive/10 rounded-b-lg text-sm border-t border-border"
              >
                <LogOut className="w-4 h-4" />
                {t('home_logout')}
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
              <p className="text-2xl font-bold">{formatNumber(report.steps || 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{t('home_steps_today')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('home_steps_goal').replace('{N}', formatNumber(report.steps_goal || 7000).toLocaleString())}</p>
            </div>
            <ProgressRing percentage={stepsPercent} size={70} label />
          </div>
        </DashboardCard>

        {/* Quick Stats Row - Nutrition and Exercises */}
        <div className="grid grid-cols-2 gap-2">
          {/* Nutrition */}
          <DashboardCard onClick={() => navigate("/racion")}>
            <div className="text-center">
              <p className="text-3xl font-bold">{formatNumber(report.calories_consumed || 0)}</p>
              <p className="text-xs text-muted-foreground">{t('home_calories')}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{t('home_calories_goal').replace('{N}', formatNumber(report.calories_goal || 1766))}</p>
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
              <p className="text-3xl font-bold">{formatNumber(report.exercises_done || 0)}</p>
              <p className="text-xs text-muted-foreground">{t('home_trainings')}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{t('home_trainings_goal').replace('{N}', formatNumber(report.exercises_goal || 3))}</p>
              <div className="mt-2 h-1 bg-secondary rounded-full">
                <div
                  className="h-1 bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(exercisePercent, 100)}%` }}
                />
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Measurements with Charts - Empty State */}
        {!weight && Object.keys(measurements).length === 0 && (
          <DashboardCard onClick={() => navigate("/measurements")}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-foreground">{t('home_empty_state_title')}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{t('home_empty_state_desc')}</p>
              </div>
              <div className="text-2xl flex-shrink-0">📈</div>
            </div>
          </DashboardCard>
        )}

        {weight && (
          <DashboardCard onClick={() => navigate("/measurements/weight")}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{formatNumber(weight.current)}</span>
                  <span className="text-sm text-muted-foreground">kg</span>
                  {weight.change !== 0 && (
                    <span className={`text-sm font-medium ${weight.change < 0 ? "text-primary" : "text-destructive"}`}>
                      {weight.change < 0 ? "↓" : "↑"} {formatNumber(Math.abs(weight.change))}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{t('home_current_weight')}</p>
                {weight.goal && <p className="text-xs text-muted-foreground">{t('home_weight_goal').replace('{N}', formatNumber(weight.goal))}</p>}
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
                    <span className="text-3xl font-bold">{formatNumber(m.current)}</span>
                    <span className="text-sm text-muted-foreground">{m.unit}</span>
                    {m.change !== 0 && (
                      <span className={`text-sm font-medium ${m.change < 0 ? "text-primary" : "text-destructive"}`}>
                        {m.change < 0 ? "↓" : "↑"} {formatNumber(Math.abs(m.change))}
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

              // Create today's report with all data via API
              const created = await apiClient.entities.DailyReport.create({
                date: today,
                steps: stepsCount,
                calories_consumed: caloriesConsumed,
                protein_consumed: proteinConsumed,
                exercises_done: exercisesDone,
                meals_count: mealsCount,
                submitted: true,
              });

              setTodayReport(created);
              alert(t('home_report_saved').replace('{date}', today));
            }}
          >
            <CheckCircle className="w-5 h-5" />
            {t('home_save_today')}
          </button>
        )}
      </div>
    </div>
  );
}
