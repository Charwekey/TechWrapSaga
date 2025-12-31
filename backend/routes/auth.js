const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    title: Joi.string().allow('').optional()
});

const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

router.post('/signup', async (req, res) => {
    // Validate data
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email, password, title } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create User
        user = await User.create({
            name,
            email,
            password_hash,
            title
        });

        // Create Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '7d' });

        // Return same structure as login
        res.header('auth-token', token).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                title: user.title,
                theme: user.theme
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    // Validate data
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return res.status(400).send('Invalid Credentials');

        const validPass = await bcrypt.compare(req.body.password, user.password_hash);
        if (!validPass) return res.status(400).send('Invalid Credentials');

        // Create and assign token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '7d' });
        res.header('auth-token', token).send({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                title: user.title,
                theme: user.theme
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
