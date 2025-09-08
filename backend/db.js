





// backend/db.js

// By requiring 'mysql2/promise', we get an object that supports BOTH
// modern async/await AND old-style callbacks.
const mysql = require("mysql2/promise");

// A "Pool" is much better for a web server than a single "Connection".
// It manages multiple connections efficiently.
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Root@1234", // your password
  database: "rmg",      // your DB name
  waitForConnections: true,
  connectionLimit: 10,  // Standard setting for a pool
  queueLimit: 0
});

console.log(" Connected to MySQL Database (Pool supports both Promises and Callbacks).");

// Export the pool. Any code can now use this.
module.exports = pool;





