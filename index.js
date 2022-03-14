import express from "express";
// import read, {add} from './jsonFileStorage.js';
import methodOverride from "method-override";
import pg from "pg";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import jsSHA from "jssha";

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

// ====== POSTGRESQL
// INSERT VALUES
const command = process.argv[2];
const inputData = process.argv.slice(3, 5);

// General callback
const whenQueryDone = (error, result) => {
  // this error is anything that goes wrong with the query
  if (error) {
    console.log("Error executing query", error.stack);
    return;
  } else if (result.rows.length === 0) {
    console.log("login failed!");
    return;
  }
};

let sqlQuery = "";
// -------------BASE Enter data easily at start
if (command === "log") {
  console.log(`inputData array`, inputData);
  sqlQuery = "INSERT INTO notes (behaviour, flock_size) VALUES ($1, $2);";
  pool.query(sqlQuery, inputData, whenQueryDone);
}

// INSERT DATE
if (command === "insertDate") {
  // insert the current time into it
  // ############ Method A: Current DATE ############
  // const now = new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
  // ############ Method B: SPECIFY DATE ############
  const now = new Date("2022-03-04T12:00:00Z").toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  console.log(`process.agrv[3]`, typeof process.argv[3], process.argv[3]);
  // USE edit to populate the table
  const insertDatesText = `UPDATE notes SET date = '${now}' WHERE id = ${process.argv[3]};`;
  pool.query(insertDatesText, (error, results) => {
    whenQueryDone(error, results);
  });
}

// REPORT
if (command === "report") {
  const sqlQuery = `SELECT * FROM notes;`;
  pool.query(sqlQuery, (error, result) => {
    whenQueryDone(error, result);
    console.log(result.rows);
  });
}

// ====== EJS
// MAIN PAGE
// app.get("/", (request, response) => {
//   console.log("request came in");

//   let searchQuery = `SELECT notes.id, notes.date, notes.behaviour, notes.flock_size, creator_id, species,
//                             users.id AS user_id, user_name
//                      FROM notes
//                      INNER JOIN users
//                      ON creator_id = users.id
//                      ORDER BY notes.id;`;
//   pool.query(searchQuery, (error, result) => {
//     if (error) {
//       // console.log('Error executing query', error.stack);
//       console.log("Error executing query", error);
//       // response.status(503).send(result.rows);
//       return;
//     }
//     let data = result.rows;

//     // console.log(data)

//     //   // https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
//     // if (request.cookies === null) {
//     //   console.log('qqqqqqqqqqqqqqqqqq')
//     //   data = [{ user_name: "Visitor" }]
//     //   response.render(`listing`, {data, loggerName: ""});

//     // } else if (request.cookies.loggedIn === true)  {

//     if (request.cookies.loggedIn === "true") {
//       // use cookie to find member name

//       // / SHOW MEMBER NAME
//       const { userEmail } = request.cookies;
//       console.log(`aaaaaaaaaaaaaaaaacookie of user`, request.cookies);
//       let findCookieUserQuery = `SELECT notes.id, notes.date, notes.behaviour, notes.flock_size, creator_id,        species,
//                             users.id AS user_id, user_name
//                      FROM notes
//                      INNER JOIN users
//                      ON creator_id = users.id
//                      ORDER BY notes.id
//                       WHERE user_name = '${userEmail}';`;
//       pool.query(findCookieUserQuery, (cookieErr, cookieResult) => {
//         whenQueryDone(cookieErr, cookieResult);
//         console.log(cookieResult.rows);
//         console.log(`aaaaaaaaaaaa`, cookieResult.rows[0].user_name);
//         let name = cookieResult.rows[0].user_name;
//         data = cookieResult.rows;
//         response.render(`listing_user`, { data, loggerName: name });
//       });
//     } else {
//       // https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client

//       console.log("qqqqqqqqqqqqqqqqqq");
//       data = [{ user_name: "Visitor" }];
//       response.render(`listing_user`, { data, loggerName: "" });

//       //   response.render(`listing`, {data});
//     }
//   });
// });
app.get("/", (request, response) => {
  console.log("request came in");
  let searchQuery = `SELECT notes.id, notes.date, notes.behaviour, notes.flock_size, creator_id, species,
                            users.id AS user_id, user_name
                     FROM notes
                     INNER JOIN users
                     ON creator_id = users.id
                     ORDER BY notes.id;`;
  pool.query(searchQuery, (error, result) => {
    if (error) {
      // console.log('Error executing query', error.stack);
      console.log("Error executing query", error);
      // response.status(503).send(result.rows);
      return;
    }
    let data = result.rows;
    response.render(`listing`, { data });
  });
});

// SINGLE SIGHTING PAGE
app.get("/note/:id", (request, response) => {
  console.log("request came in");
  let index = request.params.id;
  console.log(`request is index`, index);
  let singleQuery = `SELECT * from notes WHERE id = ${index};`;
  console.log(`Single Query`, singleQuery);
  // Query using pg.Pool instead of pg.Client
  pool.query(
    `SELECT * from notes WHERE id = ${index};`,
    (error, queryResult) => {
      if (error) {
        console.log("Error executing query", error);
      }
      // console.log(`queryResult`, queryResult.rows)
      let details = queryResult.rows[0];
      console.log(`details are`, details);

      // put in an object so can use the key-value
      response.render(`single_note`, { details: details, ind: index });
    }
  );
});

// NEW SIGHTING PAGE
app.get("/note", (request, response) => {
  if (request.cookies.loggedIn === "true") {
    pool.query(`SELECT * FROM species`, (error, result) => {
      whenQueryDone(error, result);
      const birds = {
        birdName: result.rows,
      };

      pool.query(`SELECT * FROM behaviours`, (erroring, resulting) => {
        whenQueryDone(erroring, resulting);
        birds.behaves = resulting.rows;
        console.log(birds);
        response.render("new_note", birds);
      });

      // response.render('new_note', birds);
    });
  } else {
    response.send(`You need to login first`);
  }
});

// Save new sighting data sent via POST request from our form
app.post("/note", (request, response) => {
  console.log(`before add sighting`);
  let date = new Date(request.body.DATE)
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");
  console.log(`type of Date input before SQL input`, typeof date);
  const behaviour = request.body.BEHAVING;
  const flock_size = request.body.FLOCK_SIZE;
  const species = request.body.SPECIES;
  // let cookieUser = request.cookies.user
  // console.log(`aaaaaaaaaaaaaaaaaaaaaacookieUser`, cookieUser)
  const { userEmail } = request.cookies;
  // console.log(`aaaaaaaaaaaaaaaaacookie of user`, user)

  let creator_id;
  let findCookieUserQuery = `SELECT * FROM users WHERE email = '${userEmail}';`;
  pool.query(findCookieUserQuery, (cookieErr, cookieResult) => {
    whenQueryDone(cookieErr, cookieResult);
    // console.log(`xxxxxxxxxx`, cookieResult.rows[0])
    creator_id = cookieResult.rows[0].id;
    // console.log(`creator id from query`, creator_id)
    const formData = [date, behaviour, flock_size, creator_id, species];
    let entryQuery = `INSERT INTO notes (date, behaviour, flock_size , creator_id, species) 
                                 VALUES ($1, $2, $3 , $4, $5) 
                                 RETURNING id;`;
    pool.query(entryQuery, formData, (entryError, entryResult) => {
      if (entryError) {
        console.log("error", entryError);
      } else {
        const noteId = entryResult.rows[0].id;
        console.log(noteId);
        response.redirect(`/note/${noteId}`);
      }
    });
  });
});

// EDIT FORM
app.get("/note/:index/edit", (req, res) => {
  const { index } = req.params; // req.params is an object..destructuring
  const { userEmail, loggedIn } = req.cookies;
  if (loggedIn === "true") {
    sqlQuery = `SELECT date, behaviour, flock_size, species, email, notes.id
                FROM users
                INNER JOIN notes 
                ON notes.creator_id = users.id
                WHERE notes.id = ${index} ;`;
    pool.query(sqlQuery, (error, result) => {
      whenQueryDone(error, result);
      let oneNote = result.rows[0];
      let details = { oneNote };
      if (userEmail === oneNote.email){
        let speciesQuery = `SELECT * FROM species`;
        pool.query(speciesQuery, (error1, result1) => {
          whenQueryDone(error1, result1);
          let birds = result1.rows;
          console.log(`aaaaaaaa`, birds)
          details.birdName = birds;
        res.render(`editForm`, details);
        })
      } else {
        res.send("You are not authorised to edit this post.");
      }
    });
  } else {
    res.send("You need to login in. Return to home page http://localhost:3004");
  }
});

app.put("/note/:index_a/edit", (req, res) => {
  const { index_a } = req.params;
  console.log(`index is`, index_a);
  console.log(`the form entire info`, req.body);

  // UPDATE
  let newData = req.body;

  sqlQuery = `UPDATE notes SET date = '${newData.date}', behaviour = '${newData.behaviour}', flock_size = '${newData.flock_size}', species = '${newData.species}' WHERE id = '${index_a}';`;
  console.log(`the query is `, sqlQuery);
  pool.query(sqlQuery, (error, results) => {
    whenQueryDone(error, results);
  });

  // extract data to display

  let details = newData;

  res.render(`single_note`, { details, ind: index_a });
});

app.delete("/note/:index/delete", (request, response) => {
  console.log(`aaaaaaaaaaaa`);
  const { index } = request.params;
  sqlQuery = `DELETE FROM notes WHERE id = ${index}`;
  console.log(`The query to delete`, sqlQuery);
  pool.query(sqlQuery, (err, results) => {
    if (err) {
      console.log(`Check your query again`);
    }
  });
  response.send("Delete Succesfully");
});

// method 2: better. sort listing by chosen parameter
function dynamicAscSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
function dynamicDescSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? 1 : a[property] > b[property] ? -1 : 0;
    return result * sortOrder;
  };
}

// sort function sort date, city and flock_size for the opening listing summary page at Main page
const sortSummary = (req, res) => {
  sqlQuery = `SELECT * FROM notes ORDER BY id ASC;`;
  pool.query(sqlQuery, (queryError, queryResult) => {
    if (queryError) {
      console.log("Error executing query", error.stack);
      response.status(503).send(queryResult.rows);
      return;
    }
    if (queryResult.rows.length === 0) {
      response.status(403).send("no records!");
      return;
    }
    let data = queryResult.rows;
    console.log(`results before sorting which is all is`, data);

    if (req.params.parameter === "date") {
      const ascFn = (a, b) => new Date(a.date) - new Date(b.date);
      const descFn = (a, b) => new Date(b.date) - new Date(a.date);
      // sorting condition
      data.sort(req.params.sortHow === `asc` ? ascFn : descFn);
    } else if (req.params.parameter === "behaviour") {
      // const ascFn  = (a,b)=> {(String(a.behaviour).replace(/ /g, "_").toUpperCase()) >  (String(b.behaviour).replace(/ /g, "_").toUpperCase()) ? 1 : -1}
      // const descFn = (a,b)=> {(String(a.behaviour).replace(/ /g, "_").toUpperCase()) <  (String(b.behaviour).replace(/ /g, "_").toUpperCase()) ? 1 : -1}

      // sorting condition
      data.sort(
        req.params.sortHow === `asc`
          ? dynamicAscSort("behaviour")
          : dynamicDescSort("behaviour")
      );
    } else if (req.params.parameter === "flock_size") {
      // sorting condition
      data.sort(
        req.params.sortHow === `asc`
          ? dynamicAscSort("flock_size")
          : dynamicDescSort("flock_size")
      );
    }
    res.render(`listing`, { data });
  });
};
app.get(`/notes-sortby/:parameter/:sortHow`, sortSummary);

//3 POCE6 User Auth
app.get("/signup", (request, response) => {
  response.render("signup");
});

app.post("/signup", (request, response) => {
  // initialise the SHA object
  const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
  // input the password from the request to the SHA object
  shaObj.update(request.body.password);
  // get the hashed password as output from the SHA object
  const hashedPassword = shaObj.getHash("HEX");

  // store the hashed password in our DB
  const values = [request.body.name, request.body.email, hashedPassword];
  console.log(`values to post`, values);
  pool.query(
    "INSERT INTO users (user_name,email,password) VALUES ($1, $2, $3)",
    values,
    (error, result) => {
      whenQueryDone(error, result);
      const email = values[0];
      return response.send(`User added : ${email}`);
    }
  );
});

app.get("/login", (request, response) => {
  response.render("loginForm");
});

app.post("/login", (request, response) => {
  // retrieve the user entry using their email
  const values = [request.body.email];
  pool.query("SELECT * from users WHERE email=$1", values, (error, result) => {
    // return if there is a query error
    if (error) {
      console.log("Error executing query", error.stack);
      response.status(503).send(result.rows);
      return;
    }

    // we didnt find a user with that email
    if (result.rows.length === 0) {
      // the error for incorrect email and incorrect password are the same for security reasons.
      // This is to prevent detection of whether a user has an account for a given service.
      response.status(403).send("login failed!");
      return;
    }

    // get user record from results
    const user = result.rows[0];
    // initialise SHA object
    const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
    // input the password from the request to the SHA object
    shaObj.update(request.body.password);
    // get the hashed value as output from the SHA object
    const hashedPassword = shaObj.getHash("HEX");

    // If the user's hashed password in the database does not match the hashed input password, login fails
    if (user.password !== hashedPassword) {
      // the error for incorrect email and incorrect password are the same for security reasons.
      // This is to prevent detection of whether a user has an account for a given service.
      response.status(403).send("login failed! Password is incorrect");
      return;
    }

    // The user's password hash matches that in the DB and we authenticate the user.
    // setCookie('user', user.email, 1)
    // response.cookie("userEmail", user.email);
    const d = new Date();
    d.setTime(d.getTime() + 3 * 24 * 60 * 60 * 1000);
    let expires = d.toUTCString();
    response.setHeader("Set-Cookie", [
      `userEmail=${user.email} ; expires=${expires};path=/`,
    ]);
    response.cookie("loggedIn", true);
    response.redirect(`/`);
  });
});

// LOG OUT clear cookie
app.get("/logout", (request, response) => {
  response.clearCookie("userEmail");
  response.clearCookie("loggedIn");
  response.redirect(`/`);
});

// ALTER TABLE OF NOTES
if (command === "addCreatorId") {
  const creatorNote = process.argv.slice(3, 5);
  console.log(creatorNote);
  let insertNotesQuery = `UPDATE notes 
                           SET creator_id = $1 
                           WHERE id = $2;`;
  pool.query(insertNotesQuery, creatorNote, (entryError, entryResult) => {
    whenQueryDone(entryError, entryResult);
    console.log(`post creator id entry`, entryResult.rows);
  });
}

app.get("/users/:id", (req, res) => {
  let user_now = req.params.id;
  let searchQuery = `SELECT notes.id AS notes_id, notes.date, notes.behaviour, notes.flock_size, creator_id,
                            users.id AS user_id, user_name
                     FROM notes 
                     INNER JOIN users  
                     ON creator_id = users.id
                     WHERE creator_id = ${user_now}
                     ORDER BY notes.id;`;
  pool.query(searchQuery, (error, result) => {
    whenQueryDone(error, result);
    let data = result.rows;
    console.log(`zzzzzz `, data);
    res.render(`listing_user`, { data });
  });
});

// ============= 3POCE7
// General info adding
// if (command === "addInfo") {
//   // const addDetails = process.argv.slice(3,6);
//   const [ , , , table, aName, info] = process.argv ;
//   const addDetails = [aName, info];
//   console.log (addDetails)
//   let insertQuery =  `INSERT INTO ${table} (name, scientific_name)
//                       VALUES ($1, $2)
//                       RETURNING *`;
//   pool.query(insertQuery, addDetails, (entryError, entryResult) => {
//     whenQueryDone(entryError, entryResult);
//     console.log(`New entry of record is`, entryResult.rows[0])
//   })
// };

// Render form to enter new species
app.get("/species", (req, res) => {
  if (req.cookies.loggedIn === "true") {
    res.render("new_species");
  } else {
    res.send("Only members can create species.");
  }
});

app.post("/species", (req, res) => {
  let bird = [];
  const { species } = req.body;
  const { scientific_name } = req.body;
  bird.push(species);
  bird.push(scientific_name);
  console.log(bird);
  sqlQuery = `INSERT INTO species (name, scientific_name) 
              VALUES ($1, $2);`;
  pool.query(sqlQuery, bird, (error, result) => {
    whenQueryDone(error, result);
    res.redirect("/species/all");
  });
});

app.get(`/species/all`, (request, res) => {
  sqlQuery = `SELECT species.id AS species_id, name, COUNT(scientific_name)
                FROM species 
                INNER JOIN notes 
                ON notes.species = species.name
                GROUP BY species_id, name`;
  pool.query(sqlQuery, (error, result) => {
    whenQueryDone(error, result);
    let data = result.rows;
    console.log(`sssssss`, data);
    res.render(`species`, { data });
  });
});

app.get(`/species/:index`, (request, response) => {
  const { index } = request.params;
  // sqlQuery = `SELECT name, scientific_name
  //             FROM species
  //             WHERE species.id = ${index}`

  // pool.query(sqlQuery,(error, result) =>{
  //   whenQueryDone(error, result);
  //   let details = result.rows[0]
  //   response.render("single_species", {details:details, ind:index})
  // })

  sqlQuery = `SELECT species.id AS species_id, name, scientific_name, 
                     notes.id, date, behaviour, flock_size, creator_id, species
              FROM species
              INNER JOIN notes
              ON species = name
              WHERE species.id = ${index}`;
  pool.query(sqlQuery, (error, result) => {
    whenQueryDone(error, result);
    let data = result.rows;
    console.log(`aaaaaaaaaa`, data);
    response.render(`listing`, { data });
  });
});

app.get(`/species/:index/edit`, (request, response) => {
  const { index } = request.params;
  sqlQuery = `SELECT * FROM species WHERE id = ${index};`;
  pool.query(sqlQuery, (error, result) => {
    whenQueryDone(error, result);
    const oneNote = result.rows[0];
    const details = { oneNote };
    console.log(details);
    let speciesQuery = `SELECT * FROM species`;
    pool.query(speciesQuery, (error1, result1) => {
      whenQueryDone(error1, result1);
      // const birds = {
      let birds = result1.rows;
      details.birdName = birds;
      // response.render(`editForm`, {details});
      response.render(`editForm_species`, details);
    });
  });
});

app.put(`/species/:index/edit`, (request, response) => {
  const { index } = request.params;
  const data = request.body;
  console.log(`bbbb`, request.body);
  sqlQuery = `UPDATE species 
              SET name = '${data.name}', 
              scientific_name ='${data.scientific_name}' 
              WHERE id = ${index} 
              RETURNING *`;
  pool.query(sqlQuery, (error, result) => {
    whenQueryDone(error, result);
    let details = result.rows[0];
    // response.send(`asdasada`)
    response.render(`single_species`, { details: details, ind: index });
  });
});

app.delete("/species/:index/delete", (request, response) => {
  console.log(`aaaaaaaaaaaa`);
  const { index } = request.params;
  sqlQuery = `DELETE FROM species WHERE id = ${index}`;
  console.log(`The query to delete`, sqlQuery);
  pool.query(sqlQuery, (err, results) => {
    whenQueryDone(err, results);
  });
  response.send("Delete Succesfully");
});

// set port to listen
app.listen(port);
