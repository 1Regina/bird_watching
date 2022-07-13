import pg from "pg";
// Initialise DB connection
const { Pool } = pg;
const pgConnectionConfigs = {
  user: "regina",
  host: "localhost",
  database: "birding2",
  port: 5432, // Postgres server always runs on this port by default
};
const pool = new Pool(pgConnectionConfigs);


export {pool}