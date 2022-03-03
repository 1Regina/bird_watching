import express from 'express';
import read, {add} from './jsonFileStorage.js';
import methodOverride from 'method-override';
import pg from 'pg';

// Initialise DB connection
const { Pool } = pg;
const pgConnectionConfigs = {
  user: 'regina',
  host: 'localhost',
  database: 'birding',
  port: 5432, // Postgres server always runs on this port by default
};
const pool = new Pool(pgConnectionConfigs);

const app = express();
app.use(express.static('public'));
// Configure Express to parse request body data into request.body
app.use(express.urlencoded({ extended: false }));

const port = 3004

// Set view engine
app.set('view engine', 'ejs');

// Override POST requests with query param ?_method=PUT to be PUT requests
app.use(methodOverride('_method'));

// INSERT VALUES
const command = process.argv[2]
const inputData = process.argv.slice(3,5);

app.get('/', (request, response) => {
  console.log('request came in');

  const whenDoneWithQuery = (error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send(result.rows);
      return;
    }
    console.log(result.rows[0].behaviour);
    response.send(result.rows);
  };

    // Query using pg.Pool instead of pg.Client
    pool.query('SELECT * from notes', whenDoneWithQuery);
});

// General callback
const whenInsertQueryDone = (error, result) => {
    // this error is anything that goes wrong with the query
    if (error) {
      console.log('error', error);
    } else {
      // rows key has the data
      // Basic
      console.log(`report results`, result.rows);
    }
};

let sqlQuery = '';
// -------------BASE Enter a meal
if (command === 'log') {
  console.log(`inputData array`, inputData)
  sqlQuery = 'INSERT INTO notes (behaviour, flock_size) VALUES ($1, $2)';
  pool.query(sqlQuery, inputData, whenInsertQueryDone);
}

// INSERT DATE
if (command === "insertDate") { 
  // insert the current time into it
  // ############ Method A: Current DATE ############
  // const now = new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
  // ############ Method B: SPECIFY DATE ############
  const now = new Date('2022-03-04T12:00:00Z').toLocaleString("en-US", {timeZone: "America/New_York"})
  console.log(`process.agrv[3]`, typeof process.argv[3], process.argv[3])
  // USE edit to populate the table
  const insertDatesText = `UPDATE notes SET date = '${now}' WHERE id = ${process.argv[3]}`;
  pool.query(insertDatesText, whenInsertQueryDone);
}


// set port to listen
app.listen(port)