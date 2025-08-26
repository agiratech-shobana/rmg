


// backend/routes/resumeRoutes.js
// const db = require("../db");
const dbPool = require("../db"); // Use the promise-based pool
const express = require("express");
const multer = require("multer");

const path = require("path"); // <-- Make sure this is imported
const resumeController = require("../controllers/resumeController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// =================================================================
// NEW ROUTES
// =================================================================

// This is our main route for the single upload feature
router.post(
  "/process/:userId",
  upload.single("resume"),
  resumeController.processResume
);

// This route lets the user download the generated PDF
router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const safePath = path.join(__dirname, '..', 'uploads', 'formatted', filename);

  // Security check to prevent users from accessing files outside the intended folder
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
  console.log(`[DEBUG] Attempting to fetch data for userId: ${userId}`);

  try {
    // This 'await' call is what causes the error if the function is not 'async'.
    // ADDED 'DISTINCT' to GROUP_CONCAT to prevent duplicate skills.
    const [results] = await dbPool.query(
      `SELECT 
         e.original_resume_path, 
         e.formatted_resume_path, 
         GROUP_CONCAT(DISTINCT s.name SEPARATOR '|||') AS skills
       FROM employees e
       LEFT JOIN employee_skills es ON e.id = es.employee_id
       LEFT JOIN skills s ON es.skill_id = s.id
       WHERE e.id = ?
       GROUP BY e.id`,
      [userId]
    );

    console.log(`[DEBUG] SQL query completed for userId: ${userId}. Rows found: ${results.length}`);

    if (results.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const employeeData = results[0];
    console.log(`[DEBUG] Employee data found:`, employeeData);
    
    if (!employeeData.formatted_resume_path) {
        console.log(`[DEBUG] No formatted resume found for userId: ${userId}. Sending empty response.`);
        return res.json({ resume: null, skills: [] });
    }

    const skillsArray = employeeData.skills ? employeeData.skills.split('|||') : [];

    res.json({
      resume: {
        original: employeeData.original_resume_path,
        formatted: employeeData.formatted_resume_path,
      },
      skills: skillsArray,
    });

  } catch (error) {
    console.error(`❌ CRITICAL ERROR fetching resume data for employee ${userId}:`, error);
    res.status(500).json({ error: "Database query failed" });
  }
});


// =================================================================
// OLD ROUTES (can be deleted later)
// =================================================================

router.post("/extract", upload.single("resume"), resumeController.extract);
router.post("/resume-template", resumeController.generatePDF);
// The old '/upload/:userId' is now handled by '/process/:userId' so it's gone.

module.exports = router;