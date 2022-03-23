import express from "express";
// import read, {add} from './jsonFileStorage.js';
import methodOverride from "method-override";
import pg from "pg";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import jsSHA from "jssha";
import { compile } from "ejs";

// Initialise DB connection
const { Pool } = pg;
const pgConnectionConfigs = {
  user: "regina",
  host: "localhost",
  database: "birding",
  port: 5432, // Postgres server always runs on this port by default
};
const pool = new Pool(pgConnectionConfigs);

const app = express();
app.use(express.static("public"));
// Configure Express to parse request body data into request.body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

const port = 3004;

// Set view engine
app.set("view engine", "ejs");

// Override POST requests with query param ?_method=PUT to be PUT requests
app.use(methodOverride("_method"));




database_func()

async function database_func() {
  // You should be doing callbacks OR async/await whenever you call a query,
  // You're doing both at the same time

  pool.query(`SELECT * FROM notes;`, (err,res) => {
    console.log('res', res.rows)
    return;
  })

  // OR

  let res;
  try {
    res = await pool.query(`SELECT * FROM notes_behaviour;`);
  } catch (err) {
    console.error(err);
  }

  console.log('happy', res.rows);
  
  
  
  console.log('after res')
}