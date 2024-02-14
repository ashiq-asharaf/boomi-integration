const pgp = require('pg-promise')();
const connectionString = process.env.DATABASE_URL; // replace with your actual PostgreSQL connection string
const db = pgp(connectionString);

module.exports = db;
