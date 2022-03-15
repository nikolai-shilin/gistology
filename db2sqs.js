require("dotenv").config({ path: "./.env" });

const { Pool } = require("pg");
const sizeof = require('object-sizeof');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function query(query, params) {
  const { rows, fields } = await pool.query(query);
  return rows;
}

query('SELECT id, token FROM ws_worksheet LIMIT 100000')
    .then((data) => {
        const sizeofData = sizeof(data);
        console.log(`size of the array of {id, token} worksheet objects: ${sizeofData} bytes with ${data.length} records: ${sizeofData/data.length} bytes/record.`);
    })
    .then((error) => {
        console.log(error);
    });

// 2700901 worksheets today
// what fields do we need to create a screenshot? id, token?
// size of the array of {id, token} worksheet objects: 4599952 bytes with 100000 records: 45.99952 bytes/record.

