const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
    console.error('Please set DATABASE_URL in your environment variables.');
    process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for Supabase/some cloud providers
        }
    }
});

module.exports = sequelize;
