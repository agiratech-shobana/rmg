

const fs = require('fs-extra');
const path = require('path');
// We no longer need these here, the service handles them
// const pdfParse = require("pdf-parse");
// const mammoth = require("mammoth");
const dbPool = require("../db");
const parserService = require("../services/parserService");
const pdfService = require("../services/pdfService");
const skillService = require("../services/skillService");

exports.processResume = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    
    const { file } = req;
    const ext = path.extname(file.originalname).toLowerCase();


    const [rows] = await dbPool.query("SELECT name FROM employees WHERE id = ?", [userId]);
    const employeeName = rows[0]?.name?.replace(/\s+/g, "_") || `user${userId}`;


    // 1. Save original file
    // const originalFilename = `original_${userId}_${Date.now()}${ext}`;
    const originalFilename = `${employeeName}_Original${ext}`;

    const originalFilePath = path.join(__dirname, '..', 'uploads', 'originals', originalFilename);
    await fs.writeFile(originalFilePath, file.buffer);

    //  STEP 2: THIS IS THE ONLY CHANGE YOU NEED TO MAKE
    // Replace the old text extraction block with this single line.
    // This one function handles normal PDFs, Word docs, AND Canva resumes correctly.
    const rawText = await parserService.extractTextFromFile(file);

    // 3. Match and add skills from the resume (This logic is now fixed)
    const allSkills = await skillService.getAllSkills();
    const lowerCaseText = rawText.toLowerCase();

    const matchedSkills = [];
    for (const skill of allSkills) {
      if (lowerCaseText.includes(skill.name.toLowerCase())) {
        await skillService.addEmployeeSkill(userId, skill.name);
        matchedSkills.push(skill.name);
      }
    }

    // 4. Update the employee's resume paths (This part is unchanged)
    const extractedData = await parserService.parseResume(file);
    const pdfBuffer = await pdfService.generatePDF(extractedData);
    const dateStr = new Date().toISOString().split("T")[0]; 
    // const formattedFilename = `company_format_${userId}_${dateStr}.pdf`;
    const formattedFilename = `${employeeName}_CompanyFormat_${dateStr}.pdf`;

    const formattedFilePath = path.join(__dirname, '..', 'uploads', 'formatted', formattedFilename);
    await fs.writeFile(formattedFilePath, pdfBuffer);
    
    await dbPool.query(
      "UPDATE employees SET original_resume_path = ?, formatted_resume_path = ? WHERE id = ?",
      [originalFilename, formattedFilename, userId]
    );

    // 5. Send success response back to the frontend
    res.status(200).json({
      success: true,
      message: "Resume processed successfully.",
      matchedSkills: matchedSkills,
      downloadFilename: formattedFilename,
    });
  } catch (error) {
    console.error(" Error in processResume controller:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

// This controller function will now handle manual skill additions
exports.addManualSkill = async (req, res) => {
  try {
    const { userId } = req.params;
    const { skillName } = req.body;
    
    if (!skillName || !userId) {
      return res.status(400).json({ error: "Missing skillName or userId" });
    }
    
    const addedSkill = await skillService.addEmployeeSkill(userId, skillName);
    res.status(201).json({ success: true, message: "Skill added successfully", skill: addedSkill });
    
  } catch (error) {
    console.error(" Error adding manual skill:", error);
    res.status(500).json({ error: "Failed to add skill" });
  }
};

