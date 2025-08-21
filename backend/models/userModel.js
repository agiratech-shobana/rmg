


const db = require("../db");

function createUserIfNotExists(oid, name, email) {
  return new Promise((resolve, reject) => {
    const checkQuery = "SELECT * FROM users WHERE oid = ?";
    db.query(checkQuery, [oid], (err, results) => {
      if (err) return reject(err);

      if (results.length > 0) {
        console.log("ℹ️ User already exists, skipping insert.");
        return resolve(results[0]);
      }

      const insertQuery =
        "INSERT INTO users (oid, name, email) VALUES (?, ?, ?)";
      db.query(insertQuery, [oid, name, email], (err, result) => {
        if (err) return reject(err);
        console.log("✅ New user inserted into DB");
        resolve({ id: result.insertId, oid, name, email });
      });
    });
  });
}

module.exports = { createUserIfNotExists };
