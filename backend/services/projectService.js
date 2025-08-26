


// backend/services/projectService.js
const dbPool = require('../db'); // Your existing db.js file
// const db=require('../db');
const { fetchAll, fetchData,postData ,deleteData,fetchTimeEntries,fetchTimeEntriesByUser} = require('../utils/apiClient');
const pLimit = require('p-limit').default;

async function fetchProjects() {
  const rawProjects = await fetchAll("projects.json");

  const processedProjects = rawProjects.map(project => {
    const getCustomFieldValue = (fieldName) => {
      const field = project.custom_fields.find(cf => cf.name === fieldName);
      return field ? field.value : null;
    };

    const accountName = getCustomFieldValue('Account Name');
    const startDate = getCustomFieldValue('Start Date');

    const endDate = getCustomFieldValue('End Date');

    // const progress = Math.floor(Math.random() * 101); 
    const loggedHours = Math.floor(Math.random() * 2000) + 1000;
    // const loggedHours = await fetchProjectLoggedHours(project.id);

    const totalHours = 2000;

    // let status = 'Ongoing';
    // if (progress >= 100) {
    //   status = 'Finished';
    // } else if (new Date(endDate) < new Date()) {
    //   status = 'Unfinished';
    // }
    let status = 'Unfinished'; 
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize to start of the day
    const projectEndDate = new Date(endDate);
    projectEndDate.setHours(0, 0, 0, 0); // Normalize to start of the day

    if (projectEndDate >= currentDate) {
      status = 'Ongoing';
    } else {
      status = 'Finished';
    }

    let progress = 0;
    if (status === 'Finished') {
      progress = 100; // Projects that are past their due date are considered 100%
    } else if (status === 'Ongoing' && startDate && endDate) {
      const projectStartDate = new Date(startDate);
      const totalDuration = projectEndDate.getTime() - projectStartDate.getTime();
      const elapsedDuration = currentDate.getTime() - projectStartDate.getTime();
      
      // Prevent division by zero or negative durations
      if (totalDuration > 0) {
        progress = Math.min(100, Math.floor((elapsedDuration / totalDuration) * 100));
      }
    }


    return {
      id: project.id,
      name: project.name,
      identifier: project.identifier, // <-- FIX: Add the identifier here

      accountName,
      status, 
      progress,
      loggedHours,
      totalHours,
      endDate,
    };
  });

  return processedProjects;
}

const fetchProjectLoggedHours = async (projectId) => {
    try {
        const timeEntries = await fetchTimeEntries(projectId);
        const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
        return totalHours;
    } catch (error) {
        console.error(`Error fetching logged hours for project ${projectId}:`, error);
        return 0; // Return 0 if there's an error
    }
};






async function createProjectWithMembers(payload) {
    try {
        const projectResponse = await postData("projects.json", { project: payload.project });
        const newProjectId = projectResponse.project.id;
        
        if (payload.members && payload.members.length > 0) {
            await Promise.all(
                payload.members.map(member => 
                    postData(`projects/${newProjectId}/memberships.json`, { membership: member })
                )
            );
        }
        
        return projectResponse;
        
    } catch (error) {
        throw error;
    }
}



async function fetchProjectById(projectId) {
  return await fetchData(`projects/${projectId}.json`);
}

// Fetches all members (memberships) for a specific project
async function fetchProjectMembers(projectId) {
  return await fetchAll(`projects/${projectId}/memberships.json`);
}

// // Adds a new member to a project
async function addMemberToProject(projectId, memberData) {
  const payload = { membership: memberData };
  return await postData(`projects/${projectId}/memberships.json`, payload);
}

// Fetches all users to populate the 'Add Member' modal
async function fetchAllUsers() {
    return await fetchAll('users.json');
}


// Fetches all roles to populate the 'Add Member' modal
async function fetchAllRoles() {
    return await fetchAll('roles.json');
}
async function addMemberToProject(projectId, memberData) {
  // It takes the member data (e.g., { user_id: 563, role_ids: [3] })...
  const payload = { membership: memberData };
  // ...wraps it inside a "membership" object...
  // ...and passes it to the apiClient to be sent.
  return await postData(`projects/${projectId}/memberships.json`, payload);
}



async function fetchEmployeesFromDB() {
  // Define the SQL query to get the necessary data for the modal.
  // We order by name to make the list look clean in the UI.
  const sql = "SELECT id, name, role FROM employees ORDER BY name ASC";

  try {
    // Execute the query using the promise-based connection pool
    const [rows] = await dbPool.query(sql);
    
    // Return the array of employee records
    return rows;
  } catch (error) {
    // If something goes wrong with the database query, log it for debugging.
    // The error will be passed up to the route handler to send a 500 response.
    console.error("Database query failed in fetchEmployeesFromDB:", error);
    throw error;
  }
}

// const removeMemberFromProject = async (projectId, membershipId) => {
//   // Construct the correct API endpoint
//   const endpoint = `projects/${projectId}/memberships/${membershipId}.json`;
  
//   // Use the imported deleteData function to make the call
//   await deleteData(endpoint);
// };

const removeMemberFromProject = async (projectId, membershipId) => {
  // Corrected API endpoint: Redmine only needs the membershipId.
  const endpoint = `memberships/${membershipId}.json`;
  
  // Use the imported deleteData function to make the call
  await deleteData(endpoint);
};

const deleteProject = async (projectId, identifier) => {
    // 1. Fetch the project to get its correct identifier
    const projectUrl = `projects/${projectId}.json`;
    const projectData = await fetchData(projectUrl);
    const actualIdentifier = projectData.project.identifier;

    // 2. Validate the identifier provided by the user
    if (actualIdentifier !== identifier) {
        throw new Error('Mismatched identifier. Project deletion aborted.');
    }

    // 3. If identifiers match, proceed with the deletion
    const deleteUrl = `projects/${projectId}.json`;
    await deleteData(deleteUrl);
};


const fetchUserLoggedHours = async (userId) => {
    try {
        const timeEntries = await fetchTimeEntriesByUser(userId);
        const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
        return totalHours;
    } catch (error) {
        console.error(`Error fetching logged hours for user ${userId}:`, error);
        return 0;
    }
};

module.exports = {
  fetchProjects,
  // createProject,
  createProjectWithMembers,
  fetchProjectById,
  fetchProjectMembers,
  addMemberToProject,
  fetchAllUsers,
  fetchAllRoles,
  // fetchUsersWithRoles,
  fetchEmployeesFromDB,
  removeMemberFromProject,
  deleteProject,
  fetchProjectLoggedHours,
  fetchUserLoggedHours


};

