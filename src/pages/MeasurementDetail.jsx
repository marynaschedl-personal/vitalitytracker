import { useState, useEffect } from "react";
import { apiClient } from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, X } from "lucide-react";
import DashboardCard from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import moment from "moment";

const typeLabels = {
  weight: "Weight",
  shoulder: "Shoulder circumference",
  chest: "Chest circumference",
  waist: "Waist circumference",
  hips: "Hip circumference",
  thigh: "Thigh circumference",
};

const typeUnits = {
  weight: "kg",
  shoulder: "cm",
  chest: "cm",
  waist: "cm",
  hips: "cm",
  thigh: "cm",
};

// Seed data from screenshots - Real user data
const SEED_DATA = {
  weight: [
    { date: "2026-03-07", value: 67, goal_value: 60, unit: "kg" },
    { date: "2026-03-13", value: 66.5, goal_value: 60, unit: "kg" },
    { date: "2026-03-20", value: 66, goal_value: 60, unit: "kg" },
    { date: "2026-03-31", value: 65.5, goal_value: 60, unit: "kg" },
    { date: "2026-04-06", value: 65, goal_value: 60, unit: "kg" },
  ],
  shoulder: [
    { date: "2026-03-07", value: 33, unit: "cm" },
    { date: "2026-03-13", value: 31, unit: "cm" },
    { date: "2026-03-20", value: 30, unit: "cm" },
    { date: "2026-03-31", value: 28, unit: "cm" },
    { date: "2026-04-06", value: 27, unit: "cm" },
  ],
  chest: [
    { date: "2026-03-07", value: 89, unit: "cm" },
    { date: "2026-03-13", value: 85, unit: "cm" },
    { date: "2026-03-20", value: 82, unit: "cm" },
    { date: "2026-03-31", value: 79, unit: "cm" },
    { date: "2026-04-06", value: 78, unit: "cm" },
  ],
  waist: [
    { date: "2026-03-07", value: 80, unit: "cm" },
    { date: "2026-03-18", value: 73, unit: "cm" },
    { date: "2026-03-31", value: 68, unit: "cm" },
    { date: "2026-04-06", value: 68, unit: "cm" },
  ],
  hips: [
    { date: "2026-03-07", value: 62, unit: "cm" },
    { date: "2026-03-13", value: 59, unit: "cm" },
    { date: "2026-03-20", value: 57, unit: "cm" },
    { date: "2026-03-31", value: 51, unit: "cm" },
    { date: "2026-04-06", value: 50, unit: "cm" },
  ],
  thigh: [
    { date: "2026-03-07", value: 96, unit: "cm" },
    { date: "2026-03-13", value: 94, unit: "cm" },
    { date: "2026-03-20", value: 92, unit: "cm" },
    { date: "2026-03-31", value: 90, unit: "cm" },
    { date: "2026-04-06", value: 89, unit: "cm" },
  ],
};

export default function MeasurementDetail() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [valueInput, setValueInput] = useState("");
  const [goalInput, setGoalInput] = useState("");

  useEffect(() => { loadAndSeed(); }, [type]);

  async function loadAndSeed() {
    setLoading(true);
    loadData();
  }

  async function loadData() {
    try {
      const all = await apiClient.entities.Measurement.list();
      // Filter by type on frontend since API returns all measurements
      const filtered = all.filter((m) => m.type === type);
      setMeasurements(filtered.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (error) {
      console.error('Error loading measurements:', error);
      setMeasurements([]);
    }
    setLoading(false);
  }

  async function addMeasurement() {
    const value = Number(valueInput);
    if (!value) return;
    try {
      await apiClient.entities.Measurement.create({
        type,
        value,
        unit: typeUnits[type],
        date: moment().format("YYYY-MM-DD"),
        goal_value: goalInput ? Number(goalInput) : undefined,
      });
      setShowEdit(false);
      setValueInput("");
      setGoalInput("");
      await loadData();
    } catch (error) {
      console.error('Error adding measurement:', error);
      alert('Error adding measurement');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const unit = typeUnits[type] || "cm";
  const label = typeLabels[type] || type;
  const latest = measurements.length > 0 ? measurements[measurements.length - 1] : null;
  const first = measurements.length > 0 ? measurements[0] : null;
  const totalChange = latest && first ? latest.value - first.value : 0;
  const avgChange = measurements.length > 1 ? totalChange / (measurements.length - 1) : 0;

  const chartData = measurements.map((m) => ({
    date: moment(m.date).format("DD MMM"),
    value: m.value,
  }));

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/measurements")} className="text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">{label}</h1>
        </div>
        <button onClick={() => { setValueInput(""); setGoalInput(latest?.goal_value ? String(latest.goal_value) : ""); setShowEdit(true); }} className="text-primary font-medium text-sm">
          Edit
        </button>
      </div>

      {latest ? (
        <div className="space-y-3">
          <DashboardCard>
            <p className="font-semibold">Total change</p>
            <p className="text-xs text-muted-foreground">Change since first measurement</p>
            <p className="text-4xl font-bold mt-3">{totalChange > 0 ? "+" : ""}{totalChange.toFixed(1)} {unit}</p>
            <p className="text-sm text-muted-foreground mt-1">From {first.value} {unit} to {latest.value} {unit}</p>
            {latest.goal_value && <p className="text-sm text-muted-foreground">Goal: {latest.goal_value} {unit}</p>}
          </DashboardCard>

          <DashboardCard>
            <p className="font-semibold">Average change</p>
            <p className="text-xs text-muted-foreground">Average change per measurement</p>
            <p className="text-4xl font-bold mt-3">{avgChange > 0 ? "+" : ""}{avgChange.toFixed(1)} {unit}</p>
            <p className="text-sm text-muted-foreground mt-1">per measurement</p>
          </DashboardCard>

          <DashboardCard>
            <p className="font-semibold">{label} history</p>
            <p className="text-xs text-muted-foreground mb-4">Your measurements over time</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} width={45} domain={["dataMin - 2", "dataMax + 2"]} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                    formatter={(v) => [`${v} ${unit}`, label]}
                  />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--foreground))" strokeWidth={2} dot={{ fill: "hsl(var(--foreground))", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
      ) : (
        <DashboardCard className="text-center py-12">
          <p className="text-muted-foreground">No measurements yet</p>
          <Button className="mt-4" onClick={() => setShowEdit(true)}>Add first measurement</Button>
        </DashboardCard>
      )}

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="bg-card border-border">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>Add measurement</DialogTitle>
            <button
              onClick={() => setShowEdit(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Value ({unit})</Label>
              <Input type="number" value={valueInput} onChange={(e) => setValueInput(e.target.value)} placeholder={`Enter value in ${unit}`} className="bg-secondary border-border" />
            </div>
            <div>
              <Label>Goal ({unit}) — optional</Label>
              <Input type="number" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} placeholder="Target value" className="bg-secondary border-border" />
            </div>
            <Button onClick={addMeasurement} className="w-full" disabled={!valueInput}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}