const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    console.log('Auth middleware - Token received:', token ? `${token.substring(0, 30)}...` : 'NO TOKEN');

    if (!token) {
        console.log('Auth middleware - No token provided, returning 401');
        return res.status(401).json({ error: 'Access Denied', reason: 'No token provided' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'supersecretkey';
        console.log('Auth middleware - Using secret starting with:', secret.substring(0, 10) + '...');
        const verified = jwt.verify(token, secret);
        console.log('Auth middleware - Token verified successfully, user id:', verified.id);
        req.user = verified;
        next();
    } catch (err) {
        console.log('Auth middleware - Token verification failed:', err.message);
        res.status(400).json({ error: 'Invalid Token', reason: err.message });
    }
};
