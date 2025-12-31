require('dotenv').config();
console.log("Checking DATABASE_URL...");
if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL is set.");
    console.log("Length:", process.env.DATABASE_URL.length);
    console.log("Starts with postgresql://:", process.env.DATABASE_URL.startsWith('postgresql://'));
} else {
    console.log("DATABASE_URL is NOT set.");
}
