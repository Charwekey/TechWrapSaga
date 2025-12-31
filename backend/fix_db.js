// fix_db.js - Clean up corrupted users with NULL password_hash
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

async function fixDatabase() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connected successfully!');

        // Delete users without password_hash
        console.log('Cleaning up users with NULL password_hash...');
        const [results, metadata] = await sequelize.query(
            `DELETE FROM "Users" WHERE password_hash IS NULL RETURNING *;`
        );
        console.log(`Deleted ${results.length} corrupted user(s).`);

        // Also check the schema
        console.log('\nChecking Users table schema...');
        const [schema] = await sequelize.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'Users';
        `);
        console.log('Current schema:');
        schema.forEach(col => console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`));

        console.log('\n✅ Database cleanup complete! Restart your backend now.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

fixDatabase();
