

// backend/routes/resumeRoutes.js
const dbPool = require("../db");
const express = require("express");
const multer = require("multer");
const path = require("path");

const resumeController = require("../controllers/resumeController");
const skillService = require("../services/skillService");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });



router.post(
  "/process/:userId",
  upload.single("resume"),
  resumeController.processResume
);

router.get("/employees/:userId/skills", async (req, res) => {
  try {
    const skills = await skillService.getEmployeeSkills(req.params.userId);
    res.json({ employeeSkills: skills });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee skills.' });
  }
});

router.post("/employees/:userId/add-skill", resumeController.addManualSkill);

router.get("/skills", async (req, res) => {
  try {
    const skills = await skillService.getAllSkills();
    res.json({ skills });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all skills.' });
  }
});

router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const safePath = path.join(__dirname, '..', 'uploads', 'formatted', filename);

  if (!safePath.startsWith(path.join(__dirname, '..', 'uploads', 'formatted'))) {
    return res.status(403).send("Forbidden");
  }

  res.download(safePath, (err) => {
    if (err) {
      console.error("File download error:", err);
      res.status(404).send("File not found.");
    }
  });
});

router.get("/employee/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [results] = await dbPool.query(
      `SELECT e.original_resume_path, e.formatted_resume_path, GROUP_CONCAT(DISTINCT s.name SEPARATOR '|||') AS skills
       FROM employees e
       LEFT JOIN employee_skills es ON e.id = es.employee_id
       LEFT JOIN skills s ON es.skill_id = s.id
       WHERE e.id = ?
       GROUP BY e.id`,
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    const employeeData = results[0];
    const skillsArray = employeeData.skills ? employeeData.skills.split('|||') : [];

    res.json({
      resume: {
        original: employeeData.original_resume_path,
        formatted: employeeData.formatted_resume_path,
      },
      skills: skillsArray,
    });
  } catch (error) {
    console.error(` CRITICAL ERROR fetching resume data for employee ${userId}:`, error);
    res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;
  