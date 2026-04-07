import { useState } from 'react';
import { DashboardCard, ProgressRing } from '@/components/ui';
import { Plus, Trash2, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Exercises() {
  const { t } = useLanguage();
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Running', duration: 30, calories: 350, time: '06:30' },
    { id: 2, name: 'Weight Training', duration: 45, calories: 280, time: '18:00' },
  ]);

  const totalDuration = exercises.reduce((sum, e) => sum + e.duration, 0);
  const totalCalories = exercises.reduce((sum, e) => sum + e.calories, 0);
  const exerciseGoal = 3;
  const currentExercises = exercises.length;

  const removeExercise = (id) => {
    setExercises(exercises.filter(e => e.id !== id));
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

      {/* Exercises list */}
      <DashboardCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-foreground">{t('exercises_today_title')}</h2>
          <button className="bg-primary text-primary-foreground p-1.5 rounded-lg hover:bg-primary/90">
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
