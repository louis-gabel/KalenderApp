// This file configures a database connection pool using environment variables (in .env) for the database name and port.
// The connection pool is then exported for use in other parts of the app.
const knex = require("knex");
const config = require("../../knexfile");

const db = knex(config.development);

module.exports = db;
