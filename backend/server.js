const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const wrapRoutes = require('./routes/wraps');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to Database
// Connect to Database
const User = require('./models/User');
const Wrap = require('./models/Wrap');

// Define Relationships
User.hasMany(Wrap, { foreignKey: 'user_id' });
Wrap.belongsTo(User, { foreignKey: 'user_id' });

sequelize.sync({ alter: true }) // alter: true updates tables without dropping them
    .then(() => console.log('PostgreSQL Connected & Models Synced'))
    .catch(err => console.log('Database Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wraps', wrapRoutes);
app.use('/api/export', require('./routes/export'));

app.get('/api/themes', (req, res) => {
    res.json([
        { id: 'girly', name: 'Girly', colors: ['pink', 'pastel'] },
        { id: 'neutral', name: 'Neutral', colors: ['gray', 'white'] },
        { id: 'hybrid', name: 'Hybrid', colors: ['purple', 'blue'] }
    ]);
});


app.get('/', (req, res) => {
    res.send('TechWrapSaga 2025 API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
