// const express = require("express");
// const multer = require("multer");
// const pdfParse = require("pdf-parse");
// const mammoth = require("mammoth");
// const fs = require("fs");
// const path = require("path");
// const db = require("../db"); // commonjs db connection

// const router = express.Router();

// // Configure Multer (upload folder)
// const upload = multer({ dest: "uploads/" });

// // Upload and process resume
// router.post("/upload/:userId", upload.single("resume"), async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const filePath = req.file.path;
//     const ext = path.extname(req.file.originalname).toLowerCase();

//     let text = "";

//     if (ext === ".pdf") {
//       const dataBuffer = fs.readFileSync(filePath);
//       const pdfData = await pdfParse(dataBuffer);
//       text = pdfData.text;
//     } else if (ext === ".docx" || ext === ".doc") {
//       const result = await mammoth.extractRawText({ path: filePath });
//       text = result.value;
//     } else {
//       return res.status(400).json({ error: "Unsupported file type" });
//     }

//     // Fetch predefined skills from DB
//     db.query("SELECT name FROM skills", (err, results) => {
//       if (err) {
//         console.error("DB error:", err);
//         return res.status(500).json({ error: "DB error" });
//       }

//       const skills = results.map((r) => r.name.toLowerCase());
//       const foundSkills = [];

//       skills.forEach((skill) => {
//         if (text.toLowerCase().includes(skill)) {
//           foundSkills.push(skill);
//         }
//       });

//       // Cleanup uploaded file
//       fs.unlinkSync(filePath);

//       return res.json({ matchedSkills: foundSkills });
//     });
//   } catch (err) {
//     console.error("Error processing resume:", err);
//     res.status(500).json({ error: "Failed to process resume" });
//   }
// });

// module.exports = router;



// routes/resumeRoutes.js
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");
const db = require("../db");

const router = express.Router();

// Multer setup
const upload = multer({ dest: "uploads/" });

// Upload and process resume
router.post("/upload/:userId", upload.single("resume"), async (req, res) => {
  try {
    const { userId } = req.params;
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let text = "";

    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (ext === ".docx" || ext === ".doc") {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // 1. Check if employee exists
    db.query("SELECT * FROM employees WHERE id = ?", [userId], (err, results) => {
      if (err) {
        console.error("❌ DB error:", err);
        return res.status(500).json({ error: "DB error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Employee not found" });
      }

      const resumeFilename = path.basename(filePath);

      // 2. Save resume path
      db.query("UPDATE employees SET resume = ? WHERE id = ?", [resumeFilename, userId], (err2) => {
        if (err2) console.error("❌ Error saving resume path:", err2);
      });

      // 3. Get skills list
      db.query("SELECT id, name FROM skills", (err3, skillsRes) => {
        if (err3) {
          console.error("❌ DB error:", err3);
          return res.status(500).json({ error: "DB error" });
        }

        const skills = skillsRes.map((r) => ({ id: r.id, name: r.name.toLowerCase() }));
        const foundSkills = [];

        skills.forEach((skill) => {
          if (text.toLowerCase().includes(skill.name)) {
            foundSkills.push(skill);

            // 4. Save employee-skill relation
            db.query(
              "INSERT INTO employee_skills (employee_id, skill_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE employee_id=employee_id",
              [userId, skill.id],
              (err4) => {
                if (err4) console.error("❌ Error saving employee skill:", err4);
              }
            );
          }
        });

        // Cleanup uploaded file
        fs.unlinkSync(filePath);

        return res.json({ matchedSkills: foundSkills.map((s) => s.name) });
      });
    });
  } catch (err) {
    console.error("❌ Error processing resume:", err);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

module.exports = router;
