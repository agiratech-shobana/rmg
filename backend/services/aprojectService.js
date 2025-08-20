// const cron = require('node-cron');

// const {
//   APROJECT_BASE_URL,
//   APROJECT_USERNAME,
//   APROJECT_PASSWORD,
// } = process.env;

// if (!APROJECT_BASE_URL || !APROJECT_USERNAME || !APROJECT_PASSWORD) {
//   console.error(" Missing environment variables for API credentials.");
//   process.exit(1);
// }

// const AUTH_HEADER = "Basic " + Buffer.from(`${APROJECT_USERNAME}:${APROJECT_PASSWORD}`).toString("base64");
// let cachedUsers = [];
// async function fetchAll(endpoint) {
//   let allData = [];
//   let offset = 0;
//   const limit = 100;

//   while (true) {
//     const url = `${APROJECT_BASE_URL}/${endpoint}?limit=${limit}&offset=${offset}`;
//     console.log(" Fetching:", url);
//     const res = await fetch(url, { headers: { Authorization: AUTH_HEADER } });
//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error(` Error fetching ${endpoint}: ${res.status} ${res.statusText}`);
//       console.error("Response body:", errorText);
//       throw new Error(`API fetch failed with status ${res.status}: ${errorText}`);
//     }

//     const json = await res.json();
//     const items = json.users || json || [];
//     if (!Array.isArray(items)) {
//       throw new Error(`Expected array but got: ${JSON.stringify(items)}`);
//     }
//     allData = allData.concat(items);
//     if (items.length < limit) break; // no more pages
//     offset += limit;
//   }
//   return allData;
// }

// async function updateUsersCache() {
//   try {
//     console.log("Cron job: Fetching latest users...");
//     const rawUsers = await fetchAll("users.json");
//     cachedUsers = rawUsers.map(u => ({
//       id: u.id,
//       name: u.firstname + (u.lastname ? ` ${u.lastname}` : ""),
//       email: u.mail,
//     }));
//     console.log(`Updated users cache: ${cachedUsers.length} users`);
  
//   } catch (err) {
//     console.error(" Failed to update users cache:", err);
//   }
// }

// // Schedule cache update every 2 hours at minute 0
// cron.schedule('0 */2 * * *', updateUsersCache);

// // Initial cache update on server start
// updateUsersCache();

// function getCachedUsers() {
//   return cachedUsers;
// }

// module.exports = { getCachedUsers };




// services/aprojectService.js


// const {
//   APROJECT_BASE_URL,
//   APROJECT_USERNAME,
//   APROJECT_PASSWORD,
// } = process.env;

// if (!APROJECT_BASE_URL || !APROJECT_USERNAME || !APROJECT_PASSWORD) {
//   console.error("❌ Missing environment variables for API credentials.");
//   process.exit(1);
// }

// const AUTH_HEADER =
//   "Basic " +
//   Buffer.from(`${APROJECT_USERNAME}:${APROJECT_PASSWORD}`).toString("base64");

// let cachedUsers = [];

// async function fetchAll(endpoint) {
//   let allData = [];
//   let offset = 0;
//   const limit = 100;

//   while (true) {
//     const url = `${APROJECT_BASE_URL}/${endpoint}?limit=${limit}&offset=${offset}`;
//     console.log("📡 Fetching:", url);

//     const res = await fetch(url, { headers: { Authorization: AUTH_HEADER } });
//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error(
//         `❌ Error fetching ${endpoint}: ${res.status} ${res.statusText}`
//       );
//       console.error("Response body:", errorText);
//       throw new Error(`API fetch failed with status ${res.status}: ${errorText}`);
//     }

//     const json = await res.json();
//     const items = json.users || json || [];
//     if (!Array.isArray(items)) {
//       throw new Error(`Expected array but got: ${JSON.stringify(items)}`);
//     }

//     allData = allData.concat(items);
//     if (items.length < limit) break;
//     offset += limit;
//   }

//   return allData;
// }

// const cron = require("node-cron");
// const db = require("../db");

// const { fetchAll } = require('../utils/apiClient'); // <--- The key change

// let cachedUsers = [];
// async function updateUsersCache() {
//   try {
//     console.log("🔄 Cron job: Fetching latest users...");
//     const rawUsers = await fetchAll("users.json");

//     cachedUsers = [];

//     for (const u of rawUsers) {
//       const user = {
//         id: u.id,
//         name: u.firstname + (u.lastname ? ` ${u.lastname}` : ""),
//         email: u.mail,
//       };

//       cachedUsers.push(user);

//       // Insert or update into DB
//       db.query(
//         "INSERT INTO employees (id, name, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email)",
//         [user.id, user.name, user.email],
//         (err) => {
//           if (err) console.error("❌ DB insert error:", err);
//         }
//       );
//     }

//     console.log(`✅ Updated users cache: ${cachedUsers.length} users`);
//   } catch (err) {
//     console.error("❌ Failed to update users cache:", err);
//   }
// }

// // Update every 2 hours
// cron.schedule("0 */2 * * *", updateUsersCache);

// // Initial fetch
// updateUsersCache();

// function getCachedUsers() {
//   return cachedUsers;
// }



// module.exports = { getCachedUsers };




const cron = require("node-cron");
const { fetchAll } = require('../utils/apiClient');
const db = require('../db'); // Assuming this file exists and exports a connection

let cachedUsers = [];
let cachedRoles = [];

async function updateUsersAndRolesCache() {
  try {
    console.log("🔄 Cron job: Fetching latest users and roles...");
    
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
    for (const user of cachedUsers) {
      db.query(
        "INSERT INTO employees (id, name, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email)",
        [user.id, user.name, user.email],
        (err) => {
          if (err) console.error("❌ DB insert error:", err);
        }
      );
    }

    console.log(`✅ Updated users cache: ${cachedUsers.length} users`);
    console.log(`✅ Updated roles cache: ${cachedRoles.length} roles`);
  } catch (err) {
    console.error("❌ Failed to update cache:", err);
  }
}

cron.schedule("0 */2 * * *", updateUsersAndRolesCache);
updateUsersAndRolesCache();

module.exports = {
  getCachedUsers: () => cachedUsers,
  getCachedRoles: () => cachedRoles,
  updateUsersAndRolesCache,
};

