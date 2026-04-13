import { useState, useEffect } from 'react';
import { DashboardCard, ProgressRing } from '@/components/ui';
import { Plus, Trash2, Clock, X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { apiClient } from '@/api/apiClient';
import moment from 'moment';

export default function Exercises() {
  const { t } = useLanguage();
  const [exercises, setExercises] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', sets: 3, reps: 10 });
  const [loading, setLoading] = useState(true);

  // Load exercises from daily report
  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    try {
      const today = moment().format("YYYY-MM-DD");
      const reports = await apiClient.entities.DailyReport.list();
      const todayReport = reports.find((r) => moment(r.date).format("YYYY-MM-DD") === today);

      if (todayReport && todayReport.exercises_list) {
        setExercises(JSON.parse(todayReport.exercises_list));
      } else {
        setExercises([]);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveExercisesToDB(updatedExercises) {
    try {
      const today = moment().format("YYYY-MM-DD");
      const reports = await apiClient.entities.DailyReport.list();
      const todayReport = reports.find((r) => moment(r.date).format("YYYY-MM-DD") === today);

      if (todayReport) {
        await apiClient.entities.DailyReport.update(todayReport.id, {
          date: today,
          exercises_list: JSON.stringify(updatedExercises),
          exercises_done: updatedExercises.length,
        });
      }
    } catch (error) {
      console.error('Error saving exercises:', error);
    }
  }

  const totalSets = exercises.reduce((sum, e) => sum + e.sets, 0);
  const totalReps = exercises.reduce((sum, e) => sum + (e.sets * e.reps), 0);
  const exerciseGoal = 3;
  const currentExercises = exercises.length;

  const removeExercise = (id) => {
    const updated = exercises.filter(e => e.id !== id);
    setExercises(updated);
    saveExercisesToDB(updated);
  };

  const addExercise = () => {
    if (!newExercise.name.trim()) return;
    const exercise = {
      id: Date.now(),
      name: newExercise.name,
      sets: parseInt(newExercise.sets) || 3,
      reps: parseInt(newExercise.reps) || 10,
    };
    const updated = [...exercises, exercise];
    setExercises(updated);
    saveExercisesToDB(updated);
    setNewExercise({ name: '', sets: 3, reps: 10 });
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">{t('exercises_title')}</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <DashboardCard>
          <p className="text-xs text-muted-foreground mb-1">{t('exercises_label')}</p>
          <p className="text-3xl font-bold text-foreground">{currentExercises}</p>
          <p className="text-xs text-muted-foreground">{t('exercises_daily_goal').replace('{N}', exerciseGoal)}</p>
        </DashboardCard>

        <DashboardCard>
          <p className="text-xs text-muted-foreground mb-1">Total Sets</p>
          <p className="text-3xl font-bold text-foreground">{totalSets}</p>
          <p className="text-xs text-muted-foreground">Total Reps: {totalReps}</p>
        </DashboardCard>
      </div>

      {/* Add Exercise Form */}
      {showAddForm && (
        <DashboardCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Add Exercise</h3>
            <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Exercise Name</label>
              <input
                type="text"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                placeholder="e.g., Running, Yoga, Swimming"
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Sets</label>
                <input
                  type="number"
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Reps</label>
                <input
                  type="number"
                  value={newExercise.reps}
                  onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addExercise}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 font-medium transition-colors"
              >
                Add Exercise
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-secondary text-foreground py-2 rounded-lg hover:bg-secondary/80 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </DashboardCard>
      )}

      {/* Exercises list */}
      <DashboardCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-foreground">{t('exercises_today_title')}</h2>
          <button onClick={() => setShowAddForm(true)} className="bg-primary text-primary-foreground p-1.5 rounded-lg hover:bg-primary/90">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{exercise.name}</p>
                <p className="text-xs text-muted-foreground">{exercise.sets} sets × {exercise.reps} reps</p>
              </div>
              <button
                onClick={() => removeExercise(exercise.id)}
                className="text-destructive hover:text-destructive/80 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* Progress toward goal */}
      <DashboardCard>
        <h3 className="font-semibold text-foreground mb-4">{t('exercises_weekly_goal')}</h3>
        <div className="flex items-center justify-center gap-8">
          <ProgressRing
            percentage={(currentExercises / exerciseGoal) * 100}
            size={100}
            label={t('exercises_ring_label')}
          />
        </div>
      </DashboardCard>
    </div>
  );
}
