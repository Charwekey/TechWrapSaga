const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

async function cleanUser() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const email = 'charwekeyrabisabutey@gmail.com'; // The user email from screenshot

        // Raw query to be safe, in case Model definition is still syncing
        const [results, metadata] = await sequelize.query(
            "DELETE FROM \"Users\" WHERE email = :email RETURNING *",
            {
                replacements: { email }
            }
        );

        console.log(`Deleted ${metadata.rowCount} corrupted user(s).`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

cleanUser();
