const fs = require('fs');
const content = `DATABASE_URL="postgresql://postgres:root@localhost:5432/inventorymanagement"
PORT=5000`;
fs.writeFileSync('.env', content, { encoding: 'utf8' });
console.log('.env file rewritten successfully.');
