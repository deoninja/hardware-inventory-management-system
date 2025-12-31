const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log("Attempting to connect to database...");
    console.log("URL:", process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@')); // Mask password
    try {
        await prisma.$connect();
        console.log("Successfully connected to database!");
    } catch (error) {
        console.error("Connection failed!");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
