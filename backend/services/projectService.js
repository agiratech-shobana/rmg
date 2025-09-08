


const dbPool = require('../db'); 
const { fetchAll, fetchData,postData ,deleteData,fetchTimeEntries,fetchTimeEntriesByUser,putData} = require('../utils/apiClient');
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

    const loggedHours = Math.floor(Math.random() * 2000) + 1000;
    const totalHours = 2000;

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
      progress = 100; 
    } else if (status === 'Ongoing' && startDate && endDate) {
      const projectStartDate = new Date(startDate);
      const totalDuration = projectEndDate.getTime() - projectStartDate.getTime();
      const elapsedDuration = currentDate.getTime() - projectStartDate.getTime();
      
      // Prevent division by zero or negative durations
      if (totalDuration > 0 && elapsedDuration > 0) {
        progress = Math.min(100, Math.floor((elapsedDuration / totalDuration) * 100));
      }
    }


    return {
      id: project.id,
      name: project.name,
      identifier: project.identifier, 
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

 // Adds a new member to a project
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
  return await postData(`projects/${projectId}/memberships.json`, payload);
}



async function fetchEmployeesFromDB() {
  const sql = "SELECT id, name FROM employees ORDER BY name ASC";
  try {
    const [rows] = await dbPool.query(sql);
    return rows;
  } catch (error) {
    console.error("Database query failed in fetchEmployeesFromDB:", error);
    throw error;
  }
}



const removeMemberFromProject = async (projectId, membershipId) => {
  const endpoint = `memberships/${membershipId}.json`;
  await deleteData(endpoint);
};

const deleteProject = async (projectId, identifier) => {
    const projectUrl = `projects/${projectId}.json`;
    const projectData = await fetchData(projectUrl);
    const actualIdentifier = projectData.project.identifier;
    if (actualIdentifier !== identifier) {
        throw new Error('Mismatched identifier. Project deletion aborted.');
    }

    //  If identifiers match, proceed with the deletion
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

const fetchProjectLoggedHours = async (projectId) => {
    try {
        const timeEntries = await fetchTimeEntries(projectId);
        const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
        return totalHours;
    } catch (error) {
        console.error(`Error fetching total logged hours for project ${projectId}:`, error);
        return 0; // Return 0 if there's an error
    }
};





async function updateProject(projectId, payload) {
    const endpoint = `projects/${projectId}.json`;
    return await putData(endpoint, { project: payload });
}


async function fetchUserMemberships(userId) {
    const endpoint = `users/${userId}.json?include=memberships`;
    return await fetchData(endpoint);
}
module.exports = {
  fetchProjects,
  createProjectWithMembers,
  fetchProjectById,
  fetchProjectMembers,
  addMemberToProject,
  fetchAllUsers,
  fetchAllRoles,
  fetchEmployeesFromDB,
  removeMemberFromProject,
  deleteProject,
  fetchProjectLoggedHours,
  fetchUserLoggedHours,
  updateProject,
  fetchUserMemberships


};




