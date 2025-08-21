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

// module.exports = {
//     fetchAll
// };



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

// async function fetchAll(endpoint) {
//   let allData = [];
//   let offset = 0;
//   const limit = 100;

//   try {
//     while (true) {
//       const url = `${APROJECT_BASE_URL}/${endpoint}?limit=${limit}&offset=${offset}`;
//       console.log("📡 Fetching:", url);

//       const res = await fetch(url, { headers: { Authorization: AUTH_HEADER } });

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error(`❌ API Error for ${endpoint}: ${res.status} ${res.statusText}`);
//         throw new Error(`API fetch failed with status ${res.status}: ${errorText}`);
//       }

//       let json;
//       try {
//         json = await res.json();
//       } catch (jsonError) {
//         const errorText = await res.text();
//         console.error(`❌ JSON parsing failed for ${endpoint}:`, jsonError.message);
//         console.error("Response body:", errorText);
//         throw new Error(`Invalid JSON response from API for endpoint ${endpoint}`);
//       }
//       // --- THIS IS THE KEY CHANGE ---
//       let items;
//       if (endpoint.includes('users.json')) {
//           items = Array.isArray(json.users) ? json.users : [];
//       } else if (endpoint.includes('projects.json')) {
//           items = Array.isArray(json.projects) ? json.projects : [];
//       } else {
//           // Fallback for other potential endpoints
//           items = Array.isArray(json) ? json : [];
//       }
     

//             allData = allData.concat(items);
//       // Handle pagination
//       if (items.length < limit) break;
//       offset += limit;

//     }
//   } catch (error) {
//     console.error(`❌ FetchAll failed for endpoint ${endpoint}:`, error.message);
//     throw error;
//   }

//   return allData;
// }


// // --- NEW FUNCTION ---
// async function postData(endpoint, data) {
//     try {
//         const url = `${APROJECT_BASE_URL}/${endpoint}`;
//         const res = await fetch(url, {
//             method: 'POST',
//             headers: AUTH_HEADER,
//             body: JSON.stringify(data),
//         });

//         const responseBody = await res.text();

//         if (!res.ok) {
//             console.error(`❌ POST API Error for ${endpoint}: ${res.status} ${res.statusText}`);
//             throw new Error(`API POST failed with status ${res.status}: ${responseBody}`);
//         }

//         let json = JSON.parse(responseBody);
//         return json;
        
//     } catch (error) {
//         console.error(`❌ postData failed for endpoint ${endpoint}:`, error.message);
//         throw error;
//     }
// }
// // --- END OF NEW FUNCTION ---


// module.exports = {
//   fetchAll,
//   postData
// };


// backend/utils/apiClient.js
const {
  APROJECT_BASE_URL,
  APROJECT_USERNAME,
  APROJECT_PASSWORD,
} = process.env;

if (!APROJECT_BASE_URL || !APROJECT_USERNAME || !APROJECT_PASSWORD) {
  console.error("❌ Missing environment variables for API credentials.");
  throw new Error("API credentials not configured. Please check your .env file.");
}

const AUTH_HEADER_VALUE =
  "Basic " +
  Buffer.from(`${APROJECT_USERNAME}:${APROJECT_PASSWORD}`).toString("base64");

const AUTH_HEADERS = {
  'Authorization': AUTH_HEADER_VALUE,
  'Content-Type': 'application/json'
};

// edha kudutha varum details members matum varadhu



// async function fetchAll(endpoint) {
//   let allData = [];
//   let offset = 0;
//   const limit = 100;

//   try {
//     while (true) {
//       const url = `${APROJECT_BASE_URL}/${endpoint}?limit=${limit}&offset=${offset}`;
//       console.log("📡 Fetching:", url);
      
//       const res = await fetch(url, { headers: AUTH_HEADERS });
//       const responseBody = await res.text();

//       if (!res.ok) {
//         console.error(`❌ API Error for ${endpoint}: ${res.status} ${res.statusText}`);
//         throw new Error(`API fetch failed with status ${res.status}: ${responseBody}`);
//       }

//       let json;
//       try {
//         json = JSON.parse(responseBody);
//       } catch (jsonError) {
//         console.error(`❌ JSON parsing failed for ${endpoint}:`, jsonError.message);
//         console.error("Response body:", responseBody);
//         throw new Error(`Invalid JSON response from API for endpoint ${endpoint}`);
//       }

//       let items;
//       if (json.time_entries) {
//         items = Array.isArray(json.time_entries) ? json.time_entries : [];
//       } else if (json.users) {
//         items = Array.isArray(json.users) ? json.users : [];
//       } else if (json.projects) {
//         items = Array.isArray(json.projects) ? json.projects : [];
//       }  else if (json.roles) { // <-- This is the key line
//         items = Array.isArray(json.roles) ? json.roles : [];
//       }
//       else {
//         items = Array.isArray(json) ? json : [];
//       }

//       allData = allData.concat(items);

//       if (items.length < limit || allData.length >= json.total_count) {
//         break;
//       }
//       offset += limit;
//     }
//   } catch (error) {
//     console.error(`❌ FetchAll failed for endpoint ${endpoint}:`, error.message);
//     throw error;
//   }

//   return allData;
// }


async function fetchAll(endpoint) {
  let allData = [];
  let offset = 0;
  const limit = 100;
  try {
    while (true) {
      const url = `${APROJECT_BASE_URL}/${endpoint}?limit=${limit}&offset=${offset}`;
      const res = await fetch(url, { headers: AUTH_HEADERS });
      if (!res.ok) throw new Error(`API fetch failed with status ${res.status}`);
      
      const json = await res.json();
      
      // --- THIS IS THE CORRECTED LOGIC ---
      // It dynamically finds the key in the response that contains the array of data.
      const dataKey = Object.keys(json).find(key => Array.isArray(json[key]));

      if (!dataKey) {
        // This handles cases where the entire response is an array
        if (Array.isArray(json)) {
            allData = allData.concat(json);
            break; 
        }
        console.error(`[apiClient ERROR] Could not find a data array (e.g., 'memberships', 'projects') in the JSON response for endpoint: ${endpoint}`);
        break; // Exit loop if no data array is found
      }
      
      const items = json[dataKey];
      allData = allData.concat(items);

      // Check if we need to fetch another page
      if (items.length < limit || (json.total_count && allData.length >= json.total_count)) {
        break;
      }
      offset += limit;
    }
  } catch (error) {
    console.error(`❌ FetchAll failed for endpoint ${endpoint}:`, error.message);
    throw error;
  }
  
  return allData;
}



async function postData(endpoint, data) {
    try {
        const url = `${APROJECT_BASE_URL}/${endpoint}`;
        
        console.log("📡 Sending POST request to:", url);
        console.log("📝 Request Headers:", AUTH_HEADERS);
        console.log("📝 Request Body:", JSON.stringify(data));

        const res = await fetch(url, {
            method: 'POST',
            headers: AUTH_HEADERS,
            body: JSON.stringify(data),
        });

        const responseBody = await res.text();

        if (!res.ok) {
            console.error(`❌ POST API Error for ${endpoint}: ${res.status} ${res.statusText}`);
            throw new Error(`API POST failed with status ${res.status}: ${responseBody}`);
        }

        let json = JSON.parse(responseBody);
        return json;
        
    } catch (error) {
        console.error(`❌ postData failed for endpoint ${endpoint}:`, error.message);
        throw error;
    }
}


// async function fetchData(endpoint) {
//     try {
//         const url = `${APROJECT_BASE_URL}/${endpoint}`;
//         const res = await fetch(url, { headers: AUTH_HEADERS });
//         if (!res.ok) {
//             throw new Error(`API fetch failed with status ${res.status}`);
//         }
//         return await res.json();
//     } catch (error) {
//         console.error(`❌ fetchData failed for endpoint ${endpoint}:`, error.message);
//         throw error;
//     }
// }

async function fetchData(endpoint) {
    try {
        const url = `${APROJECT_BASE_URL}/${endpoint}`;
        console.log("📡 Fetching single item:", url);
        const res = await fetch(url, { headers: AUTH_HEADERS });
        if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`API fetch failed with status ${res.status}: ${errorBody}`);
        }
        return await res.json();
    } catch (error) {
        console.error(`❌ fetchData failed for endpoint ${endpoint}:`, error.message);
        throw error;
    }
}

module.exports = {
  fetchAll,
  postData,
  fetchData
};







