

// --- Add these new imports at the top ---
const fs = require('fs-extra');
const path = require('path');

// --- Your existing imports ---
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
// const db = require("../db");
const dbPool = require("../db");
const parserService = require("../services/parserService");
const pdfService = require("../services/pdfService");


// =================================================================
// THIS IS THE NEW, ALL-IN-ONE FUNCTION THAT DOES EVERYTHING
// =================================================================
// exports.processResume = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     const { file } = req;
//     const ext = path.extname(file.originalname).toLowerCase();

//     // Step 1: Save the original file the user uploaded
//     const originalFilename = `original_${userId}_${Date.now()}${ext}`;
//     const originalFilePath = path.join(__dirname, '..', 'uploads', 'originals', originalFilename);
//     await fs.writeFile(originalFilePath, file.buffer);

//     // Step 2: Use your parserService to get structured data from the resume
//     console.log("Parsing resume with AI...");
//     const extractedData = await parserService.parseResume(file);
//     if (!extractedData) {
//         throw new Error("Failed to extract data from resume.");
//     }

//     // Step 3: Use your pdfService to create the company-formatted PDF
//     console.log("Generating company-formatted PDF...");
//     const pdfBuffer = await pdfService.generatePDF(extractedData);
//     const dateStr = new Date().toISOString().split("T")[0]; 
//     const formattedFilename = `company_format_${userId}_${dateStr}.pdf`;
//     const formattedFilePath = path.join(__dirname, '..', 'uploads', 'formatted', formattedFilename);
//     await fs.writeFile(formattedFilePath, pdfBuffer);

//     // Step 4: Get raw text from the file to match skills 
//     let rawText = "";
//     if (ext === ".pdf") {
//       const pdfData = await pdfParse(file.buffer);
//       rawText = pdfData.text;
//     } else if (ext === ".docx" || ext === ".doc") {
//       const result = await mammoth.extractRawText({ buffer: file.buffer });
//       rawText = result.value;
//     }

//     // Step 5: Find which skills from your DB are in the resume text
//     console.log("Matching skills and updating database...");
//     const skillsInDb = await new Promise((resolve, reject) => {
//       db.query("SELECT id, name FROM skills", (err, results) => {
//         if (err) return reject(err);
//         resolve(results);
//       });
//     });

//     const matchedSkills = [];
//     const lowerCaseText = rawText.toLowerCase();

//     for (const skill of skillsInDb) {
//       if (lowerCaseText.includes(skill.name.toLowerCase())) {
//         matchedSkills.push(skill.name);
//         db.query(
//           "INSERT INTO employee_skills (employee_id, skill_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE employee_id=employee_id",
//           [userId, skill.id]
//         );
//       }
//     }

//     // Step 6: Update the employee's record in the database with the new file paths
//     await new Promise((resolve, reject) => {
//       db.query(
//         "UPDATE employees SET original_resume_path = ?, formatted_resume_path = ? WHERE id = ?",
//         [originalFilename, formattedFilename, userId],
//         (err) => {
//           if (err) return reject(err);
//           resolve();
//         }
//       );
//     });

//     // Step 7: Send a success response back to the frontend
//     res.status(200).json({
//       success: true,
//       message: "Resume processed successfully.",
//       matchedSkills: matchedSkills,
//       downloadFilename: formattedFilename,
//     });

//   } catch (error) {
//     console.error("❌ Error in processResume controller:", error);
//     res.status(500).json({ error: "An unexpected error occurred." });
//   }
// };



exports.processResume = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const { file } = req;
    const ext = path.extname(file.originalname).toLowerCase();

    // Steps 1-4: File handling and parsing (These are correct)
    const originalFilename = `original_${userId}_${Date.now()}${ext}`;
    const originalFilePath = path.join(__dirname, '..', 'uploads', 'originals', originalFilename);
    await fs.writeFile(originalFilePath, file.buffer);

    console.log("Parsing resume with AI...");
    const extractedData = await parserService.parseResume(file);
    if (!extractedData) {
        throw new Error("Failed to extract data from resume.");
    }

    console.log("Generating company-formatted PDF...");
    const pdfBuffer = await pdfService.generatePDF(extractedData);
    const dateStr = new Date().toISOString().split("T")[0]; 
    const formattedFilename = `company_format_${userId}_${dateStr}.pdf`;
    const formattedFilePath = path.join(__dirname, '..', 'uploads', 'formatted', formattedFilename);
    await fs.writeFile(formattedFilePath, pdfBuffer);

    let rawText = "";
    if (ext === ".pdf") {
      const pdfData = await pdfParse(file.buffer);
      rawText = pdfData.text;
    } else if (ext === ".docx" || ext === ".doc") {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      rawText = result.value;
    }

    // Step 5: Find which skills from your DB are in the resume text
    console.log("Matching skills and updating database...");
    
    // --- REFACTORED: Replaced 'new Promise' with a direct 'await' call ---
    const [skillsInDb] = await dbPool.query("SELECT id, name FROM skills");

    const matchedSkills = [];
    const lowerCaseText = rawText.toLowerCase();

    for (const skill of skillsInDb) {
      if (lowerCaseText.includes(skill.name.toLowerCase())) {
        matchedSkills.push(skill.name);
        
        // --- REFACTORED: Added 'await' for reliability ---
        await dbPool.query(
          "INSERT INTO employee_skills (employee_id, skill_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE employee_id=employee_id",
          [userId, skill.id]
        );
      }
    }

    // Step 6: Update the employee's record in the database with the new file paths
    // --- REFACTORED: Replaced 'new Promise' with a direct 'await' call ---
    await dbPool.query(
      "UPDATE employees SET original_resume_path = ?, formatted_resume_path = ? WHERE id = ?",
      [originalFilename, formattedFilename, userId]
    );

    // Step 7: Send a success response back to the frontend
    res.status(200).json({
      success: true,
      message: "Resume processed successfully.",
      matchedSkills: matchedSkills,
      downloadFilename: formattedFilename,
    });

  } catch (error) {
    console.error("❌ Error in processResume controller:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};




// --- We keep your old functions below just in case they are used elsewhere ---
// --- You can delete them later if you are sure they are not needed. ---

exports.extract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const extractedData = await parserService.parseResume(req.file);
    res.json({ extracted: extractedData });
  } catch (error) {
    console.error("❌ Error processing request:", error);
    res.status(500).json({ error: "Failed to process resume" });
  }
};

exports.generatePDF = async (req, res) => {
  try {
    const pdfBuffer = await pdfService.generatePDF(req.body);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=company_resume.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};
