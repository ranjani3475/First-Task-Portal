// src/config/db.js
const mysql = require("mysql2/promise");

let dbConfig = {
  host: "localhost",
  user: "root",
  password: "Madhan65@",
  database: "mini",
  waitForConnections: true,
  connectionLimit: 60,
  queueLimit: 0,
  connectTimeout: 60000,
};
async function initializePool() {
  let pool = mysql.createPool(dbConfig);
  return pool;
}
async function readPool() {
  let pool = mysql.createPool(dbConfig);
  return pool;
}
async function writePool() {
  let pool = mysql.createPool(dbConfig);
  return pool;
}
module.exports = {
  initializePool: initializePool,
  mysql: mysql,
  dbConfig: dbConfig,
  readPool: readPool,
  writePool: writePool,
};
