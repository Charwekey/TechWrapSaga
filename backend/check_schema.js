// check_schema.js - Check database schema
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

async function checkSchema() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connected successfully!\n');

        // Check Users table schema
        console.log('Users table columns:');
        const [columns] = await sequelize.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'Users'
            ORDER BY ordinal_position;
        `);

        if (columns.length === 0) {
            console.log('  (No Users table found - needs to be created)');
        } else {
            columns.forEach(col => {
                console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
            });
        }

        // Check for users
        console.log('\nExisting users:');
        const [users] = await sequelize.query(`SELECT * FROM "Users" LIMIT 5;`);
        if (users.length === 0) {
            console.log('  (No users found)');
        } else {
            users.forEach(u => console.log(`  - ID: ${u.id}, Email: ${u.email}, Has password_hash: ${!!u.password_hash}`));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkSchema();
