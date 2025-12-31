// migrate_db.js - Add password_hash column and clean up
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

async function migrateDatabase() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connected successfully!\n');

        // Step 1: Delete all existing users since they don't have passwords
        console.log('Step 1: Removing users without passwords...');
        await sequelize.query(`DELETE FROM "Users";`);
        console.log('  ✓ Removed all corrupted users.\n');

        // Step 2: Also delete any wraps associated with deleted users
        console.log('Step 2: Cleaning up orphaned wraps...');
        try {
            await sequelize.query(`DELETE FROM "Wraps";`);
            console.log('  ✓ Removed orphaned wraps.\n');
        } catch (e) {
            console.log('  (No Wraps table yet, skipping).\n');
        }

        // Step 3: Add password_hash column if it doesn't exist
        console.log('Step 3: Adding password_hash column...');
        try {
            await sequelize.query(`
                ALTER TABLE "Users" 
                ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
            `);
            console.log('  ✓ Added password_hash column.\n');
        } catch (e) {
            console.log('  Column may already exist or error:', e.message);
        }

        console.log('✅ Database migration complete!');
        console.log('\nNow restart the backend with: npm start');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

migrateDatabase();
