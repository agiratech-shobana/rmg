
// // backend/routes/projectRoutes.js
// const express = require('express');
// const router = express.Router();
// const { fetchProjects } = require('../services/projectService');

// router.get('/projects', async (req, res) => {
//   try {
//     const projects = await fetchProjects();
//     console.log(`✅ Fetched projects: ${projects.length} items`);
//     res.json(projects);
//   } catch (err) {
//     console.error('Error in projectRoutes:', err);
//     res.status(500).json({ message: 'Error fetching projects data' });
//   }
// });




// // Post a new project (NEW ROUTE)
// router.post('/projects', async (req, res) => {
//     try {
//         const newProject = req.body;
//         const result = await createProject(newProject);
//         res.status(201).json(result);
//     } catch (err) {
//         console.error('Error adding new project:', err);
//         res.status(500).json({ message: 'Error creating project' });
//     }
// });

// module.exports = router;


// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
// --- Correctly import both functions ---
const { fetchProjects, createProjectWithMembers } = require('../services/projectService');

// Get projects (existing, non-paginated route)
router.get('/projects', async (req, res) => {
  try {
    const projects = await fetchProjects();
    console.log(`✅ Fetched projects: ${projects.length} items`);
    res.json(projects);
  } catch (err) {
    console.error('Error in projectRoutes:', err);
    res.status(500).json({ message: 'Error fetching projects data' });
  }
});

// Post a new project (NEW ROUTE)
// router.post('/projects', async (req, res) => {
//     try {
//         const newProject = req.body;
//         const result = await createProject(newProject);
//         res.status(201).json(result);
//     } catch (err) {
//         console.error('Error adding new project:', err);
//         res.status(500).json({ message: 'Error creating project' });
//     }
// });



router.post('/projects', async (req, res) => {
    try {
        const payload = req.body;
        const result = await createProjectWithMembers(payload);
        res.status(201).json(result);
    } catch (err) {
        console.error('Error in projectRoutes:', err);
        res.status(500).json({ message: 'Error creating project and adding members' });
    }
});
module.exports = router;