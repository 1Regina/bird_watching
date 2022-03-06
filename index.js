import express from 'express';
import read, {add} from './jsonFileStorage.js';
import methodOverride from 'method-override';
import pg from 'pg';
import e from 'express';

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
const whenQueryDone = (error, result) => {
    // this error is anything that goes wrong with the query
    if (error) {
      console.log('error', error);
      
    } else if (result.rows.length <= 0) {
      console.log('no results!');
      return;
    } else {
      // rows key has the data
      // Basic
      console.log(`report results`, result.rows);
    }
};

let sqlQuery = '';
// -------------BASE Enter data easily at start
if (command === 'log') {
  console.log(`inputData array`, inputData)
  sqlQuery = 'INSERT INTO notes (behaviour, flock_size) VALUES ($1, $2);';
  pool.query(sqlQuery, inputData, whenQueryDone);
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
  pool.query(insertDatesText, whenQueryDone);
}

// REPORT
if (command === "report") { 
  const sqlQuery= `SELECT * FROM notes;`;
  pool.query(sqlQuery, whenQueryDone);
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
  let index = request.params
  console.log(`request is index`, index)
  let singleQuery = `SELECT * from notes WHERE id = ${index.id};`
  console.log(`Single Query`, singleQuery)
    // Query using pg.Pool instead of pg.Client
    pool.query(`SELECT * from notes WHERE id = ${index.id};`, (error, queryResult) => {
      if (error) {
        console.log('Error executing query', error);
      };
    console.log(`queryResult`, queryResult) 
    let details = queryResult.rows[0]
    console.log(`details are`, details)
  
 
   // put in an object so can use the key-value
    response.render(`single_note`, {details:details, ind:index});
  });

});

// NEW SIGHTING PAGE
app.get('/note', (request, response) => {
  response.render('new_note');
});

// Save new sighting data sent via POST request from our form
app.post('/note',(request, response) => {
  console.log(`before add sighting`)
  let date = new Date(request.body.DATE).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-');
  console.log(`type of Date input before SQL input`, typeof date)
  let behaviour = request.body.BEHAVIOUR;
  let flock_size = request.body.FLOCK_SIZE;
  const formData = [date, behaviour, flock_size]

  let entryQuery = 'INSERT INTO notes (date, behaviour, flock_size) VALUES ($1, $2, $3) returning id;';
  pool.query(entryQuery, formData, (entryError, entryResult) => {
    if (entryError) {
      console.log('error', entryError);
    } else {
      console.log('note id:', entryResult.rows);
      const noteId = entryResult.rows[0].id;
      console.log(noteId);
      response.redirect(`/note/${noteId}`);
    }  

      // redirect to display new recording
      // let sqlQueryNext = 'SELECT * FROM notes WHERE id = id;'
      
      // pool.query(sqlQueryNext, (queryError, queryresult) => {
      // if (queryError) {
      // console.log('Error executing query', queryError.stack);
      // response.status(503).send(queryresult.rows);
      // return;
      // } else {
      // console.log(` the new report results`, queryresult.rows);
      // }
      // let details = queryresult.rows[0];
      // let ind = details.id;
      // console.log(`the new entry is`, details);
      // response.redirect(`/note/${ind}`);
      // // response.send("it works")
      // })    
  });
});

// EDIT FORM
// Display the sighting to edit
app.get('/note/:index/edit', (req,res) =>{
  const {index} = req.params
  sqlQuery = `SELECT * FROM notes WHERE id = ${index};`
  pool.query()

 read(`data.json`, (error, jsonObjContent) => {
  if (error) {
   console.error(`read error`, error);
   return;
   }
  const {index} = req.params // req.params is an object..destructuring
  console.log(`type of req.params`, typeof req.params)
  console.log(req.params)
  console.log(`type of index`, typeof index)
  console.log(index)
  const oneSighting = jsonObjContent.sightings[index];
  oneSighting.index = index
  const details = {oneSighting}
  console.log(`details`, details);
  res.render(`editForm`, details);
  });
});
// set port to listen
app.listen(port)