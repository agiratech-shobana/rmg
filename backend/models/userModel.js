
// At the top of your file, require the new promise-based pool from db.js
const dbPool = require("../db");


async function createUserIfNotExists(oid, name, email) {
  try {
    // 1. Check if the user already exists
    const checkQuery = "SELECT * FROM users WHERE oid = ?";
    
   
    const [results] = await dbPool.query(checkQuery, [oid]);

    if (results.length > 0) {
      console.log("ℹ User already exists, returning existing data.");
      return results[0];
    }

    console.log("-> User not found, inserting new user...");
    const insertQuery = "INSERT INTO users (oid, name, email) VALUES (?, ?, ?)";
    
    const [result] = await dbPool.query(insertQuery, [oid, name, email]);

    console.log(" New user inserted into DB.");
    return { id: result.insertId, oid, name, email };

  } catch (error) {
    console.error(" Error in createUserIfNotExists:", error);
    throw error;
  }
}

module.exports = { createUserIfNotExists };