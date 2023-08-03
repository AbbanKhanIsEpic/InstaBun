const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "102.130.115.69",
  user: "abbank",
  password: "Reddam2021",
  database: "abbankDB",
});

function createConnection() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL server:", err);
        reject(err);
      } else {
        console.log("Connected to MySQL server!");
        resolve();
      }
    });
  });
}

function update(query) {
  connection.query(query, function (err) {
    if (err) throw err;
  });
}

function select(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
        console.error("Error with recieving data:", err);
        reject(err);
      } else {
        console.log("Recieved the data!");
        resolve(result);
      }
    });
  });
}

function endConnection() {
  connection.end((err) => {
    if (err) throw err;
    console.log("Disconnected from MySQL database!");
  });
}

module.exports = { createConnection, update, select, endConnection };
