const dbpool = require('../db');
const service = require('../services/projectService');

// POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const payload = req.body;
    const { project } = payload;

    if (!project) {
      return res.status(400).json({ message: 'Project data is missing in the payload.' });
    }

    // Validation
    const customFields = project.custom_fields || [];
    const getCustomFieldValue = (id) => customFields.find(cf => cf.id === id)?.value || '';
    const errors = [];
    const projectName = project.name?.trim();

    if (!projectName) {
      errors.push('Project Name is required.');
    } else if (projectName.length <= 3) {
      errors.push('Project Name must be more than 3 characters.');
    }
    if (!project.identifier?.trim()) errors.push('Project Identifier is required.');
    if (!project.description?.trim()) errors.push('Description is required.');

    const accountName = getCustomFieldValue(48);
    if (!accountName) errors.push('Account Name is required.');

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

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const result = await service.createProjectWithMembers(payload);
    res.status(201).json(result);
  } catch (err) {
    const errorMessage = err.message || 'Error creating project and adding members';
    console.error('Error in projectController.createProject:', err);
    if (err.response?.data) {
      return res.status(500).json({ message: 'Failed to create project in Redmine.', details: err.response.data });
    }
    res.status(500).json({ message: errorMessage });
  }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const project = await service.fetchProjectById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json(project);
  } catch (err) {
    console.error('Error fetching project by ID:', err);
    res.status(500).json({ message: 'Error fetching project data' });
  }
};

// GET /api/projects/:id/members
exports.getProjectMembers = async (req, res) => {
  try {
    const members = await service.fetchProjectMembers(req.params.id);
    res.json({ memberships: members });
  } catch (err) {
    console.error('Error fetching project members:', err);
    res.status(500).json({ message: 'Error fetching project members' });
  }
};

// POST /api/projects/:id/members
exports.addMemberToProject = async (req, res) => {
  try {
    const result = await service.addMemberToProject(req.params.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ message: 'Error adding member to project' });
  }
};

// GET /api/projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await service.fetchProjects();
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Error fetching projects data' });
  }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body.project;
    if (!payload) return res.status(400).json({ message: 'Project data is missing in the payload.' });
    const result = await service.updateProject(id, payload);
    res.json(result);
  } catch (err) {
    console.error('Error updating project:', err);
    if (err.response?.data) {
      return res.status(500).json({ message: 'Failed to update project in Redmine.', details: err.response.data });
    }
    res.status(500).json({ message: 'Error updating project.' });
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ message: 'Project identifier is required.' });
    await service.deleteProject(id, identifier);
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting project:', err);
    if (err.response?.data) return res.status(err.response.status).json(err.response.data);
    if (err.message.includes('Mismatched identifier')) return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Error deleting project.' });
  }
};

// DELETE /api/projects/:projectId/memberships/:membershipId
exports.removeMemberFromProject = async (req, res) => {
  try {
    const { projectId, membershipId } = req.params;
    await service.removeMemberFromProject(projectId, membershipId);
    res.status(204).end();
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({ message: 'Error removing member from project.' });
  }
};

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await service.fetchAllUsers();
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// GET /api/roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await service.fetchAllRoles();
    res.json({ roles });
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ message: 'Error fetching roles' });
  }
};

// GET /api/employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await service.fetchEmployeesFromDB();
    res.json({ users: employees });
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Error fetching employee data' });
  }
};

// GET /api/users/:userId/logged-hours
exports.getUserLoggedHours = async (req, res) => {
  try {
    const loggedHours = await service.fetchUserLoggedHours(req.params.userId);
    res.json({ loggedHours });
  } catch (err) {
    console.error('Error fetching user logged hours:', err);
    res.status(500).json({ message: 'Error fetching user logged hours' });
  }
};

// GET /api/projects/:projectId/logged-hours
exports.getProjectLoggedHours = async (req, res) => {
  try {
    const loggedHours = await service.fetchProjectLoggedHours(req.params.projectId);
    res.json({ loggedHours });
  } catch (err) {
    console.error('Error fetching project logged hours:', err);
    res.status(500).json({ message: 'Error fetching project logged hours.' });
  }
};

// GET /api/users/:userId/memberships
exports.getUserMemberships = async (req, res) => {
  try {
    const userMemberships = await service.fetchUserMemberships(req.params.userId);
    res.json(userMemberships);
  } catch (err) {
    console.error(`Error fetching memberships for user ${req.params.userId}:`, err);
    res.status(500).json({ message: 'Error fetching user memberships.' });
  }
};

// GET /api/skills/employee-count
exports.getEmployeeCountBySkill = async (req, res) => {
  try {
    const [results] = await dbpool.query(
      `SELECT s.name, COUNT(es.employee_id) AS employeeCount
       FROM skills s
       JOIN employee_skills es ON s.id = es.skill_id
       GROUP BY s.id
       ORDER BY employeeCount DESC`
    );
    res.json(results);
  } catch (err) {
    console.error('Error fetching employee count by skill:', err);
    res.status(500).json({ error: 'Failed to fetch skill data.' });
  }
};

// POST /api/skills
exports.addSkill = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Skill name is required.' });

  try {
    const skillName = name.trim();
    const [existing] = await dbpool.query(`SELECT id FROM skills WHERE name = ?`, [skillName]);
    if (existing.length > 0) return res.status(409).json({ error: 'Skill already exists.' });

    await dbpool.query(`INSERT INTO skills (name) VALUES (?)`, [skillName]);
    res.status(201).json({ message: 'Skill added successfully.' });
  } catch (err) {
    console.error('Error adding new skill:', err);
    res.status(500).json({ error: 'Failed to add skill.' });
  }
};
