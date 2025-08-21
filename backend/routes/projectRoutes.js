


// // backend/routes/projectRoutes.js
// const express = require('express');
// const router = express.Router();
// // --- Correctly import both functions ---
// const { fetchProjects, createProjectWithMembers } = require('../services/projectService');

// // Get projects (existing, non-paginated route)
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




// router.post('/projects', async (req, res) => {
//     try {
//         const payload = req.body;
//         const result = await createProjectWithMembers(payload);
//         res.status(201).json(result);
//     } catch (err) {
//         console.error('Error in projectRoutes:', err);
//         res.status(500).json({ message: 'Error creating project and adding members' });
//     }
// });



// // --- NEW ROUTES ADDED FOR PROJECT DETAIL PAGE ---

// // GET /api/projects/:id - Get details for a single project
// router.get('/projects/:id', async (req, res) => {
//   try {
//     const project = await service.fetchProjectById(req.params.id);
//     res.json(project);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching project data' });
//   }
// });

// // GET /api/projects/:id/members - Get members of a project
// router.get('/projects/:id/members', async (req, res) => {
//   try {
//     const members = await service.fetchProjectMembers(req.params.id);
//     res.json({ memberships: members }); // Nesting to match frontend expectations
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching project members' });
//   }
// });

// // POST /api/projects/:id/members - Add a member to a project
// router.post('/projects/:id/members', async (req, res) => {
//   try {
//     const result = await service.addMemberToProject(req.params.id, req.body);
//     res.status(201).json(result);
//   } catch (err) {
//     res.status(500).json({ message: 'Error adding member to project' });
//   }
// });

// // GET /api/users - Get all users for the modal
// router.get('/users', async (req, res) => {
//   try {
//     const users = await service.fetchAllUsers();
//     res.json({ users }); // Nesting to match frontend expectations
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching users' });
//   }
// });

// // GET /api/roles - Get all roles for the modal
// router.get('/roles', async (req, res) => {
//   try {
//     const roles = await service.fetchAllRoles();
//     res.json({ roles }); // Nesting to match frontend expectations
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching roles' });
//   }
// });
// module.exports = router;


const express = require('express');
const router = express.Router();
// --- THIS IS THE FIX ---
// Import all functions from the service into a single object called 'service'
const service = require('../services/projectService');

// Get projects (uses service.fetchProjects)
router.get('/projects', async (req, res) => {
  try {
    const projects = await service.fetchProjects();
    res.json(projects);
  } catch (err) {
    console.error('Error in projectRoutes:', err);
    res.status(500).json({ message: 'Error fetching projects data' });
  }
});

// Create project (uses service.createProjectWithMembers)
router.post('/projects', async (req, res) => {
    try {
        const payload = req.body;
        const result = await service.createProjectWithMembers(payload);
        res.status(201).json(result);
    } catch (err) {
        console.error('Error in projectRoutes:', err);
        res.status(500).json({ message: 'Error creating project and adding members' });
    }
});

// --- NEW ROUTES FOR PROJECT DETAIL PAGE ---

// GET /api/projects/:id (uses service.fetchProjectById)
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await service.fetchProjectById(req.params.id);
    res.json(project);
  } catch (err) {
    console.error('Error fetching project by ID:', err);
    res.status(500).json({ message: 'Error fetching project data' });
  }
});

// GET /api/projects/:id/members (uses service.fetchProjectMembers)
router.get('/projects/:id/members', async (req, res) => {
  try {
    const members = await service.fetchProjectMembers(req.params.id);
        console.log(`[DEBUG] Members for project ${req.params.id}:`, JSON.stringify(members, null, 2));

    res.json({ memberships: members });
  } catch (err) {
    console.error('Error fetching project members:', err);
    res.status(500).json({ message: 'Error fetching project members' });
  }
});

// POST /api/projects/:id/members (uses service.addMemberToProject)
router.post('/projects/:id/members', async (req, res) => {
  try {
    const result = await service.addMemberToProject(req.params.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ message: 'Error adding member to project' });
  }
});

// GET /api/users (uses service.fetchAllUsers)
router.get('/users', async (req, res) => {
  try {
    const users = await service.fetchAllUsers();
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// GET /api/roles (uses service.fetchAllRoles)
router.get('/roles', async (req, res) => {
  try {
    const roles = await service.fetchAllRoles();
    res.json({ roles });
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ message: 'Error fetching roles' });
  }
});

module.exports = router;

