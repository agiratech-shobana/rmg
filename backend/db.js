
// import mysql from "mysql2";

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root", // change if needed
//   password: "Root@1234", // your password
//   database: "rmg", // change to your DB name
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err);
//     return;
//   }
//   console.log("✅ Connected to MySQL Database");
// });

// export default db;





const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // change if needed
  password: "Root@1234", // your password
  database: "rmg",    // change to your DB name
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

module.exports = db;












// db.js
// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Root@1234",
//   database: "rmg",
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err);
//     return;
//   }
//   console.log("✅ Connected to MySQL Database");
// });

// module.exports = db;  // <-- export as CommonJS
