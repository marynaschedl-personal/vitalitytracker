import { initializeDatabase, seedFoods } from './db-neon.js';

async function setup() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('✓ Database tables created');

    console.log('Seeding foods...');
    await seedFoods();
    console.log('✓ Foods seeded');

    console.log('\n✓ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setup();
