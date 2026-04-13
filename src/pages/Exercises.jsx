import { useState } from 'react';
import { DashboardCard, ProgressRing } from '@/components/ui';
import { Plus, Trash2, Clock, X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Exercises() {
  const { t } = useLanguage();
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Running', duration: 30, calories: 350, time: '06:30' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', duration: 30, calories: 200, time: '' });

  const totalDuration = exercises.reduce((sum, e) => sum + e.duration, 0);
  const totalCalories = exercises.reduce((sum, e) => sum + e.calories, 0);
  const exerciseGoal = 3;
  const currentExercises = exercises.length;

  const removeExercise = (id) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const addExercise = () => {
    if (!newExercise.name.trim()) return;
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const exercise = {
      id: Date.now(),
      name: newExercise.name,
      duration: parseInt(newExercise.duration) || 30,
      calories: parseInt(newExercise.calories) || 200,
      time: newExercise.time || time,
    };
    setExercises([...exercises, exercise]);
    setNewExercise({ name: '', duration: 30, calories: 200, time: '' });
    setShowAddForm(false);
  };

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
          <p className="text-xs text-muted-foreground mb-1">{t('exercises_total_time')}</p>
          <p className="text-3xl font-bold text-foreground">{totalDuration}m</p>
          <p className="text-xs text-muted-foreground">{t('exercises_calories').replace('{N}', totalCalories)}</p>
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
                <label className="block text-sm font-medium text-foreground mb-1">Duration (min)</label>
                <input
                  type="number"
                  value={newExercise.duration}
                  onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Calories Burned</label>
                <input
                  type="number"
                  value={newExercise.calories}
                  onChange={(e) => setNewExercise({ ...newExercise, calories: e.target.value })}
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {t('exercises_detail').replace('{N}', exercise.duration).replace('{N}', exercise.calories)}
                </div>
              </div>
              <div className="text-right mr-3">
                <p className="text-sm text-muted-foreground">{exercise.time}</p>
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
