import express from 'express';
// import read, {add} from './jsonFileStorage.js';
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
      // console.log('Error executing query', error.stack);
      console.log('Error executing query', error);
      // response.status(503).send(result.rows);
      return;
    }
    // console.log(result.rows[0].behaviour);
    // response.send(result.rows);
    let data = result.rows
    // put in an object so can use the key-value
    response.render(`listing`, {data});
  };

    // Query using pg.Pool instead of pg.Client
    pool.query('SELECT * FROM notes ORDER BY id;', whenDoneWithQuery);
});

// SINGLE SIGHTING PAGE
app.get('/note/:id', (request, response) => {
  console.log('request came in');
  let index = request.params.id
  console.log(`request is index`, index)
  let singleQuery = `SELECT * from notes WHERE id = ${index};`
  console.log(`Single Query`, singleQuery)
    // Query using pg.Pool instead of pg.Client
    pool.query(`SELECT * from notes WHERE id = ${index};`, (error, queryResult) => {
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
  const {index} = req.params // req.params is an object..destructuring
  sqlQuery = `SELECT * FROM notes WHERE id = '${index}';`
  console.log('sql statement', sqlQuery)
  pool.query(sqlQuery,(error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      // response.status(503).send(result.rows);
      // return;
    }
    const oneNote = result.rows[0];
    const details = {oneNote};
   
    console.log(`details`, details);
    res.render(`editForm`, {oneNote});
  })
});

app.put('/note/:index_a/edit', (req,res) =>{
  const {index_a} = req.params;
  console.log(`index is`, index_a)
  console.log(`the form entire info`, req.body)

  // UPDATE 
  let newData = req.body

  sqlQuery = `UPDATE notes SET date = '${newData.date}', behaviour = '${newData.behaviour}', flock_size = '${newData.flock_size}' WHERE id = '${index_a}';` 
  console.log(`the query is `, sqlQuery)
  pool.query(sqlQuery, whenQueryDone)

  // extract data to display 
  
  let details = newData

  res.render (`single_note`, {details, ind: index_a});
})


app.delete('/note/:index/delete', (request, response) => {
  console.log(`aaaaaaaaaaaa`)
  const { index } = request.params;
  sqlQuery = `DELETE FROM notes WHERE id = ${index}`
  console.log(`The query to delete`, sqlQuery)
  pool.query(sqlQuery, (err, results) => {
    if (err) {
      console.log(`Check your query again`)
    }

  })
  response.send("Delete Succesfully")
});


// method 2: better. sort listing by chosen parameter
function dynamicAscSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
function dynamicDescSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? 1 : (a[property] > b[property]) ? -1 : 0;
        return result * sortOrder;
    }
}

// sort function sort date, city and flock_size for the opening listing summary page at Main page
const sortSummary = (req, res) => {
 
  sqlQuery = `SELECT * FROM notes ORDER BY id ASC;`;
  pool.query(sqlQuery, (queryError, queryResult) => {
    if (queryError) {
      console.log('Error executing query', error.stack);
      response.status(503).send(queryResult.rows);
      return;
    } 
    if (queryResult.rows.length === 0) {
      response.status(403).send('no records!');
      return;
    }
    let data = queryResult.rows
    console.log(`results before sorting which is all is`, data)
  

  if (req.params.parameter==="date") {
    const ascFn = (a,b)=> new Date(a.date) - new Date(b.date)
    const descFn = (a,b)=> new Date(b.date) - new Date(a.date)
    // sorting condition
    data.sort(
      req.params.sortHow === `asc` ? ascFn : descFn  
      )
  } else if (req.params.parameter==="behaviour") {
  // const ascFn  = (a,b)=> {(String(a.behaviour).replace(/ /g, "_").toUpperCase()) >  (String(b.behaviour).replace(/ /g, "_").toUpperCase()) ? 1 : -1}
  // const descFn = (a,b)=> {(String(a.behaviour).replace(/ /g, "_").toUpperCase()) <  (String(b.behaviour).replace(/ /g, "_").toUpperCase()) ? 1 : -1}

    // sorting condition
    data.sort(
      req.params.sortHow === `asc` ? dynamicAscSort("behaviour") : dynamicDescSort("behaviour") 
    )
  } else if (req.params.parameter==="flock_size") {

    // sorting condition
    data.sort(
      req.params.sortHow === `asc` ? dynamicAscSort("flock_size") : dynamicDescSort("flock_size") 
      )
  }  
  res.render(`listing`, {data})
  })
}
app.get(`/notes-sortby/:parameter/:sortHow`, sortSummary)
// set port to listen
app.listen(port)


