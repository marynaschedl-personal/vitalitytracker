import { useState, useEffect } from "react";
import { apiClient } from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, X, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import moment from "moment";

// ─── Food catalogue ───────────────────────────────────────────────────────────
const FOOD_DATA = [
  // A – Carbs
  { id: "a1", cat: "A", name: "Whole-grain flour", kcalPer100: 240, protPer100: 8.3, maxGrams: 75, unit: "g" },
  { id: "a2", cat: "A", name: "Corn (fresh)", kcalPer100: 239, protPer100: 6.2, maxGrams: 280, unit: "g" },
  { id: "a3", cat: "A", name: "Lavash bread", kcalPer100: 240, protPer100: 8, maxGrams: 100, unit: "g" },
  { id: "a4", cat: "A", name: "Pasta", kcalPer100: 238, protPer100: 8.4, maxGrams: 70, unit: "g" },
  { id: "a5", cat: "A", name: "Brown rice", kcalPer100: 248, protPer100: 7.9, maxGrams: 75, unit: "g" },
  { id: "a6", cat: "A", name: "Whole grain bread", kcalPer100: 238, protPer100: 8.5, maxGrams: 95, unit: "g" },
  { id: "a7", cat: "A", name: "Crackers", kcalPer100: 240, protPer100: 7.9, maxGrams: 75, unit: "g" },
  // B – Protein
  { id: "b1", cat: "B", name: "Chicken / turkey fillet", kcalPer100: 402, protPer100: 80.3, maxGrams: 355, unit: "g" },
  { id: "b2", cat: "B", name: "Seafood", kcalPer100: 400, protPer100: 80, maxGrams: 400, unit: "g" },
  { id: "b3", cat: "B", name: "Liver", kcalPer100: 403, protPer100: 53.3, maxGrams: 310, unit: "g" },
  { id: "b4", cat: "B", name: "Fish (>5% fat)", kcalPer100: 400, protPer100: 42.3, maxGrams: 235, unit: "g" },
  { id: "b5", cat: "B", name: "Fish (<5% fat)", kcalPer100: 403, protPer100: 73, maxGrams: 365, unit: "g" },
  { id: "b6", cat: "B", name: "Veal", kcalPer100: 400, protPer100: 47, maxGrams: 235, unit: "g" },
  { id: "b7", cat: "B", name: "Eggs (whole)", kcalPer100: 313, protPer100: 25.1, maxGrams: 4, unit: "pcs" },
  // V – Vegetables
  { id: "v1", cat: "V", name: "Mushrooms", kcalPer100: 120, protPer100: 21, maxGrams: 600, unit: "g" },
  { id: "v2", cat: "V", name: "Fresh vegetables & greens", kcalPer100: 120, protPer100: 9, maxGrams: 600, unit: "g" },
  // G – Fats / condiments
  { id: "g1", cat: "G", name: "Avocado", kcalPer100: 128, protPer100: 1.6, maxGrams: 80, unit: "g" },
  { id: "g2", cat: "G", name: "Any oil (recommend flaxseed)", kcalPer100: 135, protPer100: 0, maxGrams: 15, unit: "g" },
  { id: "g3", cat: "G", name: "Mustard", kcalPer100: 127, protPer100: 1.1, maxGrams: 110, unit: "g" },
  { id: "g4", cat: "G", name: "Ketchup", kcalPer100: 133, protPer100: 1.3, maxGrams: 130, unit: "g" },
  { id: "g5", cat: "G", name: "Mayonnaise", kcalPer100: 120, protPer100: 0.3, maxGrams: 20, unit: "g" },
  { id: "g6", cat: "G", name: "Garnish/sauce", kcalPer100: 65, protPer100: 3.6, maxGrams: 100, unit: "g" },
  // D – Dairy
  { id: "d1", cat: "D", name: "Kefir 1%", kcalPer100: 151, protPer100: 10.3, maxGrams: 240, unit: "g" },
  { id: "d2", cat: "D", name: "Milk 1%", kcalPer100: 156, protPer100: 10.4, maxGrams: 340, unit: "g" },
  { id: "d3", cat: "D", name: "Unsweetened yogurt 1%", kcalPer100: 155, protPer100: 10.9, maxGrams: 340, unit: "g" },
  { id: "d4", cat: "D", name: "Cottage cheese (0.2%)", kcalPer100: 168, protPer100: 23, maxGrams: 210, unit: "g" },
  { id: "d5", cat: "D", name: "Melted cheese curds", kcalPer100: 175, protPer100: 10, maxGrams: 50, unit: "g" },
  { id: "d6", cat: "D", name: "Sour cream 15%", kcalPer100: 198, protPer100: 8.4, maxGrams: 105, unit: "g" },
  // E – Fruits (high sugar)
  { id: "e1", cat: "E", name: "Bananas, grapes, persimmon", kcalPer100: 200, protPer100: 2.1, maxGrams: 210, unit: "g" },
  { id: "e2", cat: "E", name: "Fruits & berries", kcalPer100: 200, protPer100: 4.7, maxGrams: 400, unit: "g" },
  // N – Nuts
  { id: "n1", cat: "N", name: "Any nuts (recommend walnuts)", kcalPer100: 60, protPer100: 2.6, maxGrams: 10, unit: "g" },
  // J – Junk / anything
  { id: "j1", cat: "J", name: "Anything (sweets, snacks, sausage)", kcalPer100: 425, protPer100: 4.3, maxGrams: 85, unit: "g" },
  { id: "j2", cat: "J", name: "Beer", kcalPer100: 103, protPer100: 0, maxGrams: 240, unit: "g" },
  { id: "j3", cat: "J", name: "Dry wine", kcalPer100: 164, protPer100: 0, maxGrams: 150, unit: "g" },
  { id: "j4", cat: "J", name: "Strong alcoholic drinks", kcalPer100: 110, protPer100: 0, maxGrams: 50, unit: "g" },
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
  const { user } = useAuth();
  const [consumed, setConsumed] = useState({}); // { foodId: grams }
  const [selected, setSelected] = useState(null); // food item
  const [sliderVal, setSliderVal] = useState(0);
  const [todayReport, setTodayReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const today = moment().format("YYYY-MM-DD");
    try {
      const reports = await apiClient.entities.DailyReport.list();
      const todayReport = reports.find((r) => r.date === today);
      if (todayReport) {
        setTodayReport(todayReport);
      }
      // Reset consumed map - food selections reset daily
      setConsumed({});
    } catch (error) {
      console.error('Error loading daily report:', error);
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

    try {
      if (todayReport) {
        await apiClient.entities.DailyReport.update(todayReport.id, {
          calories_consumed: cal,
          protein_consumed: prot,
          meals_count: meals.length,
        });
      } else {
        const created = await apiClient.entities.DailyReport.create({
          date: today,
          calories_consumed: cal,
          protein_consumed: prot,
          meals_count: meals.length,
        });
        setTodayReport(created);
      }
    } catch (error) {
      console.error('Error saving nutrition data:', error);
      alert('Error saving nutrition data');
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

  // Filter foods based on search query
  const filteredFoods = FOOD_DATA.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Nutrition</h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search foods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
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
        {filteredFoods.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No foods found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredFoods.map((item) => {
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
          })
        )}
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