// // routes/resumeRoutes.js
// const express = require("express");
// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
// const pdfParse = require("pdf-parse");
  // const mammoth = require("mammoth");
// const Groq = require("groq-sdk");
// const db = require("../db"); // Assuming you have a db.js file for database connection
// const puppeteer = require("puppeteer");
// const ejs = require("ejs");
// const path = require("path");
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// const router = express.Router();

// Upload and process resume


// function parseSkills(skillsText) {
//   if (!skillsText) return {};
//   const skills = {};
//   const structuredLines = skillsText.split('\n').filter(line => line.includes(':') && line.trim().length > 0);
//   if (structuredLines.length > 0) {
//     structuredLines.forEach(line => {
//       const parts = line.split(':');
//       if (parts.length > 1) {
//         const category = parts[0].trim();
//         const skillList = parts[1].trim();
//         skills[category] = skillList;
//       }
//     });
//   } else {
//     skills["Technical Skills"] = skillsText.trim().replace(/\s+/g, ', ');
//   }
//   return skills;
// }

// function parseProjects(projectsText) {
//   if (!projectsText) return [];
//   const structuredProjectBlocks = projectsText.split(/\s*Project \d+:/).filter(Boolean);
//   if (structuredProjectBlocks.length > 1) {
//     return structuredProjectBlocks.map(block => {
//       const titleMatch = block.match(/^(.*?)(?=Description:)/i);
//       const descriptionMatch = block.match(/Description:\s*([\s\S]*?)(?=Roles:|Tech Stack:)/i);
//       const rolesMatch = block.match(/Roles:\s*([\s\S]*?)(?=Tech Stack:)/i);
//       const techStackMatch = block.match(/Tech Stack:\s*([\s\S]*)/i);
//       return {
//         title: (titleMatch ? titleMatch[1] : "Untitled Project").replace(/[\n\r:]/g, ''),
//         description: descriptionMatch ? descriptionMatch[1].trim() : "No description provided.",
//         roles: rolesMatch ? rolesMatch[1].trim().split('\n').filter(Boolean) : [],
//         techStack: techStackMatch ? techStackMatch[1].trim().split(',').map(s => s.trim()) : [],
//       };
//     }).filter(p => p.title.trim() !== 'Untitled Project' || p.description.trim() !== 'No description provided.');
//   } else {
//     return [];
//   }
// }

// router.post("/generate-company-resume", async (req, res) => {
//   try {
//     const extractedData = req.body;

//     const skills = parseSkills(extractedData.skills);
//     const projects = parseProjects(extractedData.projects);

//     const dataForEJS = {
//       name: extractedData.name,
//       designation: extractedData.designation,
//       careerObjectiveOrSummary: extractedData.careerObjectiveOrSummary,
//       skills: skills,
//       projects: projects
//     };

//     const html = await ejs.renderFile(
//       path.join(__dirname, "../views/resumeTemplate.ejs"),
//       dataForEJS
//     );

//     const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({ format: "A4" });
//     await browser.close();

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=company_resume.pdf",
//     });
//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error("❌ Error generating PDF:", error);
//     res.status(500).send("Error generating PDF");
//   }
// });

// async function extractText(file) {
//   if (file.mimetype === "application/pdf") {
//     const pdfData = await pdfParse(file.buffer);
//     return pdfData.text;
//   } else if (
//     file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//     file.mimetype === "application/msword"
//   ) {
//     const result = await mammoth.extractRawText({ buffer: file.buffer });
//     return result.value;
//   } else {
//     throw new Error("Unsupported file format");
//   }
// }

// router.post("/extract", upload.single("resume"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const resumeText = await extractText(req.file);

//     const completion = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a resume parser. Your primary goal is to extract specific, full sections of text as raw strings. Do not summarize or remove any details. Preserve all formatting and line breaks exactly as they appear in the original resume. Always return valid JSON."
//         },
//         {
//           role: "user",
//           content: `Resume text:\n${resumeText}\n\n
//             Extract the following sections as raw text, placing them under the specified JSON keys.
//             - name
//             - designation
//             - careerObjectiveOrSummary
//             - skills
//             - projects
//             For the 'skills' section, capture all content under the 'Software Known' heading until the 'Project Experience' heading.
//             For the 'projects' section, capture all content under any heading like 'Projects', 'Project Experience', 'Project Highlights', or similar, until the next major heading or the end of the document.
//             ⚠️ IMPORTANT: Return a JSON object only. Do not add any conversational text before or after the JSON.`,
//         },
//       ],
//       temperature: 0,
//     });

//     let extractedText = completion.choices[0]?.message?.content?.trim() || "";
//     if (extractedText.startsWith("```")) {
//       extractedText = extractedText.replace(/```json|```/g, "").trim();
//     }

//     let extracted;
//     try {
//       extracted = JSON.parse(extractedText);
//     } catch (e) {
//       extracted = { error: "Invalid JSON", raw: extractedText };
//     }

//     res.json({ extracted });

//   } catch (error) {
//     res.status(500).json({ error: "Failed to process resume" });
//   }
// });


// router.post("/process/:employeeId", upload.single("resume"), async (req, res) => {
//   const { employeeId } = req.params;
//   try {
//     // 1. Extract text from resume
//     const resumeText = await extractText(req.file);

//     // 2. Extract sections using Groq
//     const completion = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a resume parser. Your primary goal is to extract specific, full sections of text as raw strings. Do not summarize or remove any details. Preserve all formatting and line breaks exactly as they appear in the original resume. Always return valid JSON."
//         },
//         {
//           role: "user",
//           content: `Resume text:\n${resumeText}\n\n
//             Extract the following sections as raw text, placing them under the specified JSON keys.
//             - name
//             - designation
//             - careerObjectiveOrSummary
//             - skills
//             - projects
//             For the 'skills' section, capture all content under the 'Software Known' heading until the 'Project Experience' heading.
//             For the 'projects' section, capture all content under the 'Project Experience' heading until the end of the document.
//             ⚠️ IMPORTANT: Return a JSON object only. Do not add any conversational text before or after the JSON.`,
//         },
//       ],
//       temperature: 0,
//     });

//     let extractedText = completion.choices[0]?.message?.content?.trim() || "";
//     if (extractedText.startsWith("```")) {
//       extractedText = extractedText.replace(/```json|```/g, "").trim();
//     }

//     let extracted;
//     try {
//       extracted = JSON.parse(extractedText);
//     } catch (e) {
//       extracted = { error: "Invalid JSON", raw: extractedText };
//     }

//     // 3. Match skills with DB and store mapping
//     const [allSkills] = await db.query("SELECT id, name FROM skills");
//     const matchedSkillIds = allSkills
//       .filter(s => Array.isArray(extracted.skills)
//         ? extracted.skills.some(ex => ex.toLowerCase() === s.name.toLowerCase())
//         : (typeof extracted.skills === "string" && extracted.skills.toLowerCase().includes(s.name.toLowerCase()))
//       )
//       .map(s => s.id);

//     for (const skillId of matchedSkillIds) {
//       await db.query(
//         "INSERT IGNORE INTO employee_skills (employee_id, skill_id) VALUES (?, ?)",
//         [employeeId, skillId]
//       );
//     }

//     // 4. Return extracted data and matched skills
//     res.json({
//       extracted: {
//         ...extracted,
//         matchedSkills: allSkills.filter(s => matchedSkillIds.includes(s.id)).map(s => s.name)
//       }
//     });
//   } catch (err) {
//     console.error("❌ Error in /process/:employeeId:", err);
//     res.status(500).json({ error: "Failed to process resume" });
//   }
// });

// module.exports = router;



const express = require("express");
const multer = require("multer");
 const mammoth = require("mammoth");
 
const pdfParse = require("pdf-parse");
const db = require("../db"); // Assuming you have a db.js file for database connection

const resumeController = require("../controllers/resumeController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/extract", upload.single("resume"), resumeController.extract);
router.post("/resume-template", resumeController.generatePDF);
router.post("/upload/:userId", upload.single("resume"), async (req, res) => {
  try {
    const { userId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = file.originalname.split(".").pop().toLowerCase();
    let text = "";

    if (ext === "pdf") {
      const pdfData = await pdfParse(file.buffer);
      text = pdfData.text;
    } else if (ext === "docx" || ext === "doc") {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
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

      const resumeFilename = `resume_${userId}.${ext}`;

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

        return res.json({ matchedSkills: foundSkills.map((s) => s.name) });
      });
    });
  } catch (err) {
    console.error("❌ Error processing resume:", err);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

module.exports = router;