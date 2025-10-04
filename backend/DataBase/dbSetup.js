import mysql from "mysql2/promise";
import dotenv from "dotenv";
import initDB from "./initDB.js";

dotenv.config();

async function setup() {
  await initDB();

  //Connect to the database
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  // Create table named "task" if not exists
  // pool is used for resuable connection
  // It has Performance, concurrency, and DB resource management.
  // Hence we dont have to initalize db connection again & again.
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS task (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Table 'task' is ready");
  return pool;
}

export default setup;
