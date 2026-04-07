import { useState, useEffect } from "react";
import { apiClient } from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, X } from "lucide-react";
import DashboardCard from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from "recharts";
import moment from "moment";

// Seed data from screenshots
const SEED_STEPS_DATA = [
  { date: "2026-02-14", steps: 3500, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-02-19", steps: 9000, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-02-24", steps: 11000, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-03-01", steps: 8500, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-03-06", steps: 10000, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-03-11", steps: 7200, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-03-16", steps: 9500, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-03-21", steps: 6800, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-03-26", steps: 11500, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-03-31", steps: 10200, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-04-01", steps: 8900, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-04-02", steps: 12500, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-04-03", steps: 10800, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-04-04", steps: 9200, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-04-05", steps: 11800, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
  { date: "2026-04-06", steps: 12800, steps_goal: 7000, calories_goal: 1766, exercises_goal: 3 },
];

export default function Steps() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [todayReport, setTodayReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [stepsInput, setStepsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    // Load all daily reports for this user via API
    let allReports = [];
    try {
      allReports = await apiClient.entities.DailyReport.list();
    } catch (error) {
      console.error('Error loading daily reports:', error);
      allReports = [];
    }

    // Deduplicate by date - keep the latest entry for each date
    const uniqueByDate = {};
    allReports.forEach((r) => {
      if (!uniqueByDate[r.date] || new Date(r.id || 0) > new Date(uniqueByDate[r.date].id || 0)) {
        uniqueByDate[r.date] = r;
      }
    });
    const deduplicatedReports = Object.values(uniqueByDate).sort((a, b) => new Date(b.date) - new Date(a.date));

    setReports(deduplicatedReports);
    const today = moment().format("YYYY-MM-DD");
    const todayR = deduplicatedReports.find((r) => r.date === today);
    setTodayReport(todayR || null);
    setLoading(false);
  }

  async function saveSteps() {
    setSaving(true);
    setSaveError(null);
    const today = moment().format("YYYY-MM-DD");
    const steps = Number(stepsInput);

    if (!steps || isNaN(steps) || steps < 0) {
      setSaveError("Please enter a valid number of steps");
      setSaving(false);
      return;
    }

    try {
      if (todayReport) {
        console.log('Updating steps:', { id: todayReport.id, steps });
        const updated = await apiClient.entities.DailyReport.update(todayReport.id, {
          date: todayReport.date,
          steps,
          calories_consumed: todayReport.calories_consumed || 0,
          protein_consumed: todayReport.protein_consumed || 0,
          exercises_done: todayReport.exercises_done || 0,
          meals_count: todayReport.meals_count || 0,
          submitted: todayReport.submitted || false,
        });
        console.log('Updated report:', updated);
        setTodayReport(updated);
      } else {
        console.log('Creating new report with steps:', steps);
        const created = await apiClient.entities.DailyReport.create({
          date: today,
          steps,
        });
        console.log('Created report:', created);
        setTodayReport(created);
      }
      setSaving(false);
      setShowEdit(false);
      setStepsInput("");
      await loadData();
    } catch (error) {
      console.error("Error saving steps:", error);
      setSaveError(error.message || 'Failed to save steps');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const thisWeekReports = reports.filter((r) => moment(r.date).isSame(moment(), "week"));
  const weekAvg = thisWeekReports.length > 0
    ? Math.round(thisWeekReports.reduce((s, r) => s + (r.steps || 0), 0) / thisWeekReports.length)
    : 0;

  const chartData = reports.slice(0, 30).reverse().map((r) => ({
    date: moment(r.date).format("DD MMM"),
    steps: r.steps || 0,
  }));

  const stepsGoal = todayReport?.steps_goal || 7000;

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Steps</h1>
        </div>
        <button onClick={() => { setStepsInput(String(todayReport?.steps || 0)); setShowEdit(true); }} className="text-primary font-medium text-sm">
          Edit
        </button>
      </div>

      <DashboardCard className="mb-3">
        <p className="font-semibold">Weekly average</p>
        <p className="text-xs text-muted-foreground">Average steps per day this week</p>
        <p className="text-4xl font-bold mt-3">{weekAvg.toLocaleString()}</p>
      </DashboardCard>

      <DashboardCard>
        <p className="font-semibold mb-1">Daily steps</p>
        <p className="text-xs text-muted-foreground mb-4">Your steps over the past days</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} width={45} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <ReferenceLine y={stepsGoal} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
              <Bar dataKey="steps" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="bg-card border-border">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>Edit steps</DialogTitle>
            <button
              onClick={() => setShowEdit(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              disabled={saving}
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          <div className="space-y-4">
            <Input type="number" value={stepsInput} onChange={(e) => setStepsInput(e.target.value)} placeholder="Number of steps" className="bg-secondary border-border" disabled={saving} />
            {saveError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {saveError}
              </div>
            )}
            <Button onClick={saveSteps} className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}