import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create measurements table
    await sql`
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
    `;

    // Create daily_reports table
    await sql`
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
    `;

    // Create foods table
    await sql`
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
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function seedFoods() {
  try {
    const foods = [
      // A – Carbs
      { id: 'a1', cat: 'A', name: 'Whole-grain flour', kcal: 240, prot: 8.3, max: 75, unit: 'g' },
      { id: 'a2', cat: 'A', name: 'Corn (fresh)', kcal: 239, prot: 6.2, max: 280, unit: 'g' },
      { id: 'a3', cat: 'A', name: 'Lavash bread', kcal: 240, prot: 8, max: 100, unit: 'g' },
      { id: 'a4', cat: 'A', name: 'Pasta', kcal: 238, prot: 8.4, max: 70, unit: 'g' },
      { id: 'a5', cat: 'A', name: 'Brown rice', kcal: 248, prot: 7.9, max: 75, unit: 'g' },
      { id: 'a6', cat: 'A', name: 'Whole grain bread', kcal: 238, prot: 8.5, max: 95, unit: 'g' },
      { id: 'a7', cat: 'A', name: 'Crackers', kcal: 240, prot: 7.9, max: 75, unit: 'g' },
      // B – Protein
      { id: 'b1', cat: 'B', name: 'Chicken / turkey fillet', kcal: 402, prot: 80.3, max: 355, unit: 'g' },
      { id: 'b2', cat: 'B', name: 'Seafood', kcal: 400, prot: 80, max: 400, unit: 'g' },
      { id: 'b3', cat: 'B', name: 'Liver', kcal: 403, prot: 53.3, max: 310, unit: 'g' },
      { id: 'b4', cat: 'B', name: 'Fish (>5% fat)', kcal: 400, prot: 42.3, max: 235, unit: 'g' },
      { id: 'b5', cat: 'B', name: 'Fish (<5% fat)', kcal: 403, prot: 73, max: 365, unit: 'g' },
      { id: 'b6', cat: 'B', name: 'Veal', kcal: 400, prot: 47, max: 235, unit: 'g' },
      { id: 'b7', cat: 'B', name: 'Eggs (whole)', kcal: 313, prot: 25.1, max: 4, unit: 'pcs' },
      // V – Vegetables
      { id: 'v1', cat: 'V', name: 'Mushrooms', kcal: 120, prot: 21, max: 600, unit: 'g' },
      { id: 'v2', cat: 'V', name: 'Fresh vegetables & greens', kcal: 120, prot: 9, max: 600, unit: 'g' },
      // G – Fats / condiments
      { id: 'g1', cat: 'G', name: 'Avocado', kcal: 128, prot: 1.6, max: 80, unit: 'g' },
      { id: 'g2', cat: 'G', name: 'Any oil (recommend flaxseed)', kcal: 135, prot: 0, max: 15, unit: 'g' },
      { id: 'g3', cat: 'G', name: 'Mustard', kcal: 127, prot: 1.1, max: 110, unit: 'g' },
      { id: 'g4', cat: 'G', name: 'Ketchup', kcal: 133, prot: 1.3, max: 130, unit: 'g' },
      { id: 'g5', cat: 'G', name: 'Mayonnaise', kcal: 120, prot: 0.3, max: 20, unit: 'g' },
      { id: 'g6', cat: 'G', name: 'Garnish/sauce', kcal: 65, prot: 3.6, max: 100, unit: 'g' },
      // D – Dairy
      { id: 'd1', cat: 'D', name: 'Kefir 1%', kcal: 151, prot: 10.3, max: 240, unit: 'g' },
      { id: 'd2', cat: 'D', name: 'Milk 1%', kcal: 156, prot: 10.4, max: 340, unit: 'g' },
      { id: 'd3', cat: 'D', name: 'Unsweetened yogurt 1%', kcal: 155, prot: 10.9, max: 340, unit: 'g' },
      { id: 'd4', cat: 'D', name: 'Cottage cheese (0.2%)', kcal: 168, prot: 23, max: 210, unit: 'g' },
      { id: 'd5', cat: 'D', name: 'Melted cheese curds', kcal: 175, prot: 10, max: 50, unit: 'g' },
      { id: 'd6', cat: 'D', name: 'Sour cream 15%', kcal: 198, prot: 8.4, max: 105, unit: 'g' },
      // E – Fruits (high sugar)
      { id: 'e1', cat: 'E', name: 'Bananas, grapes, persimmon', kcal: 200, prot: 2.1, max: 210, unit: 'g' },
      { id: 'e2', cat: 'E', name: 'Fruits & berries', kcal: 200, prot: 4.7, max: 400, unit: 'g' },
      // N – Nuts
      { id: 'n1', cat: 'N', name: 'Any nuts (recommend walnuts)', kcal: 60, prot: 2.6, max: 10, unit: 'g' },
      // J – Junk / anything
      { id: 'j1', cat: 'J', name: 'Anything (sweets, snacks, sausage)', kcal: 425, prot: 4.3, max: 85, unit: 'g' },
      { id: 'j2', cat: 'J', name: 'Beer', kcal: 103, prot: 0, max: 240, unit: 'g' },
      { id: 'j3', cat: 'J', name: 'Dry wine', kcal: 164, prot: 0, max: 150, unit: 'g' },
      { id: 'j4', cat: 'J', name: 'Strong alcoholic drinks', kcal: 110, prot: 0, max: 50, unit: 'g' },
    ];

    // Clear existing foods
    await sql`DELETE FROM foods`;

    // Insert foods
    for (const food of foods) {
      await sql`
        INSERT INTO foods (food_id, category, name, kcal_per_100, protein_per_100, max_grams, unit)
        VALUES (${food.id}, ${food.cat}, ${food.name}, ${food.kcal}, ${food.prot}, ${food.max}, ${food.unit})
        ON CONFLICT (food_id) DO NOTHING
      `;
    }

    console.log('Foods seeded successfully');
  } catch (error) {
    console.error('Food seeding error:', error);
    throw error;
  }
}
