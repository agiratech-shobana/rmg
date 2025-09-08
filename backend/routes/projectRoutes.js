


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



