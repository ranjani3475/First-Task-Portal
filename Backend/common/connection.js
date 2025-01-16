"use strict";
const { initializePool, readPool, writePool } = require("./db");

async function poolExecuteCommand(
  sql,
  values,
  commit = true,
  connectionObj = null
) {
  let connection;
  try {
    const trimmedQuery = sql.trim();
    const isSelectQuery = /^SELECT/i.test(trimmedQuery);
    const isWithQuery = /^WITH/i.test(trimmedQuery);
    if (!connectionObj) {
      let pool = await initializePool();
      if (isSelectQuery || isWithQuery) {
        pool = await readPool();
      } else {
        pool = await writePool();
      }
      connection = await pool.getConnection();
      await connection.beginTransaction();
    } else {
      connection = connectionObj;
    }
    const [results] = await connection.execute(sql, values);

    if (!isSelectQuery && commit && !isWithQuery) {
      await connection.commit();
    }

    return { success: true, results: results, error: null };
  } catch (error) {
    console.error("Database transaction error:", error);
    if (connection) {
      try {
        const trimmedQuery = sql.trim();
        const isSelectQuery = /^SELECT/i.test(trimmedQuery);
        const isWithQuery = /^WITH/i.test(trimmedQuery);

        if (!isSelectQuery && commit && !isWithQuery) {
          await connection.rollback();
        }
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }
    return { success: false, error: error.message };
  } finally {
    if (connection && !connectionObj) {
      console.log("connection released...");
      connection.release();
    }
  }
}

async function beginTransaction(connection) {
  await connection.beginTransaction();
}

async function commitTransaction(connection) {
  await connection.commit();
}

async function rollbackTransaction(connection) {
  await connection.rollback();
}

module.exports = {
  poolExecuteCommand,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
};
