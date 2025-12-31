require('dotenv').config();
const dns = require('dns');

const dbUrl = process.env.DATABASE_URL;

console.log("--- DEBUG START ---");
console.log(`Raw URL: '${dbUrl}'`);

// Check for invisible characters
console.log("Character codes:");
for (let i = 0; i < dbUrl.length; i++) {
    const code = dbUrl.charCodeAt(i);
    if (code < 32 || code > 126) {
        console.log(`WARNING: Non-standard character found at index ${i}: '${dbUrl[i]}' (Code: ${code})`);
    }
}
console.log("--- END CHAR CHECK ---");

// Parse Hostname
try {
    // Handle postgres:// format manually if URL generic parser fails or to be sure
    // postgres://user:pass@host:port/db
    const match = dbUrl.match(/@([^:]+):/);
    if (match && match[1]) {
        const hostname = match[1];
        console.log(`Parsed Hostname: '${hostname}'`);

        console.log(`Attempting DNS lookup for: ${hostname}`);
        dns.lookup(hostname, (err, address, family) => {
            if (err) {
                console.error("DNS Loopup Failed:", err);
            } else {
                console.log(`DNS Lookup Successful: ${hostname} -> ${address}`);
            }
        });
    } else {
        console.log("Could not parse hostname from URL regex.");
    }
} catch (e) {
    console.error("Parsing error:", e);
}
