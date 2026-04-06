import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import moment from "moment";

// ─── Food catalogue ───────────────────────────────────────────────────────────
const FOOD_DATA = [
  // A – Carbs
  { id: "a1", cat: "A", name: "Whole-grain flour", kcalPer100: 240, protPer100: 8.3, maxGrams: 75, unit: "g" },
  // B – Protein
  { id: "b1", cat: "B", name: "Chicken / turkey fillet", kcalPer100: 102, protPer100: 20.5, maxGrams: 93, unit: "g" },
  { id: "b2", cat: "B", name: "Seafood", kcalPer100: 102, protPer100: 20.4, maxGrams: 102, unit: "g" },
  { id: "b3", cat: "B", name: "Liver", kcalPer100: 103, protPer100: 14.2, maxGrams: 79, unit: "g" },
  { id: "b4", cat: "B", name: "Fish (>5% fat)", kcalPer100: 100, protPer100: 10.6, maxGrams: 59, unit: "g" },
  { id: "b5", cat: "B", name: "Fish (<5% fat)", kcalPer100: 102, protPer100: 18.6, maxGrams: 93, unit: "g" },
  { id: "b6", cat: "B", name: "Veal", kcalPer100: 170, protPer100: 20, maxGrams: 235, unit: "g" },
  { id: "b7", cat: "B", name: "Eggs (whole)", kcalPer100: 79, protPer100: 6.3, maxGrams: 60, unit: "pcs", pcsPerGram: 1/60 },
  // V – Vegetables
  { id: "v1", cat: "V", name: "Mushrooms", kcalPer100: 56, protPer100: 9.8, maxGrams: 279, unit: "g" },
  { id: "v2", cat: "V", name: "Vegetables (pickled, fermented, greens)", kcalPer100: 20, protPer100: 1.5, maxGrams: 600, unit: "g" },
  // G – Fats / condiments
  { id: "g1", cat: "G", name: "Avocado", kcalPer100: 160, protPer100: 2, maxGrams: 16, unit: "g" },
  { id: "g2", cat: "G", name: "Any oil (recommend flaxseed)", kcalPer100: 900, protPer100: 0, maxGrams: 15, unit: "g" },
  { id: "g3", cat: "G", name: "Mustard", kcalPer100: 65, protPer100: 5, maxGrams: 20, unit: "g" },
  { id: "g4", cat: "G", name: "Ketchup", kcalPer100: 100, protPer100: 1.2, maxGrams: 26, unit: "g" },
  { id: "g5", cat: "G", name: "Mayonnaise", kcalPer100: 600, protPer100: 0, maxGrams: 4, unit: "g" },
  { id: "g6", cat: "G", name: "Olives", kcalPer100: 114, protPer100: 0.9, maxGrams: 22, unit: "g" },
  // D – Dairy
  { id: "d1", cat: "D", name: "Non-sweet yogurt 1% fat", kcalPer100: 101, protPer100: 7.1, maxGrams: 223, unit: "g" },
  { id: "d2", cat: "D", name: "Low-fat cottage cheese (0.2%)", kcalPer100: 58, protPer100: 13, maxGrams: 72, unit: "g" },
  // E – Fruits (high sugar)
  { id: "e1", cat: "E", name: "Bananas, grapes, persimmon", kcalPer100: 95, protPer100: 1.0, maxGrams: 126, unit: "g" },
  { id: "e2", cat: "E", name: "Fruits & berries", kcalPer100: 50, protPer100: 1.0, maxGrams: 308, unit: "g" },
  // N – Nuts
  { id: "n1", cat: "N", name: "Any nuts (recommend walnuts)", kcalPer100: 600, protPer100: 20, maxGrams: 10, unit: "g" },
  // J – Junk / anything
  { id: "j1", cat: "J", name: "Anything (sweets, snacks, sausage…)", kcalPer100: 500, protPer100: 5, maxGrams: 85, unit: "g" },
];

const CAT_COLORS = {
  A: "bg-blue-500",
  B: "bg-red-500",
  V: "bg-yellow-600",
  G: "bg-yellow-400",
  D: "bg-purple-500",
  E: "bg-amber-600",
  N: "bg-green-600",
  J: "bg-teal-500",
};

function calcKcal(item, grams) {
  return Math.round((item.kcalPer100 * grams) / 100);
}
function calcProt(item, grams) {
  return +((item.protPer100 * grams) / 100).toFixed(1);
}

export default function Racion() {
  const navigate = useNavigate();
  const [consumed, setConsumed] = useState({}); // { foodId: grams }
  const [selected, setSelected] = useState(null); // food item
  const [sliderVal, setSliderVal] = useState(0);
  const [todayReport, setTodayReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const today = moment().format("YYYY-MM-DD");
    const reports = await base44.entities.DailyReport.filter({ date: today });
    if (reports.length > 0) {
      setTodayReport(reports[0]);
      // Reset consumed map - food selections reset daily
      setConsumed({});
    }
    setLoading(false);
  }

  // ── Category stats ──────────────────────────────────────────────────────────
  function getCatStats(cat) {
    const items = FOOD_DATA.filter((f) => f.cat === cat);
    const totalOriginal = items.reduce((s, f) => s + f.maxGrams, 0);
    const totalConsumed = items.reduce((s, f) => s + (consumed[f.id] || 0), 0);
    const fraction = totalOriginal > 0 ? totalConsumed / totalOriginal : 0;
    return { fraction, totalConsumed, totalOriginal };
  }

  function getAdjustedMax(item) {
    const { fraction } = getCatStats(item.cat);
    const myConsumed = consumed[item.id] || 0;
    const remaining = item.maxGrams - myConsumed;
    const catRemaining = Math.max(0, 1 - fraction);
    // adjusted = original * remaining fraction
    return Math.max(0, Math.round(item.maxGrams * catRemaining));
  }

  function isCategoryFull(cat) {
    const { fraction } = getCatStats(cat);
    return fraction >= 1.0;
  }

  function isItemFull(item) {
    return (consumed[item.id] || 0) >= item.maxGrams;
  }

  // If a different item in same category is 100% full → hide other items
  function isHiddenByCategory(item) {
    if (isCategoryFull(item.cat)) return true;
    const siblings = FOOD_DATA.filter((f) => f.cat === item.cat && f.id !== item.id);
    return siblings.some((s) => isItemFull(s));
  }

  // ── Totals ──────────────────────────────────────────────────────────────────
  const totalKcal = FOOD_DATA.reduce((s, f) => s + calcKcal(f, consumed[f.id] || 0), 0);
  const totalProt = FOOD_DATA.reduce((s, f) => s + calcProt(f, consumed[f.id] || 0), 0);
  const kcalGoal = todayReport?.calories_goal || 1766;

  // ── Save ────────────────────────────────────────────────────────────────────
  async function saveConsumed(newConsumed) {
    const today = moment().format("YYYY-MM-DD");
    const meals = Object.entries(newConsumed)
      .filter(([, g]) => g > 0)
      .map(([foodId, g]) => {
        const item = FOOD_DATA.find((f) => f.id === foodId);
        return {
          foodId,
          name: item.name,
          calories: calcKcal(item, g),
          protein: calcProt(item, g),
          consumed_grams: g,
          target_grams: item.maxGrams,
          category: item.cat,
        };
      });
    const cal = meals.reduce((s, m) => s + m.calories, 0);
    const prot = meals.reduce((s, m) => s + m.protein, 0);

    if (todayReport) {
      await base44.entities.DailyReport.update(todayReport.id, {
        calories_consumed: cal,
        protein_consumed: prot,
        meals_count: meals.length,
      });
    } else {
      const created = await base44.entities.DailyReport.create({
        date: today,
        calories_consumed: cal,
        protein_consumed: prot,
        meals_count: meals.length,
        calories_goal: 1766,
        steps_goal: 7000,
        exercises_goal: 3,
      });
      setTodayReport(created);
    }
  }

  // ── Dialog confirm ──────────────────────────────────────────────────────────
  function openItem(item) {
    if (isHiddenByCategory(item) && !isItemFull(item) && (consumed[item.id] || 0) === 0) return;
    setSelected(item);
    setSliderVal(consumed[item.id] || 0);
  }

  async function confirmItem() {
    const newConsumed = { ...consumed, [selected.id]: sliderVal };
    setConsumed(newConsumed);
    setSelected(null);
    await saveConsumed(newConsumed);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const selectedMax = selected ? getAdjustedMax(selected) : 0;
  const selectedKcal = selected ? calcKcal(selected, sliderVal) : 0;
  const selectedProt = selected ? calcProt(selected, sliderVal) : 0;
  const catStats = selected ? getCatStats(selected.cat) : null;

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Nutrition</h1>
      </div>

      {/* Summary */}
      <div className="text-center mb-6">
        <p className="text-4xl font-bold">{totalProt.toFixed(0)} g</p>
        <p className="text-sm text-muted-foreground">protein</p>
        <div className="flex items-center justify-between mt-4 mb-1">
          <span className="text-sm text-muted-foreground">Calories</span>
          <span className="text-sm text-muted-foreground">{totalKcal} / {kcalGoal} kcal</span>
        </div>
        <div className="h-2 bg-secondary rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all"
            style={{ width: `${Math.min((totalKcal / kcalGoal) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Food list */}
      <div className="space-y-2">
        {FOOD_DATA.map((item) => {
          const eaten = consumed[item.id] || 0;
          const full = isItemFull(item);
          const hidden = !full && isHiddenByCategory(item) && eaten === 0;
          if (hidden) return null;

          const adjMax = getAdjustedMax(item);
          const displayMax = full ? item.maxGrams : adjMax;
          const displayConsumed = item.unit === "pcs" ? `${(eaten / 60).toFixed(0)} pcs` : `${eaten} / ${displayMax} g`;

          return (
            <div
              key={item.id}
              onClick={() => openItem(item)}
              className={`rounded-xl p-4 cursor-pointer transition-all active:scale-[0.98] ${
                full || eaten > 0 ? "bg-green-900/40 border border-green-700/50" : "bg-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full ${CAT_COLORS[item.cat]} flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5`}>
                    {item.cat}
                  </div>
                  <div>
                    <p className="font-medium text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {calcKcal(item, 100)} kcal • {item.protPer100}g protein
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap ml-2">
                  {displayConsumed}
                </span>
              </div>
              {eaten > 0 && (
                <div className="mt-2 h-1 bg-secondary rounded-full">
                  <div
                    className="h-1 bg-primary rounded-full"
                    style={{ width: `${Math.min((eaten / item.maxGrams) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Food dialog */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="bg-card border-border">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle>{selected.name}</DialogTitle>
              <button
                onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Original recommendation: {selected.maxGrams} g</p>
                <p className="text-primary font-semibold">
                  Recommended portion: {selectedMax} g
                </p>
                <p className="text-xs text-muted-foreground">
                  ({calcKcal(selected, selectedMax)} kcal out of {calcKcal(selected, selected.maxGrams)} kcal)
                </p>
              </div>

              {/* Category progress */}
              <div className="bg-secondary rounded-lg px-3 py-2 text-center text-xs text-muted-foreground">
                Consumed in category: {Math.round(catStats.fraction * 100)}% / 100%
              </div>

              {/* Slider and Input */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Amount (grams): {sliderVal}</span>
                  <span>(max {selectedMax}g)</span>
                </div>
                <Slider
                  value={[sliderVal]}
                  min={0}
                  max={Math.max(selectedMax, sliderVal)}
                  step={1}
                  onValueChange={([v]) => setSliderVal(v)}
                  className="my-2"
                />
                <div className="mt-3">
                  <label className="block text-xs text-muted-foreground mb-1">Enter grams:</label>
                  <Input
                    type="number"
                    min="0"
                    max={Math.max(selectedMax, sliderVal)}
                    value={sliderVal}
                    onChange={(e) => {
                      const val = Math.min(Math.max(0, Number(e.target.value) || 0), Math.max(selectedMax, sliderVal));
                      setSliderVal(val);
                    }}
                    placeholder="0"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  <span className="text-center">
                    <p className="text-xl font-bold">{selectedKcal}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </span>
                  <span className="text-center">
                    <p className="text-xl font-bold">{selectedProt}g</p>
                    <p className="text-xs text-muted-foreground">protein</p>
                  </span>
                </div>
              </div>

              {/* Quick % buttons */}
              <div className="flex gap-2">
                {[25, 50, 75, 100].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSliderVal(Math.round(selectedMax * p / 100))}
                    className="flex-1 py-1.5 bg-secondary rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                  >
                    {p}%
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-border" onClick={() => setSelected(null)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={confirmItem}>
                  Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}