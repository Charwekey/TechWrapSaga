const http = require('http');

function postData() {
    const data = JSON.stringify({
        title: "Test",
        events_attended: ["Event 1"],
        lessons_learned: ["Lesson 1"], // This is the field in question
        theme: "neutral"
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/wraps',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            // We need a valid token. If we don't have one, this will fail with 401, 
            // but if we get 400 "lessons_learned not allowed", we know the schema is wrong.
            // If we get 401 "Access Denied", it means the schema validation hasn't run yet 
            // (or it runs after auth). 
            // In the code, `verify` middleware runs BEFORE schema validation.
            // So we need a token.
        }
    };

    // To properly test, I'll assume I can't easily get a valid token without logging in first.
    // However, I can check if the server is running the correct code by hitting a simpler endpoint if one existed, 
    // but here I must login.

    // Let's just run the full login flow again.
}

// ... actually I'll just reuse the logic from test_schema.js but simplified
const request = (method, path, body, headers = {}) => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path,
            method,
            headers: { 'Content-Type': 'application/json', ...headers }
        }, (res) => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => resolve({ s: res.statusCode, d }));
        });
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
};

async function run() {
    // 1. Login to get token
    // We can use the test user credentials if they exist, or create new.
    // I entered 'test${Date.now()}@example.com' before. 
    // I'll create a new one to be safe.
    const email = `valtest${Date.now()}@test.com`;
    let res = await request('POST', '/api/auth/signup', {
        name: 'Val Test',
        email,
        password: 'password123',
        title: 'Dev'
    });

    let token = JSON.parse(res.d).token;
    if (!token) {
        // Try login just in case
        res = await request('POST', '/api/auth/login', { email, password: 'password123' });
        token = JSON.parse(res.d).token;
    }

    if (!token) {
        console.log("Login failed", res.d);
        return;
    }

    // 2. Submit with new field
    res = await request('POST', '/api/wraps', {
        lessons_learned: ["Always test"],
        theme: "neutral"
    }, { 'auth-token': token });

    console.log("Status:", res.s);
    console.log("Body:", res.d);
}

run();
