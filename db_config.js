import pg from "pg";
// Initialise DB connection
const { Pool } = pg;

let pgConnectionConfigs;
// test to see if the env var is set. Then we know we are in Heroku
if (process.env.DATABASE_URL) {
  // pg will take in the entire value and use it to connect
  pgConnectionConfigs = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
  // this is the same value as before

  pgConnectionConfigs = {
    user: "regina",
    host: "localhost",
    database: "birding2",
    port: 5432, // Postgres server always runs on this port by default
  };
}
const pool = new Pool(pgConnectionConfigs);

export { pool };
