import { query } from './db-neon.js';

const DEMO_USER_EMAIL = 'demo@example.com';

async function seedDemoData() {
  try {
    console.log('🌱 Seeding demo data...');

    // Get demo user
    const userResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [DEMO_USER_EMAIL]
    );

    if (userResult.rows.length === 0) {
      console.error('Demo user not found!');
      return;
    }

    const userId = userResult.rows[0].id;

    // Clear existing data for demo user
    await query('DELETE FROM daily_reports WHERE user_id = $1', [userId]);
    await query('DELETE FROM measurements WHERE user_id = $1', [userId]);

    // Generate daily reports for the last 14 days
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Random but realistic data
      const steps = Math.floor(Math.random() * 8000) + 4000; // 4000-12000
      const calories = Math.floor(Math.random() * 800) + 1500; // 1500-2300
      const protein = Math.floor(Math.random() * 70) + 80; // 80-150g
      const exercises = Math.floor(Math.random() * 3) + 1; // 1-3
      const meals = Math.floor(Math.random() * 3) + 2; // 2-5

      await query(
        `INSERT INTO daily_reports (user_id, date, steps, calories_consumed, protein_consumed, exercises_done, meals_count, submitted, calories_goal, steps_goal, exercises_goal)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, 1766, 7000, 3)`,
        [userId, dateStr, steps, calories, protein, exercises, meals]
      );
    }

    console.log('✅ Added 14 days of daily reports');

    // Add weight measurements for the last 14 days (trending slightly down)
    const startWeight = 82.5;
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Slight downward trend with daily fluctuations
      const weight = startWeight - (13 - i) * 0.3 + (Math.random() - 0.5) * 1.5;

      await query(
        `INSERT INTO measurements (user_id, type, value, unit, date, goal_value)
         VALUES ($1, 'Weight', $2, 'kg', $3, 75)`,
        [userId, weight.toFixed(1), dateStr]
      );
    }

    console.log('✅ Added 14 days of weight measurements');

    // Add some body measurements (measurements for today)
    const measurements = [
      { type: 'Chest', value: 98, unit: 'cm', goal: 96 },
      { type: 'Waist', value: 82, unit: 'cm', goal: 80 },
      { type: 'Hip', value: 95, unit: 'cm', goal: 92 },
      { type: 'Bicep', value: 32, unit: 'cm', goal: 33 },
      { type: 'Thigh', value: 56, unit: 'cm', goal: 55 },
    ];

    for (const m of measurements) {
      await query(
        `INSERT INTO measurements (user_id, type, value, unit, date, goal_value)
         VALUES ($1, $2, $3, $4, NOW()::DATE, $5)`,
        [userId, m.type, m.value, m.unit, m.goal]
      );
    }

    console.log('✅ Added body measurements');
    console.log('🎉 Demo data seeded successfully!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
    process.exit(1);
  }
}

seedDemoData();
