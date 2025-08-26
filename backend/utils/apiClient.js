

// backend/utils/apiClient.js
const {
  APROJECT_BASE_URL,
  APROJECT_USERNAME,
  APROJECT_PASSWORD,
} = process.env;

if (!APROJECT_BASE_URL || !APROJECT_USERNAME || !APROJECT_PASSWORD) {
  console.error(" Missing environment variables for API credentials.");
  throw new Error("API credentials not configured. Please check your .env file.");
}

const AUTH_HEADER_VALUE =
  "Basic " +
  Buffer.from(`${APROJECT_USERNAME}:${APROJECT_PASSWORD}`).toString("base64");

const AUTH_HEADERS = {
  'Authorization': AUTH_HEADER_VALUE,
  'Content-Type': 'application/json'
};



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
        
        console.log(" Sending POST request to:", url);
        console.log(" Request Headers:", AUTH_HEADERS);
        console.log(" Request Body:", JSON.stringify(data));

        const res = await fetch(url, {
            method: 'POST',
            headers: AUTH_HEADERS,
            body: JSON.stringify(data),
        });

        const responseBody = await res.text();

        if (!res.ok) {
            console.error(`POST API Error for ${endpoint}: ${res.status} ${res.statusText}`);
            throw new Error(`API POST failed with status ${res.status}: ${responseBody}`);
        }

        let json = JSON.parse(responseBody);
        return json;
        
    } catch (error) {
        console.error(` postData failed for endpoint ${endpoint}:`, error.message);
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
//         console.error(` fetchData failed for endpoint ${endpoint}:`, error.message);
//         throw error;
//     }
// }

async function fetchData(endpoint) {
    try {
        const url = `${APROJECT_BASE_URL}/${endpoint}`;
        console.log(" Fetching single item:", url);
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

async function deleteData(endpoint) {
    try {
        const url = `${APROJECT_BASE_URL}/${endpoint}`;
        console.log("📡 Sending DELETE request to:", url);
        const res = await fetch(url, { 
            method: 'DELETE',
            headers: AUTH_HEADERS
        });

        if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`API DELETE failed with status ${res.status}: ${errorBody}`);
        }

        // DELETE requests typically do not have a response body,
        // so we can just return a success status.
        return res.status;

    } catch (error) {
        console.error(`❌ deleteData failed for endpoint ${endpoint}:`, error.message);
        throw error;
    }
}

// In backend/utils/apiClient.js

// ... (your existing functions) ...

async function fetchTimeEntries(projectId) {
    const endpoint = `time_entries.json?project_id=${projectId}&limit=100`; // Adjust limit as needed
    const timeEntries = await fetchAll(endpoint);
    return timeEntries;
}
// In backend/utils/apiClient.js

// ... (your existing functions) ...

async function fetchTimeEntriesByUser(userId) {
    const endpoint = `time_entries.json?user_id=${userId}&limit=100`; // Use user_id
    const timeEntries = await fetchAll(endpoint);
    return timeEntries;
}



module.exports = {
  fetchAll,
  postData,
  fetchData,
  deleteData,
  fetchTimeEntries,
  fetchTimeEntriesByUser
};







