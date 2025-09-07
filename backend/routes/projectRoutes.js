//   const dbpool = require('../db'); 
//   const express = require('express');
//   const router = express.Router();
//   const service = require('../services/projectService');

//   // POST /api/projects (uses service.createProjectWithMembers)
//   router.post('/projects', async (req, res) => {
//       try {
//           const payload = req.body;
//           const { project } = payload;
//           if (!project) {
//               return res.status(400).json({ message: 'Project data is missing in the payload.' });
//           }
//           const customFields = project.custom_fields || [];
//           const getCustomFieldValue = (id) => customFields.find(cf => cf.id === id)?.value || '';
//           const errors = [];
//           const projectName = project.name?.trim();
//           if (!projectName) {
//               errors.push('Project Name is required.');
//           } else if (projectName.length <= 3) {
//               errors.push('Project Name must be more than 3 characters.');
//           }
//           if (!project.identifier?.trim()) errors.push('Project Identifier is required.');
//           if (!project.description?.trim()) errors.push('Description is required.');

//           const accountName = getCustomFieldValue(48);
//           if (!accountName) errors.push('Account Name is required.');
//           const projectCode = getCustomFieldValue(37);
//           if (!projectCode) {
//               errors.push('Project Code is required.');
//           } else if (!projectCode.startsWith('ATPR')) {
//               errors.push("Project Code must start with 'ATPR'.");
//           }

//           const projectType = getCustomFieldValue(42);
//           if (!projectType) errors.push('Project Type is required.');

//           const projectMode = getCustomFieldValue(47);
//           if (!projectMode) errors.push('Project Mode is required.');

//           const startDate = getCustomFieldValue(38);
//           if (!startDate) errors.push('Start Date is required.');

//           const endDate = getCustomFieldValue(39);
//           if (!endDate) {
//               errors.push('End Date is required.');
//           } else if (startDate && new Date(endDate) < new Date(startDate)) {
//               errors.push('End Date cannot be before Start Date.');
//           }
          
//           const techStack = getCustomFieldValue(40);
//           if (!techStack) errors.push('Tech Stack is required.');

//           const proposalProject = getCustomFieldValue(52);
//           if (!proposalProject) errors.push('Proposal Project is required.');
          
//           if (errors.length > 0) {
//               return res.status(400).json({ message: 'Validation failed', errors });
//           }

//           const result = await service.createProjectWithMembers(payload);
//           res.status(201).json(result);
//       } catch (err) {
//           const errorMessage = err.message || 'Error creating project and adding members';
//           console.error('Error in projectRoutes POST /projects:', err);
//           if (err.response?.data) {
//               return res.status(500).json({ message: 'Failed to create project in Redmine.', details: err.response.data });
//           }
//           res.status(500).json({ message: errorMessage });
//       }
//   });




// // GET /api/projects/:id (uses service.fetchProjectById)
//   router.get('/projects/:id', async (req, res) => {
//     try {
//       const { id } = req.params;
//       const project = await service.fetchProjectById(id);
      
//       if (!project) {
//         return res.status(404).json({ message: 'Project not found.' });
//       }

//       res.json(project);
//     } catch (err) { 
//       console.error('Error fetching project by ID:', err);
//       res.status(500).json({ message: 'Error fetching project data' });
//     }
//   });




//   // GET /api/projects/:id/members (uses service.fetchProjectMembers)
//   router.get('/projects/:id/members', async (req, res) => {
//     try {
//       const members = await service.fetchProjectMembers(req.params.id);
//       console.log(`[DEBUG] Members for project ${req.params.id}:`, JSON.stringify(members, null, 2));
//       res.json({ memberships: members });
//     } catch (err) {
//       console.error('Error fetching project members:', err);
//       res.status(500).json({ message: 'Error fetching project members' });
//     }
//   });




//   // POST /api/projects/:id/members (uses service.addMemberToProject)
//   router.post('/projects/:id/members', async (req, res) => {
//     try {
//       const result = await service.addMemberToProject(req.params.id, req.body);
//       res.status(201).json(result);
//     } catch (err) {
//       console.error('Error adding member:', err);
//       res.status(500).json({ message: 'Error adding member to project' });
//     }
//   });




//   // GET /api/users (uses service.fetchAllUsers)
//   router.get('/users', async (req, res) => {
//     try {
//       const users = await service.fetchAllUsers();
//       res.json({ users });
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       res.status(500).json({ message: 'Error fetching users' });
//     }
//   });




//   // GET /api/roles (uses service.fetchAllRoles)
//   router.get('/roles', async (req, res) => {
//     try {
//       const roles = await service.fetchAllRoles();
//       res.json({ roles });
//     } catch (err) {
//       console.error('Error fetching roles:', err);
//       res.status(500).json({ message: 'Error fetching roles' });
//     }
//   });




//   router.get('/employees', async (req, res) => {
//     try {
//       const employees = await service.fetchEmployeesFromDB();
//       // The frontend expects the data inside a 'users' key
//       res.json({ users: employees });
//     } catch (err) {
//       console.error('Error fetching employees from DB:', err);
//       res.status(500).json({ message: 'Error fetching employee data' });
//     }
//   });

//   router.get('/projects', async (req, res) => {
//     try {
//       const projects = await service.fetchProjects();
//       res.json(projects);
//     } catch (err) {
//       console.error('Error in projectRoutes:', err);
//       res.status(500).json({ message: 'Error fetching projects data' });
//     }
//   });



//   // DELETE /api/projects/:projectId/memberships/:membershipId
//   // This route will handle deleting a member from a project
//   router.delete('/projects/:projectId/memberships/:membershipId', async (req, res) => {
//     try {
//       const { projectId, membershipId } = req.params;
//       await service.removeMemberFromProject(projectId, membershipId);
//       res.status(204).end();
//     } catch (err) {
//       console.error('Error removing member from project:', err);
//       if (err.response?.data) {
//         return res.status(err.response.status).json(err.response.data);
//       }
//       res.status(500).json({ message: 'Error removing member from project.' });
//     }
//   });


//   // DELETE /api/projects/:id → Delete project
//   router.delete('/projects/:id', async (req, res) => {
//       try {
//           const { id } = req.params;
//           const { identifier } = req.body;

//           if (!identifier) {
//               return res.status(400).json({ message: 'Project identifier is required to confirm deletion.' });
//           }
//           await service.deleteProject(id, identifier);
//           res.status(204).end();
//       } catch (err) {
//           console.error('Error deleting project:', err);
//           if (err.response?.data) {
//               return res.status(err.response.status).json(err.response.data);
//           }
//           if (err.message.includes('Mismatched identifier')) {
//               return res.status(400).json({ message: err.message });
//           }
//           res.status(500).json({ message: 'Error deleting project.' });
//       }
//   });

//   // GET /api/users/:userId/logged-hours (uses service.fetchUserLoggedHours)
//   router.get('/users/:userId/logged-hours', async (req, res) => {
//     try {
//       const { userId } = req.params;
//       const loggedHours = await service.fetchUserLoggedHours(userId);
//       res.json({ loggedHours });
//     } catch (err) {
//       console.error('Error fetching user logged hours:', err);
//       res.status(500).json({ message: 'Error fetching user logged hours' });
//     }
//   });




// //  GET /api/projects/:projectId/logged-hours (uses service.fetchProjectLoggedHours)
//   router.get('/projects/:projectId/logged-hours', async (req, res) => {
//     try {
//       const { projectId } = req.params;
//       const loggedHours = await service.fetchProjectLoggedHours(projectId);
//       res.json({ loggedHours });
//     } catch (err) {
//       console.error(`Error fetching logged hours for project ${projectId}:`, err);
//       res.status(500).json({ message: 'Error fetching project logged hours.' });
//     }
//   });




// // PUT /api/projects/:id → Update project
//   router.put('/projects/:id', async (req, res) => {
//       try {
//           const { id } = req.params;
//           const payload = req.body.project;

//           if (!payload) {
//               return res.status(400).json({ message: 'Project data is missing in the payload.' });
//           }
//           const result = await service.updateProject(id, payload);
//           res.json(result);
//       } catch (err) {
//           console.error('Error in projectRoutes PUT /projects:', err);
//           if (err.response?.data) {
//               return res.status(500).json({ message: 'Failed to update project in Redmine.', details: err.response.data });
//           }
//           res.status(500).json({ message: 'Error updating project.' });
//       }
//   });

  

// // GET /api/users/:userId/memberships (uses service.fetchUserMemberships)

//   router.get('/users/:userId/memberships', async (req, res) => {
//       try {
//           const { userId } = req.params;
//           const userMemberships = await service.fetchUserMemberships(userId);
//           res.json(userMemberships);
//       } catch (err) {
//           console.error(`Error fetching memberships for user ${req.params.userId}:`, err);
//           res.status(500).json({ message: 'Error fetching user memberships.' });
//       }
//   });


// // GET /api/skills/employee-count → Employee count by skill
//  router.get('/skills/employee-count', async (req, res) => {
//     try {
//         const [results] = await dbpool.query(
//             `SELECT s.name, COUNT(es.employee_id) AS employeeCount
//             FROM skills s
//             JOIN employee_skills es ON s.id = es.skill_id
//             GROUP BY s.id
//             ORDER BY employeeCount DESC`
//         );
//         res.json(results);
//     } catch (error) {
//         console.error('Error fetching employee count by skill:', error);
//         res.status(500).json({ error: 'Failed to fetch skill data.' });
//     }
// });


// router.post('/skills', async (req, res) => {
//     const { name } = req.body;
    
//     // Simple validation
//     if (!name) {
//         return res.status(400).json({ error: 'Skill name is required.' });
//     }
    
//     const skillName = name.trim();
    
//     try {
//         // Check if the skill already exists
//         const [existingSkills] = await dbpool.query(
//             `SELECT id FROM skills WHERE name = ?`,
//             [skillName]
//         );

//         if (existingSkills.length > 0) {
//             // Skill already exists
//             return res.status(409).json({ error: 'Skill already exists.' });
//         }
        
//         // If it doesn't exist, insert the new skill
//         await dbpool.query(
//             `INSERT INTO skills (name) VALUES (?)`,
//             [skillName]
//         );
        
//         res.status(201).json({ message: 'Skill added successfully.' });
        
//     } catch (error) {
//         console.error('Error adding new skill:', error);
//         res.status(500).json({ error: 'Failed to add skill.' });
//     }
// });

//   module.exports = router;



const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Projects
router.post('/projects', projectController.createProject);
router.get('/projects/:id', projectController.getProjectById);
router.get('/projects/:id/members', projectController.getProjectMembers);
router.post('/projects/:id/members', projectController.addMemberToProject);
router.get('/projects', projectController.getAllProjects);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

// Members
router.delete('/projects/:projectId/memberships/:membershipId', projectController.removeMemberFromProject);

// Users & Roles
router.get('/users', projectController.getAllUsers);
router.get('/roles', projectController.getAllRoles);
router.get('/employees', projectController.getEmployees);
router.get('/users/:userId/logged-hours', projectController.getUserLoggedHours);
router.get('/users/:userId/memberships', projectController.getUserMemberships);

// Project Hours
router.get('/projects/:projectId/logged-hours', projectController.getProjectLoggedHours);

// Skills
router.get('/skills/employee-count', projectController.getEmployeeCountBySkill);
router.post('/skills', projectController.addSkill);

module.exports = router;



