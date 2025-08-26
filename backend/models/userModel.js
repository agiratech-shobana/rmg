
// At the top of your file, require the new promise-based pool from db.js
const dbPool = require("../db");

/**
 * Checks if a user exists by their OID. If not, it creates them.
 * This version uses the modern async/await syntax.
 */
async function createUserIfNotExists(oid, name, email) {
  try {
    // 1. Check if the user already exists
    const checkQuery = "SELECT * FROM users WHERE oid = ?";
    
    // "await" pauses the function until the database responds.
    // The [results] syntax neatly grabs the data rows from the response.
    const [results] = await dbPool.query(checkQuery, [oid]);

    // 2. If the user exists, return their data immediately
    if (results.length > 0) {
      console.log("ℹ️ User already exists, returning existing data.");
      return results[0];
    }

    // 3. If the user does not exist, insert a new record
    console.log("-> User not found, inserting new user...");
    const insertQuery = "INSERT INTO users (oid, name, email) VALUES (?, ?, ?)";
    
    // "await" the insert query. `result` will contain info like the new insertId.
    const [result] = await dbPool.query(insertQuery, [oid, name, email]);

    console.log("✅ New user inserted into DB.");
    // 4. Return the newly created user's data
    return { id: result.insertId, oid, name, email };

  } catch (error) {
    // If any of the 'await' calls fail, the error is caught here.
    console.error("❌ Error in createUserIfNotExists:", error);
    // Re-throw the error so the calling function knows something went wrong.
    throw error;
  }
}

module.exports = { createUserIfNotExists };