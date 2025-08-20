// const express = require('express');
// const { getCachedUsers } = require('../services/aprojectService');

// const router = express.Router();

// router.get('/users', (req, res) => {
//   res.json(getCachedUsers());
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { getCachedUsers, getCachedRoles } = require('../services/aprojectService');

// GET endpoint to return all cached users
router.get('/users', (req, res) => {
    res.json(getCachedUsers());
});

// GET endpoint to return a list of roles
router.get('/roles', (req, res) => {
    res.json({ roles: getCachedRoles() });
});

module.exports = router;