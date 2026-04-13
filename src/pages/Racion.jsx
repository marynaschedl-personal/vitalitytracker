import { useState, useEffect } from "react";
import { apiClient } from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { ArrowLeft, X, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import moment from "moment";

// ─── Food catalogue ───────────────────────────────────────────────────────────
const FOOD_DATA = [
  // A – Carbs
  { id: "a1", cat: "A", nameKey: "food_whole_grain_flour", kcalPer100: 240, protPer100: 8.3, maxGrams: 75, unit: "g" },
  { id: "a2", cat: "A", nameKey: "food_corn_fresh", kcalPer100: 239, protPer100: 6.2, maxGrams: 280, unit: "g" },
  { id: "a3", cat: "A", nameKey: "food_lavash_bread", kcalPer100: 240, protPer100: 8, maxGrams: 100, unit: "g" },
  { id: "a4", cat: "A", nameKey: "food_pasta", kcalPer100: 238, protPer100: 8.4, maxGrams: 70, unit: "g" },
  { id: "a5", cat: "A", nameKey: "food_brown_rice", kcalPer100: 248, protPer100: 7.9, maxGrams: 75, unit: "g" },
  { id: "a6", cat: "A", nameKey: "food_whole_grain_bread", kcalPer100: 238, protPer100: 8.5, maxGrams: 95, unit: "g" },
  { id: "a7", cat: "A", nameKey: "food_crackers", kcalPer100: 240, protPer100: 7.9, maxGrams: 75, unit: "g" },
  { id: "a8", cat: "A", nameKey: "food_potatoes", kcalPer100: 238, protPer100: 6.2, maxGrams: 310, unit: "g" },
  // B – Protein
  { id: "b1", cat: "B", nameKey: "food_chicken_turkey", kcalPer100: 402, protPer100: 80.3, maxGrams: 355, unit: "g" },
  { id: "b2", cat: "B", nameKey: "food_seafood", kcalPer100: 400, protPer100: 80, maxGrams: 400, unit: "g" },
  { id: "b3", cat: "B", nameKey: "food_liver", kcalPer100: 403, protPer100: 53.3, maxGrams: 310, unit: "g" },
  { id: "b4", cat: "B", nameKey: "food_fish_high_fat", kcalPer100: 400, protPer100: 42.3, maxGrams: 235, unit: "g" },
  { id: "b5", cat: "B", nameKey: "food_fish_low_fat", kcalPer100: 403, protPer100: 73, maxGrams: 365, unit: "g" },
  { id: "b6", cat: "B", nameKey: "food_veal", kcalPer100: 400, protPer100: 47, maxGrams: 235, unit: "g" },
  { id: "b7", cat: "B", nameKey: "food_eggs", kcalPer100: 313, protPer100: 25.1, maxGrams: 4, unit: "pcs" },
  // V – Vegetables
  { id: "v1", cat: "V", nameKey: "food_mushrooms", kcalPer100: 120, protPer100: 21, maxGrams: 600, unit: "g" },
  { id: "v2", cat: "V", nameKey: "food_fresh_vegetables", kcalPer100: 120, protPer100: 9, maxGrams: 600, unit: "g" },
  // G – Fats / condiments
  { id: "g1", cat: "G", nameKey: "food_avocado", kcalPer100: 128, protPer100: 1.6, maxGrams: 80, unit: "g" },
  { id: "g2", cat: "G", nameKey: "food_oil", kcalPer100: 135, protPer100: 0, maxGrams: 15, unit: "g" },
  { id: "g3", cat: "G", nameKey: "food_mustard", kcalPer100: 127, protPer100: 1.1, maxGrams: 110, unit: "g" },
  { id: "g4", cat: "G", nameKey: "food_ketchup", kcalPer100: 133, protPer100: 1.3, maxGrams: 130, unit: "g" },
  { id: "g5", cat: "G", nameKey: "food_mayonnaise", kcalPer100: 120, protPer100: 0.3, maxGrams: 20, unit: "g" },
  { id: "g6", cat: "G", nameKey: "food_sauce", kcalPer100: 65, protPer100: 3.6, maxGrams: 100, unit: "g" },
  { id: "g7", cat: "G", nameKey: "food_olives", kcalPer100: 115, protPer100: 1, maxGrams: 110, unit: "g" },
  // D – Dairy
  { id: "d1", cat: "D", nameKey: "food_kefir", kcalPer100: 151, protPer100: 10.3, maxGrams: 240, unit: "g" },
  { id: "d2", cat: "D", nameKey: "food_milk", kcalPer100: 156, protPer100: 10.4, maxGrams: 340, unit: "g" },
  { id: "d3", cat: "D", nameKey: "food_yogurt", kcalPer100: 155, protPer100: 10.9, maxGrams: 340, unit: "g" },
  { id: "d4", cat: "D", nameKey: "food_cottage_cheese", kcalPer100: 168, protPer100: 23, maxGrams: 210, unit: "g" },
  { id: "d5", cat: "D", nameKey: "food_cheese_curds", kcalPer100: 175, protPer100: 10, maxGrams: 50, unit: "g" },
  { id: "d6", cat: "D", nameKey: "food_sour_cream", kcalPer100: 198, protPer100: 8.4, maxGrams: 105, unit: "g" },
  // E – Fruits (high sugar)
  { id: "e1", cat: "E", nameKey: "food_fruits_high_sugar", kcalPer100: 200, protPer100: 2.1, maxGrams: 210, unit: "g" },
  { id: "e2", cat: "E", nameKey: "food_fruits_berries", kcalPer100: 200, protPer100: 4.7, maxGrams: 400, unit: "g" },
  // N – Nuts
  { id: "n1", cat: "N", nameKey: "food_nuts", kcalPer100: 60, protPer100: 2.6, maxGrams: 10, unit: "g" },
  // J – Junk / anything
  { id: "j1", cat: "J", nameKey: "food_junk", kcalPer100: 425, protPer100: 4.3, maxGrams: 85, unit: "g" },
  { id: "j2", cat: "J", nameKey: "food_beer", kcalPer100: 103, protPer100: 0, maxGrams: 240, unit: "g" },
  { id: "j3", cat: "J", nameKey: "food_dry_wine", kcalPer100: 164, protPer100: 0, maxGrams: 150, unit: "g" },
  { id: "j4", cat: "J", nameKey: "food_strong_alcohol", kcalPer100: 110, protPer100: 0, maxGrams: 50, unit: "g" },
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
  const { t } = useLanguage();
  const [consumed, setConsumed] = useState({}); // { foodId: grams }
  const [selected, setSelected] = useState(null); // food item
  const [sliderVal, setSliderVal] = useState(0);
  const [todayReport, setTodayReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // ── localStorage helpers ────────────────────────────────────────────────────
  function getDailyKey() {
    return `nutrition_${moment().format("YYYY-MM-DD")}`;
  }

  function loadFromLocalStorage() {
    const key = getDailyKey();
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : {};
  }

  function saveToLocalStorage(data) {
    const key = getDailyKey();
    localStorage.setItem(key, JSON.stringify(data));
  }

  function clearDailyLocalStorage() {
    const key = getDailyKey();
    localStorage.removeItem(key);
  }

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const today = moment().format("YYYY-MM-DD");
    try {
      const reports = await apiClient.entities.DailyReport.list();
      const todayReport = reports.find((r) => r.date === today);
      if (todayReport) {
        setTodayReport(todayReport);
      }
      // Load consumed from localStorage for today, or start fresh
      const storedConsumed = loadFromLocalStorage();
      setConsumed(storedConsumed);
    } catch (error) {
      console.error('Error loading daily report:', error);
    }
    setLoading(false);
  }

  // ── Category stats ──────────────────────────────────────────────────────────
  function getCatStats(cat) {
    const items = FOOD_DATA.filter((f) => f.cat === cat);
    // Fraction = sum of (consumed / maxGrams) for each item
    const totalFraction = items.reduce((s, f) => s + (consumed[f.id] || 0) / f.maxGrams, 0);
    const fraction = Math.min(1, totalFraction);
    return { fraction };
  }

  function getAdjustedMax(item) {
    const items = FOOD_DATA.filter((f) => f.cat === item.cat && f.id !== item.id);
    // Fraction used by other items in same category
    const othersFraction = Math.min(1, items.reduce((s, f) => s + (consumed[f.id] || 0) / f.maxGrams, 0));
    // Available = item's maxGrams × (1 - fraction used by others)
    return Math.max(0, Math.floor(item.maxGrams * (1 - othersFraction)));
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
  async function saveToday() {
    setSaving(true);
    setSaveError(null);
    const today = moment().format("YYYY-MM-DD");

    try {
      // Fetch the latest report to preserve other fields
      const allReports = await apiClient.entities.DailyReport.list();
      const latestReport = allReports.find((r) => {
        const reportDate = moment(r.date).format("YYYY-MM-DD");
        return reportDate === today;
      });

      const meals = Object.entries(consumed)
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

      if (latestReport) {
        // Update existing with all preserved fields
        const updated = await apiClient.entities.DailyReport.update(latestReport.id, {
          date: today,
          calories_consumed: cal,
          protein_consumed: prot,
          meals_count: meals.length,
          steps: latestReport.steps || 0,
          exercises_done: latestReport.exercises_done || 0,
          submitted: latestReport.submitted || false,
        });
        setTodayReport(updated);
      } else {
        // Create new report
        const created = await apiClient.entities.DailyReport.create({
          date: today,
          calories_consumed: cal,
          protein_consumed: prot,
          meals_count: meals.length,
        });
        setTodayReport(created);
      }

      // Clear daily data for next day
      setConsumed({});
      clearDailyLocalStorage();
      setSaving(false);

      // Show success notification
      toast.success('Today\'s nutrition saved! 📊');
      return true;
    } catch (error) {
      console.error('Error saving nutrition data:', error);
      setSaveError(error.message || 'Failed to save nutrition data');
      setSaving(false);
      toast.error('Failed to save nutrition data');
      return false;
    }
  }

  // ── Dialog confirm ──────────────────────────────────────────────────────────
  function openItem(item) {
    if (isHiddenByCategory(item) && !isItemFull(item) && (consumed[item.id] || 0) === 0) return;
    setSelected(item);
    setSliderVal(consumed[item.id] || 0);
  }

  async function confirmItem() {
    const finalVal = typeof sliderVal === "number" ? sliderVal : 0;
    const newConsumed = { ...consumed, [selected.id]: finalVal };
    setConsumed(newConsumed);
    saveToLocalStorage(newConsumed);
    setSelected(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const selectedMax = selected ? getAdjustedMax(selected) : 0;
  const sliderNumVal = typeof sliderVal === "number" ? sliderVal : 0;
  const selectedKcal = selected ? calcKcal(selected, sliderNumVal) : 0;
  const selectedProt = selected ? calcProt(selected, sliderNumVal) : 0;
  const catStats = selected ? getCatStats(selected.cat) : null;

  // Filter foods based on search query
  const filteredFoods = FOOD_DATA.filter((item) =>
    t(item.nameKey).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">{t('racion_title')}</h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('racion_search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {/* Summary */}
      <div className="text-center mb-6">
        <p className="text-4xl font-bold">{totalProt.toFixed(0)} g</p>
        <p className="text-sm text-muted-foreground">{t('racion_protein')}</p>
        <div className="flex items-center justify-between mt-4 mb-1">
          <span className="text-sm text-muted-foreground">{t('racion_calories')}</span>
          <span className="text-sm text-muted-foreground">{totalKcal} / {kcalGoal} kcal</span>
        </div>
        <div className="h-2 bg-secondary rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all"
            style={{ width: `${Math.min((totalKcal / kcalGoal) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Save Today Button */}
      {saveError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          {saveError}
        </div>
      )}
      <button
        onClick={saveToday}
        disabled={saving}
        className="w-full mb-6 py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? t('racion_saving') : 'Save Today'}
      </button>

      {/* Food list */}
      <div className="space-y-2">
        {filteredFoods.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">{t('racion_no_results').replace('{query}', searchQuery)}</p>
          </div>
        ) : (
          filteredFoods.map((item) => {
            const eaten = consumed[item.id] || 0;
            const full = isItemFull(item);
            const adjMax = getAdjustedMax(item);
            const displayMax = full ? item.maxGrams : adjMax;
            const hidden = isHiddenByCategory(item) && eaten === 0;
            // Also hide if no grams available and nothing eaten
            const noAvailableGrams = displayMax === 0 && eaten === 0;
            if (hidden || noAvailableGrams) return null;
            const displayConsumed = item.unit === "pcs" ? `${(eaten / 60).toFixed(0)} pcs` : `${eaten} / ${displayMax} ${t('unit_grams')}`;

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
                      <p className="font-medium text-sm leading-tight">{t(item.nameKey)}</p>
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
                      style={{ width: `${Math.min((eaten / displayMax) * 100, 100)}%` }}
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
              <DialogTitle>{t(selected.nameKey)}</DialogTitle>
              <button
                onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground text-xs">{t('racion_original_recommendation').replace('{N}', selected.maxGrams)}</p>
                <p className="text-primary font-semibold">
                  {t('racion_recommended_portion').replace('{N}', selectedMax)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('racion_kcal_out_of').replace('{N}', calcKcal(selected, selectedMax)).replace('{N}', calcKcal(selected, selected.maxGrams))}
                </p>
              </div>

              {/* Category progress */}
              <div className="bg-secondary rounded-lg px-3 py-2 text-center text-xs text-muted-foreground">
                {t('racion_consumed_in_category').replace('{N}', Math.round(catStats.fraction * 100))}
              </div>

              {/* Save error */}
              {saveError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {saveError}
                </div>
              )}

              {/* Slider and Input */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{t('racion_amount_grams').replace('{N}', sliderNumVal)}</span>
                  <span>{t('racion_max_grams').replace('{N}', selectedMax)}</span>
                </div>
                <Slider
                  value={[sliderNumVal]}
                  min={0}
                  max={Math.max(selectedMax, sliderNumVal)}
                  step={1}
                  onValueChange={([v]) => setSliderVal(v)}
                  className="my-2"
                />
                <div className="mt-3">
                  <label className="block text-xs text-muted-foreground mb-1">{t('racion_enter_grams')}</label>
                  <Input
                    type="number"
                    min="0"
                    max={Math.max(selectedMax, sliderVal)}
                    value={sliderVal}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setSliderVal("");
                      } else {
                        const val = Math.min(Math.max(0, Number(e.target.value)), Math.max(selectedMax, sliderVal));
                        setSliderVal(val);
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        setSliderVal(0);
                      }
                    }}
                    placeholder="0"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  <span className="text-center">
                    <p className="text-xl font-bold">{selectedKcal}</p>
                    <p className="text-xs text-muted-foreground">{t('racion_kcal')}</p>
                  </span>
                  <span className="text-center">
                    <p className="text-xl font-bold">{selectedProt}g</p>
                    <p className="text-xs text-muted-foreground">{t('racion_protein')}</p>
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
                <Button variant="outline" className="flex-1 border-border" onClick={() => setSelected(null)} disabled={saving}>
                  {t('cancel')}
                </Button>
                <Button className="flex-1" onClick={confirmItem} disabled={saving}>
                  {saving ? t('racion_saving') : t('racion_confirm')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}