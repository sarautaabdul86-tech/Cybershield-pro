import pool from '../config/database.js';
import logger from '../config/logger.js';

export const seedDatabase = async () => {
  const client = await pool.connect();
  try {
    logger.info('Starting database seeding...');
    
    // Seed learning paths
    const paths = [
      { title: 'Cybersecurity Fundamentals', level: 'Beginner' },
      { title: 'Ethical Hacking', level: 'Intermediate' },
      { title: 'Advanced Security', level: 'Advanced' },
    ];
    
    for (const path of paths) {
      await client.query(
        'INSERT INTO learning_paths (title, description, level) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [path.title, `${path.title} learning path`, path.level]
      );
    }
    
    // Seed badges
    const badges = [
      { name: 'First Steps', description: 'Completed first course', icon_url: '/badges/first-steps.svg' },
      { name: 'Quick Learner', description: 'Completed 5 courses', icon_url: '/badges/quick-learner.svg' },
      { name: 'Master', description: 'Completed all courses', icon_url: '/badges/master.svg' },
    ];
    
    for (const badge of badges) {
      await client.query(
        'INSERT INTO badges (name, description, icon_url) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [badge.name, badge.description, badge.icon_url]
      );
    }
    
    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Seeding error:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (process.argv[1].includes('seeds.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
