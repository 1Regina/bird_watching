import express, { request, response } from 'express';
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

// ====== POSTGRESQL
// INSERT VALUES
const command = process.argv[2]
const inputData = process.argv.slice(3,5);

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
  sqlQuery = 'INSERT INTO notes (behaviour, flock_size) VALUES ($1, $2);';
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
  const insertDatesText = `UPDATE notes SET date = '${now}' WHERE id = ${process.argv[3]};`;
  pool.query(insertDatesText, whenInsertQueryDone);
}

// REPORT
if (command === "report") { 
  const sqlQuery= `SELECT * FROM notes;`;
  pool.query(sqlQuery, whenInsertQueryDone);
}

// ====== EJS
// MAIN PAGE
app.get('/', (request, response) => {
  console.log('request came in');

  const whenDoneWithQuery = (error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send(result.rows);
      return;
    }
    // console.log(result.rows[0].behaviour);
    // response.send(result.rows);
    let data = result.rows
    // put in an object so can use the key-value
    response.render(`listing`, {data});
  };

    // Query using pg.Pool instead of pg.Client
    pool.query('SELECT * FROM notes;', whenDoneWithQuery);
});

// SINGLE SIGHTING PAGE
app.get('/note/:id', (request, response) => {
  console.log('request came in');

  const whenDoneWithQuery = (error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send(result.rows);
      return;
    }
    let index = request.query
    let data = result.rows
    let details
    for (let i =0; i< data.length; i+=1) {
      details = data[i]
      console.log(`this is details`, details)
    }
    // put in an object so can use the key-value
    response.render(`single_note`, {details:details, ind:index});
  };

    // Query using pg.Pool instead of pg.Client
    pool.query('SELECT * from notes;', whenDoneWithQuery);
});

// NEW SIGHTING PAGE
app.get('/note', (request, response) => {
  response.render('new_note');
});

// Save new sighting data sent via POST request from our form
app.post('/note',(request, response) => {
  console.log(`before add sighting`)
  let formData = []
  let date = request.body.DATE;
  let behaviour = request.body.BEHAVIOUR;
  let flock_size = request.body.FLOCK_SIZE;
  let details 
  let index
  formData.push(date);
  formData.push(behaviour);
  formData.push(flock_size);
  console.log('formData INPUT are', formData)
  sqlQuery = 'INSERT INTO notes (date, behaviour, flock_size) VALUES ($1, $2, $3);';
  pool.query(sqlQuery, formData, whenInsertQueryDone);

  // redirect to display new recording
  let sqlQueryNext = 'SELECT * FROM notes WHERE (date = ${date}) AND (behaviour = "${behaviour}") AND (flock_size = ${flock_size});'
  pool.query(sqlQueryNext, (error, result)=> {
      if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send(result.rows);
      return;
      } else {
      console.log(` the new report results`, result.rows);
      }
      details = result.rows;
      index = details[0].id;
      console.log(`the new entry is`, details);
      // response.render(`single_note`, {details:details, ind:index});
      response.send("it works")
  });

});

// set port to listen
app.listen(port)