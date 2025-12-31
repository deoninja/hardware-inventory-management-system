const { PrismaClient } = require('@prisma/client');

// Manually verify credentials against 'postgres' db
const dbUrl = "postgresql://postgres:root@localhost:5432/postgres";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: dbUrl,
        },
    },
    log: ['info', 'warn', 'error'],
});

async function main() {
    console.log("Attempting to connect to 'postgres' database with user 'postgres' and password 'root'...");
    try {
        await prisma.$connect();
        console.log("SUCCESS: Connected to 'postgres' database!");

        // Check if inventorymanagement db exists
        const result = await prisma.$queryRaw`SELECT 1 FROM pg_database WHERE datname = 'inventorymanagement'`;
        if (result.length > 0) {
            console.log("Database 'inventorymanagement' EXISTS.");
        } else {
            console.log("Database 'inventorymanagement' DOES NOT EXIST.");
            console.log("You must create it.");
        }

    } catch (error) {
        console.error("FAILURE: Could not connect to 'postgres' database.");
        console.error("Error Message:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
