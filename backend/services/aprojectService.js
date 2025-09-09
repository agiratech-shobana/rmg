



const cron = require("node-cron");
const { fetchAll } = require('../utils/apiClient');
const pool = require('../db'); // Assuming this file exists and exports a connection

let cachedUsers = [];
let cachedRoles = [];

async function updateUsersAndRolesCache() {
  try {
    console.log(" Cron job: Fetching latest users and roles...");
    
    // Fetch both users and roles from the API
    const rawUsers = await fetchAll("users.json");
    const rawRoles = await fetchAll("roles.json");

    // Process and cache users
    cachedUsers = rawUsers.map(u => ({ 
      id: u.id, 
      name: u.firstname + (u.lastname ? ` ${u.lastname}` : ""), 
      email: u.mail
    }));
    
    // Process and cache roles
    cachedRoles = rawRoles.map(r => ({ id: r.id, name: r.name }));

    // DB insertion logic (make sure 'db' connection is working)
    // for (const user of cachedUsers) {
    //   db.query(
    //     "INSERT INTO employees (id, name, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email)",
    //     [user.id, user.name, user.email],
    //     (err) => {
    //       if (err) console.error(" DB insert error:", err);
    //     }
    //   );
    // }

       for (const user of cachedUsers) {
      try {
        await pool.query(
          "INSERT INTO employees (id, name, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email)",
          [user.id, user.name, user.email]
        );
      } catch (err) {
        console.error(" DB insert error:", err.message);
      }
    }

    console.log(` Updated users cache: ${cachedUsers.length} users`);
    console.log(` Updated roles cache: ${cachedRoles.length} roles`);
  } catch (err) {
    console.error(" Failed to update cache:", err);
  }
}

cron.schedule("0 */2 * * *", updateUsersAndRolesCache);
updateUsersAndRolesCache();

module.exports = {
  getCachedUsers: () => cachedUsers,
  getCachedRoles: () => cachedRoles,
  updateUsersAndRolesCache,
};


