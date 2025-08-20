// // backend/services/projectService.js
// const { fetchAll ,postData} = require('../utils/apiClient');

// async function fetchProjects() {
//   const rawProjects = await fetchAll("projects.json");

//   const processedProjects = rawProjects.map(project => {
//     const getCustomFieldValue = (fieldName) => {
//       const field = project.custom_fields.find(cf => cf.name === fieldName);
//       return field ? field.value : null;
//     };

//     const accountName = getCustomFieldValue('Account Name');
//     const endDate = getCustomFieldValue('End Date');

//     const progress = Math.floor(Math.random() * 101); 
//     const loggedHours = Math.floor(Math.random() * 2000) + 1000;
//     const totalHours = 2000;

//     let status = 'Ongoing';
//     if (progress >= 100) {
//       status = 'Finished';
//     } else if (new Date(endDate) < new Date()) {
//       status = 'Unfinished';
//     }

//     return {
//       id: project.id,
//       name: project.name,
//       accountName,
//       status, 
//       progress,
//       loggedHours,
//       totalHours,
//       endDate,
//     };
//   });

//   return processedProjects;
// }


// async function createProject(projectData) {
//     // This function will call the POST API
//     const response = await postData("projects.json", projectData);
//     return response;
// }

// module.exports = {
//   fetchProjects,
//   createProject
// };



// backend/services/projectService.js
const { fetchAll, postData } = require('../utils/apiClient');

async function fetchProjects() {
  const rawProjects = await fetchAll("projects.json");

  const processedProjects = rawProjects.map(project => {
    const getCustomFieldValue = (fieldName) => {
      const field = project.custom_fields.find(cf => cf.name === fieldName);
      return field ? field.value : null;
    };

    const accountName = getCustomFieldValue('Account Name');
    const endDate = getCustomFieldValue('End Date');

    const progress = Math.floor(Math.random() * 101); 
    const loggedHours = Math.floor(Math.random() * 2000) + 1000;
    const totalHours = 2000;

    let status = 'Ongoing';
    if (progress >= 100) {
      status = 'Finished';
    } else if (new Date(endDate) < new Date()) {
      status = 'Unfinished';
    }

    return {
      id: project.id,
      name: project.name,
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


// async function createProject(projectData) {
//     const response = await postData("projects.json", projectData);
//     return response;
// }




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

module.exports = {
  fetchProjects,
  // createProject,
  createProjectWithMembers,
};