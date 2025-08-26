const dbpool = require('../db'); // Assuming you have a db.js for database connection
const express = require('express');
const router = express.Router();
const service = require('../services/projectService');

// POST /api/projects (uses service.createProjectWithMembers)
router.post('/projects', async (req, res) => {
    try {
        const payload = req.body;

        // --- UPDATED: Comprehensive Backend Validation Block ---
        const { project } = payload;
        if (!project) {
            return res.status(400).json({ message: 'Project data is missing in the payload.' });
        }

        const customFields = project.custom_fields || [];
        const getCustomFieldValue = (id) => customFields.find(cf => cf.id === id)?.value || '';

        const errors = [];
        
        // --- Project Name Validation ---
        // CHANGED: Added length check
        const projectName = project.name?.trim();
        if (!projectName) {
            errors.push('Project Name is required.');
        } else if (projectName.length <= 3) {
            errors.push('Project Name must be more than 3 characters.');
        }

        // --- Other Top-level field validation ---
        if (!project.identifier?.trim()) errors.push('Project Identifier is required.');
        if (!project.description?.trim()) errors.push('Description is required.');

        // --- Custom field validation ---
        const accountName = getCustomFieldValue(48);
        if (!accountName) errors.push('Account Name is required.');

        // --- Project Code Validation ---
        // CONFIRMED: This logic already matches your requirement
        const projectCode = getCustomFieldValue(37);
        if (!projectCode) {
            errors.push('Project Code is required.');
        } else if (!projectCode.startsWith('ATPR')) {
            errors.push("Project Code must start with 'ATPR'.");
        }

        const projectType = getCustomFieldValue(42);
        if (!projectType) errors.push('Project Type is required.');

        const projectMode = getCustomFieldValue(47);
        if (!projectMode) errors.push('Project Mode is required.');

        const startDate = getCustomFieldValue(38);
        if (!startDate) errors.push('Start Date is required.');

        const endDate = getCustomFieldValue(39);
        if (!endDate) {
            errors.push('End Date is required.');
        } else if (startDate && new Date(endDate) < new Date(startDate)) {
            errors.push('End Date cannot be before Start Date.');
        }
        
        const techStack = getCustomFieldValue(40);
        if (!techStack) errors.push('Tech Stack is required.');

        const proposalProject = getCustomFieldValue(52);
        if (!proposalProject) errors.push('Proposal Project is required.');
        
        // --- Final Check ---
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        // --- End of Validation Block ---

        const result = await service.createProjectWithMembers(payload);
        res.status(201).json(result);
    } catch (err) {
        // ... (error handling remains the same)
        const errorMessage = err.message || 'Error creating project and adding members';
        console.error('Error in projectRoutes POST /projects:', err);
        if (err.response?.data) {
            return res.status(500).json({ message: 'Failed to create project in Redmine.', details: err.response.data });
        }
        res.status(500).json({ message: errorMessage });
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

// POST /api/projects/:id/members (for add member modal)
// router.post('/projects/:id/members', async (req, res) => {
//   try {
//     // It takes the project ID from the URL and the member data from the request body...
//     const result = await service.addMemberToProject(req.params.id, req.body);
//     // ...and then calls the function in the service file.
//     res.status(201).json(result);
//   } catch (err) {
//     res.status(500).json({ message: 'Error adding member' });
//   }
// });

// router.post('/projects/:id/members', async (req, res) => {
//   try {
//     const result = await service.addMemberToProject(req.params.id, req.body);
//     res.status(201).json(result);
//   } catch (err) {
//     console.error('Error adding member:', err);
//     res.status(500).json({ message: 'Error adding member to project' });
//   }
// });


// In backend/routes/projectRoutes.js

// Add this new route to get employees from your local DB
// router.get('/employees', async (req, res) => {
//   try {
//     const employees = await service.fetchEmployeesFromDB();
//     // The frontend expects the data inside a 'users' key
//     res.json({ users: employees });
//   } catch (err) {
//     console.error('Error fetching employees from DB:', err);
//     res.status(500).json({ message: 'Error fetching employee data' });
//   }
// });

router.get('/projects', async (req, res) => {
  try {
    const projects = await service.fetchProjects();
    res.json(projects);
  } catch (err) {
    console.error('Error in projectRoutes:', err);
    res.status(500).json({ message: 'Error fetching projects data' });
  }
});





// In backend/routes/projectRoutes.js

// ... (your existing routes) ...

// DELETE /api/projects/:projectId/memberships/:membershipId
// This route will handle deleting a member from a project
router.delete('/projects/:projectId/memberships/:membershipId', async (req, res) => {
  try {
    const { projectId, membershipId } = req.params;
    // Call the service function to handle the deletion
    await service.removeMemberFromProject(projectId, membershipId);

    // Send a 204 No Content status on successful deletion
    res.status(204).end();
  } catch (err) {
    console.error('Error removing member from project:', err);
    if (err.response?.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    res.status(500).json({ message: 'Error removing member from project.' });
  }
});

router.delete('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { identifier } = req.body;

        if (!identifier) {
            return res.status(400).json({ message: 'Project identifier is required to confirm deletion.' });
        }

        // Call the service function to handle the deletion logic
        await service.deleteProject(id, identifier);

        // Send a 204 No Content status on successful deletion
        res.status(204).end();
    } catch (err) {
        console.error('Error deleting project:', err);
        if (err.response?.data) {
            return res.status(err.response.status).json(err.response.data);
        }
        // Return a 400 for a bad request (e.g., incorrect identifier)
        if (err.message.includes('Mismatched identifier')) {
             return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Error deleting project.' });
    }
});

router.get('/users/:userId/logged-hours', async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedHours = await service.fetchUserLoggedHours(userId);
    res.json({ loggedHours });
  } catch (err) {
    console.error('Error fetching user logged hours:', err);
    res.status(500).json({ message: 'Error fetching user logged hours' });
  }
});






// ... (your existing module.exports) ...
module.exports = router;

