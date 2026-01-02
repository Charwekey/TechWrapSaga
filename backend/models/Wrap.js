const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Wrap = sequelize.define('Wrap', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // 'Users' refers to table name
            key: 'id',
        }
    },
    year: {
        type: DataTypes.INTEGER,
        defaultValue: 2025
    },
    projects: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    tools_learned: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        field: 'tools_learnt' // Maps to actual database column name
    },
    events_attended: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    events_spoken_at: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    challenges: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    overcome_challenges: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    goals_2026: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    theme: {
        type: DataTypes.STRING,
        defaultValue: 'neutral'
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Wrap;
