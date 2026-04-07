import { Pool } from '@neondatabase/serverless';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable not set. Please set it in your .env or Vercel settings.');
}

const pool = new Pool({ connectionString });

export async function query(text, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function initializeDatabase() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create measurements table
    await query(`
      CREATE TABLE IF NOT EXISTS measurements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(10),
        date DATE NOT NULL,
        goal_value DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, type, date)
      )
    `);

    // Create daily_reports table
    await query(`
      CREATE TABLE IF NOT EXISTS daily_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        steps INTEGER DEFAULT 0,
        calories_consumed INTEGER DEFAULT 0,
        protein_consumed DECIMAL(10, 1) DEFAULT 0,
        exercises_done INTEGER DEFAULT 0,
        meals_count INTEGER DEFAULT 0,
        calories_goal INTEGER DEFAULT 1766,
        steps_goal INTEGER DEFAULT 7000,
        exercises_goal INTEGER DEFAULT 3,
        submitted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date)
      )
    `);

    // Create foods table
    await query(`
      CREATE TABLE IF NOT EXISTS foods (
        id SERIAL PRIMARY KEY,
        food_id VARCHAR(50) UNIQUE NOT NULL,
        category VARCHAR(10) NOT NULL,
        name VARCHAR(255) NOT NULL,
        kcal_per_100 DECIMAL(10, 2) NOT NULL,
        protein_per_100 DECIMAL(10, 2) NOT NULL,
        max_grams INTEGER NOT NULL,
        unit VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✓ Database tables initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function seedFoods() {
  try {
    const foods = [
      // A – Carbs
      ['a1', 'A', 'Whole-grain flour', 240, 8.3, 75, 'g'],
      ['a2', 'A', 'Corn (fresh)', 239, 6.2, 280, 'g'],
      ['a3', 'A', 'Lavash bread', 240, 8, 100, 'g'],
      ['a4', 'A', 'Pasta', 238, 8.4, 70, 'g'],
      ['a5', 'A', 'Brown rice', 248, 7.9, 75, 'g'],
      ['a6', 'A', 'Whole grain bread', 238, 8.5, 95, 'g'],
      ['a7', 'A', 'Crackers', 240, 7.9, 75, 'g'],
      // B – Protein
      ['b1', 'B', 'Chicken / turkey fillet', 402, 80.3, 355, 'g'],
      ['b2', 'B', 'Seafood', 400, 80, 400, 'g'],
      ['b3', 'B', 'Liver', 403, 53.3, 310, 'g'],
      ['b4', 'B', 'Fish (>5% fat)', 400, 42.3, 235, 'g'],
      ['b5', 'B', 'Fish (<5% fat)', 403, 73, 365, 'g'],
      ['b6', 'B', 'Veal', 400, 47, 235, 'g'],
      ['b7', 'B', 'Eggs (whole)', 313, 25.1, 4, 'pcs'],
      // V – Vegetables
      ['v1', 'V', 'Mushrooms', 120, 21, 600, 'g'],
      ['v2', 'V', 'Fresh vegetables & greens', 120, 9, 600, 'g'],
      // G – Fats / condiments
      ['g1', 'G', 'Avocado', 128, 1.6, 80, 'g'],
      ['g2', 'G', 'Any oil (recommend flaxseed)', 135, 0, 15, 'g'],
      ['g3', 'G', 'Mustard', 127, 1.1, 110, 'g'],
      ['g4', 'G', 'Ketchup', 133, 1.3, 130, 'g'],
      ['g5', 'G', 'Mayonnaise', 120, 0.3, 20, 'g'],
      ['g6', 'G', 'Garnish/sauce', 65, 3.6, 100, 'g'],
      // D – Dairy
      ['d1', 'D', 'Kefir 1%', 151, 10.3, 240, 'g'],
      ['d2', 'D', 'Milk 1%', 156, 10.4, 340, 'g'],
      ['d3', 'D', 'Unsweetened yogurt 1%', 155, 10.9, 340, 'g'],
      ['d4', 'D', 'Cottage cheese (0.2%)', 168, 23, 210, 'g'],
      ['d5', 'D', 'Melted cheese curds', 175, 10, 50, 'g'],
      ['d6', 'D', 'Sour cream 15%', 198, 8.4, 105, 'g'],
      // E – Fruits
      ['e1', 'E', 'Bananas, grapes, persimmon', 200, 2.1, 210, 'g'],
      ['e2', 'E', 'Fruits & berries', 200, 4.7, 400, 'g'],
      // N – Nuts
      ['n1', 'N', 'Any nuts (recommend walnuts)', 60, 2.6, 10, 'g'],
      // J – Junk
      ['j1', 'J', 'Anything (sweets, snacks, sausage)', 425, 4.3, 85, 'g'],
      ['j2', 'J', 'Beer', 103, 0, 240, 'g'],
      ['j3', 'J', 'Dry wine', 164, 0, 150, 'g'],
      ['j4', 'J', 'Strong alcoholic drinks', 110, 0, 50, 'g'],
    ];

    // Clear existing foods
    await query('DELETE FROM foods');

    // Insert foods
    for (const [id, cat, name, kcal, prot, max, unit] of foods) {
      await query(
        'INSERT INTO foods (food_id, category, name, kcal_per_100, protein_per_100, max_grams, unit) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (food_id) DO NOTHING',
        [id, cat, name, kcal, prot, max, unit]
      );
    }

    console.log('✓ Foods seeded');
  } catch (error) {
    console.error('Food seeding error:', error);
    throw error;
  }
}
