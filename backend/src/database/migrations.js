import pool from '../config/database.js';
import logger from '../config/logger.js';

export const runMigrations = async () => {
  const client = await pool.connect();
  try {
    logger.info('Starting database migrations...');
    
    // Read and execute initial schema from init.sql
    const fs = await import('fs').then(m => m.promises);
    const schema = await fs.readFile('./src/database/init.sql', 'utf-8');
    
    await client.query(schema);
    
    logger.info('Database migrations completed successfully');
  } catch (error) {
    logger.error('Migration error:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (process.argv[1].includes('migrations.js')) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Migration failed:', error);
      process.exit(1);
    });
}

export default runMigrations;
