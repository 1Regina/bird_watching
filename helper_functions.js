// import pg from "pg";
// // Initialise DB connection
// const { Pool } = pg;
// const pgConnectionConfigs = {
//   user: "regina",
//   host: "localhost",
//   database: "birding2",
//   port: 5432, // Postgres server always runs on this port by default
// };
// const pool = new Pool(pgConnectionConfigs);
import { pool } from "./db_config.js";

const whenQueryDone = (error, result) => {
  // this error is anything that goes wrong with the query
  if (error) {
    console.log("Error executing query", error.stack);
    return;
  } else if (result.rows.length === 0) {
    console.log("empty results!");
    return;
  }
};

const compileByMembership = (searchQuery, ejs, request, response) => {
  let sqlQuery = "";
  pool.query(searchQuery, (error, result) => {
    whenQueryDone(error, result);
    let everyData = result.rows;
    console.log(`wwwwwwwwwwwww`, everyData);
    // console.log(`SIZE123..`, everyData.length, everyData)

    const combineActionObj = {};
    everyData.forEach((item) => {
      if (combineActionObj["note_" + item.notes_id]) {
        combineActionObj["note_" + item.notes_id].action.push(item.action);
      } else {
        // new object
        const { notes_id, ...newItem } = item;
        newItem.action = [newItem.action]; // make it an array
        combineActionObj["note_" + item.notes_id] = newItem;
      }
    });

    let arrayOfObjects = Object.keys(combineActionObj).map((key) => {
      let ar = combineActionObj[key];

      // Apppend key if one exists (optional)
      ar.key = key;

      return ar;
    });
    // console.log(`iiiiiiiiiiiiii`, arrayOfObjects);

    let data = arrayOfObjects;
    // console.log(`array of object`, data)

    let index;
    if (request.cookies.loggedIn === "true") {
      const { userEmail } = request.cookies;
      sqlQuery = `SELECT * FROM users WHERE email = '${userEmail}'`;
      pool.query(sqlQuery, (erroring, resulting) => {
        whenQueryDone(erroring, resulting);
        index = resulting.rows[0].id;
        // console.log(`aaaaaaaaaaa`, index);
        response.render(ejs, { data, idx: index });
      });
    } else {
      index = 0;
      response.render(ejs, { data, idx: index });
    }
  });
};



const summarizeItemIntoObj = (everyData) => {
    const combineActionObj = {};
    everyData.forEach((item) => {
      if (combineActionObj["note_" + item.notes_id]) {
        combineActionObj["note_" + item.notes_id].action.push(item.action);
      } else {
        // new object
        const { notes_id, ...newItem } = item;
        newItem.action = [newItem.action]; // make it an array
        combineActionObj["note_" + item.notes_id] = newItem;
      }
    });
    let arrayOfObjects = Object.keys(combineActionObj).map((key) => {
      let ar = combineActionObj[key];

      // Apppend key if one exists (optional)
      ar.key = key;

      return ar;
    });

    let details = arrayOfObjects[0];
    console.log(`sssssssssss`, details)
    return details
  }


const summarizeManyItemsIntoObj = (everyData) => {
    const combineActionObj = {};
    everyData.forEach((item) => {
      if (combineActionObj["note_" + item.notes_id]) {
        combineActionObj["note_" + item.notes_id].action.push(item.action);
      } else {
        // new object
        const { notes_id, ...newItem } = item;
        newItem.action = [newItem.action]; // make it an array
        combineActionObj["note_" + item.notes_id] = newItem;
      }
    });
    let arrayOfObjects = Object.keys(combineActionObj).map((key) => {
      let ar = combineActionObj[key];

      // Apppend key if one exists (optional)
      ar.key = key;

      return ar;
    });

    let details = arrayOfObjects;
    return details
  }

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

export { whenQueryDone, compileByMembership, summarizeItemIntoObj, summarizeManyItemsIntoObj, dynamicAscSort, dynamicDescSort };
