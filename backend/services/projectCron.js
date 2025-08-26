const cron = require("node-cron");
const { fetchAll, fetchTimeEntries } = require('../utils/apiClient');
const pLimit = require('p-limit').default;

const concurrencyLimit = pLimit(2); // Limit concurrent API calls to prevent 503 errors
let cachedProjects = []; // Use a local array to cache projects

async function fetchProjectLoggedHours(projectId) {
    try {
        const timeEntries = await fetchTimeEntries(projectId);
        const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
        return totalHours;
    } catch (error) {
        console.error(`❌ Cron job error: Could not fetch logged hours for project ${projectId}:`, error);
        return 0;
    }
}

async function updateProjectsCache() {
  try {
    console.log("🔄 Cron job: Fetching latest projects data...");

    const rawProjects = await fetchAll("projects.json");

    const processedProjects = await Promise.all(
      rawProjects.map(project => concurrencyLimit(async () => {
        const getCustomFieldValue = (fieldName) => {
          const field = project.custom_fields.find(cf => cf.name === fieldName);
          return field ? field.value : null;
        };

        const accountName = getCustomFieldValue('Account Name');
        const startDate = getCustomFieldValue('Start Date');
        const endDate = getCustomFieldValue('End Date');

        let status = 'Unfinished';
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const projectEndDate = new Date(endDate);
        projectEndDate.setHours(0, 0, 0, 0);

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
          
          if (totalDuration > 0) {
            progress = Math.min(100, Math.floor((elapsedDuration / totalDuration) * 100));
          }
        }
        
        const loggedHours = await fetchProjectLoggedHours(project.id);
        const totalHours = 2000;

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
      }))
    );
    
    cachedProjects = processedProjects;
    
    console.log(`✅ Cron job: Successfully updated project cache with ${cachedProjects.length} projects.`);
  } catch (err) {
    console.error("❌ Cron job: Failed to update project cache:", err);
  }
}

// Schedule the cron job to run every 30 minutes
cron.schedule("*/30 * * * *", updateProjectsCache);
updateProjectsCache(); // Run on startup

module.exports = {
  updateProjectsCache,
  getCachedProjects: () => cachedProjects
};
