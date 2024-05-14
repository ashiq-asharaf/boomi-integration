const pgp = require('pg-promise')();
const DATABASE_URL = process.env.DATABASE_URL;
const NAME = process.env.NAME;
const PASSWORD = process.env.PASSWORD;
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const DATABASENAME = process.env.DATABASENAME;



// "postgres://process.env.USERNAME:process.env.PASSWORD@process.env.HOST:process.env.PORT/process.env.DATABASENAME";

const connectionString = `postgres://${NAME}:${PASSWORD}@${HOST}:${PORT}/${DATABASENAME}`;
const db = pgp(connectionString);

db.connect()
  .then(obj => {
    obj.done(); // success, release the connection;
    console.log('Connected to PostgreSQL database');
  })
  .catch(error => {
    console.error('Error connecting to PostgreSQL database:', error.message || error);
  });

module.exports = db;
