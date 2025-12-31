const router = require('express').Router();
const User = require('../models/User');
const Wrap = require('../models/Wrap');
const verify = require('../middleware/authMiddleware');

// Get specific wrap (Public)
// Get specific wrap (Public)
router.get('/:id', async (req, res) => {
    try {
        // Fetch Wrap by PK (Wrap ID) and include User data
        const wrap = await Wrap.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['name', 'title'] // Only get name and title
            }]
        });

        if (!wrap) return res.status(404).send('Wrap not found');

        // Combine data for frontend (Flatten structure)
        const responseData = {
            ...wrap.toJSON(),
            name: wrap.User.name,
            title: wrap.User.title
        };

        res.json(responseData);
    } catch (err) {
        console.error(err);
        res.status(400).send('Error fetching data');
    }
});

// Save wrap data (Authenticated)
const Joi = require('joi');
const wrapSchema = Joi.object({
    title: Joi.string().allow('').optional(),
    events_attended: Joi.array().items(Joi.string()),
    events_spoken_at: Joi.array().items(Joi.string()),
    projects: Joi.array().items(Joi.string()),
    tools_learned: Joi.array().items(Joi.string()),
    challenges: Joi.array().items(Joi.string()),
    overcome_challenges: Joi.array().items(Joi.string()),
    goals_2026: Joi.array().items(Joi.string()),
    theme: Joi.string().valid('girly', 'neutral', 'hybrid').default('neutral')
});

router.post('/', verify, async (req, res) => {
    // Validate data
    const { error } = wrapSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // Check if wrap exists for this user (Update vs Create)
        let wrap = await Wrap.findOne({ where: { user_id: req.user.id } });

        if (wrap) {
            // Update existing
            await wrap.update({
                events_attended: req.body.events_attended,
                events_spoken_at: req.body.events_spoken_at,
                projects: req.body.projects,
                tools_learned: req.body.tools_learned,
                challenges: req.body.challenges,
                overcome_challenges: req.body.overcome_challenges,
                goals_2026: req.body.goals_2026,
                theme: req.body.theme
            });
        } else {
            // Create new
            wrap = await Wrap.create({
                user_id: req.user.id,
                events_attended: req.body.events_attended,
                events_spoken_at: req.body.events_spoken_at,
                projects: req.body.projects,
                tools_learned: req.body.tools_learned,
                challenges: req.body.challenges,
                overcome_challenges: req.body.overcome_challenges,
                goals_2026: req.body.goals_2026,
                theme: req.body.theme
            });
        }

        // Also update User title if provided
        if (req.body.title) {
            await User.update({ title: req.body.title }, { where: { id: req.user.id } });
        }

        res.json(wrap);
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});
module.exports = router;
