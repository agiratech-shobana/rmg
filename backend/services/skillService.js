
    // //this is the resume controller
    // // --- Add these new imports at the top ---
    // const fs = require('fs-extra');
    // const path = require('path');

    // // --- Your existing imports ---
    // const pdfParse = require("pdf-parse");
    // const mammoth = require("mammoth");
    // // const db = require("../db");
    // const dbPool = require("../db");
    // const parserService = require("../services/parserService");
    // const pdfService = require("../services/pdfService");


    // exports.processResume = async (req, res) => {
    //     try {
    //     const { userId } = req.params;
    //     if (!req.file) {
    //         return res.status(400).json({ error: "No file uploaded." });
    //     }

    //     const { file } = req;
    //     const ext = path.extname(file.originalname).toLowerCase();

    //     // Steps 1-4: File handling and parsing (These are correct)
    //     const originalFilename = `original_${userId}_${Date.now()}${ext}`;
    //     const originalFilePath = path.join(__dirname, '..', 'uploads', 'originals', originalFilename);
    //     await fs.writeFile(originalFilePath, file.buffer);

    //     console.log("Parsing resume with AI...");
    //     const extractedData = await parserService.parseResume(file);
    //     if (!extractedData) {
    //         throw new Error("Failed to extract data from resume.");
    //     }

    //     console.log("Generating company-formatted PDF...");
    //     const pdfBuffer = await pdfService.generatePDF(extractedData);
    //     const dateStr = new Date().toISOString().split("T")[0]; 
    //     const formattedFilename = `company_format_${userId}_${dateStr}.pdf`;
    //     const formattedFilePath = path.join(__dirname, '..', 'uploads', 'formatted', formattedFilename);
    //     await fs.writeFile(formattedFilePath, pdfBuffer);

    //     let rawText = "";
    //     if (ext === ".pdf") {
    //         const pdfData = await pdfParse(file.buffer);
    //         rawText = pdfData.text;
    //     } else if (ext === ".docx" || ext === ".doc") {
    //         const result = await mammoth.extractRawText({ buffer: file.buffer });
    //         rawText = result.value;
    //     }

    //     // Step 5: Find which skills from your DB are in the resume text
    //     console.log("Matching skills and updating database...");
        
    //     // --- REFACTORED: Replaced 'new Promise' with a direct 'await' call ---
    //     const [skillsInDb] = await dbPool.query("SELECT id, name FROM skills");

    //     // const matchedSkills = [];
    //     // const lowerCaseText = rawText.toLowerCase();

    //     // for (const skill of skillsInDb) {
    //     //   if (lowerCaseText.includes(skill.name.toLowerCase())) {
    //     //     matchedSkills.push(skill.name);
            
    //     //     // --- REFACTORED: Added 'await' for reliability ---
    //     //     await dbPool.query(
    //     //       "INSERT INTO employee_skills (employee_id, skill_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE employee_id=employee_id",
    //     //       [userId, skill.id]
    //     //     );
    //     //   }
    //     // }
    //     const matchedSkillsSet = new Set();
    // const lowerCaseText = rawText.toLowerCase();

    // for (const skill of skillsInDb) {
    //     if (lowerCaseText.includes(skill.name.toLowerCase())) {
    //     matchedSkillsSet.add(skill.name); // ✅ ensures uniqueness
    //     await dbPool.query(
    //         "INSERT INTO employee_skills (employee_id, skill_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE employee_id=employee_id",
    //         [userId, skill.id]
    //     );
    //     }
    // }

    // const matchedSkills = Array.from(matchedSkillsSet);


    //     // Step 6: Update the employee's record in the database with the new file paths
    //     // --- REFACTORED: Replaced 'new Promise' with a direct 'await' call ---
    //     await dbPool.query(
    //         "UPDATE employees SET original_resume_path = ?, formatted_resume_path = ? WHERE id = ?",
    //         [originalFilename, formattedFilename, userId]
    //     );

    //     // Step 7: Send a success response back to the frontend
    //     // res.status(200).json({
    //     //   success: true,
    //     //   message: "Resume processed successfully.",
    //     //   matchedSkills: matchedSkills,
    //     //   downloadFilename: formattedFilename,
    //     // });

    // //     const [allUserSkills] = await dbPool.query(
    // //   `SELECT s.name 
    // //    FROM employee_skills es
    // //    JOIN skills s ON es.skill_id = s.id
    // //    WHERE es.employee_id = ?`,
    // //   [userId]
    // // );
    // // const allSkills = employeeSkills.map(s => s.name);

    // // // ✅ remove duplicates just in case
    // // const uniqueSkills = [...new Set(allSkills)];

    // // // Step 8: Send merged list back
    // // res.status(200).json({
    // //   success: true,
    // //   message: "Resume processed successfully.",
    // //   matchedSkills: uniqueSkills, // now includes manual + resume skills
    // //   downloadFilename: formattedFilename,
    // // });
    // const [allUserSkills] = await dbPool.query(
    //     `SELECT s.name 
    //     FROM employee_skills es
    //     JOIN skills s ON es.skill_id = s.id
    //     WHERE es.employee_id = ?`,
    //     [userId]
    // );

    // const allSkills = allUserSkills.map(s => s.name);

    // // ✅ remove duplicates just in case
    // const uniqueSkills = [...new Set(allSkills)];

    // // Step 8: Send merged list back
    // res.status(200).json({
    //     success: true,
    //     message: "Resume processed successfully.",
    //     matchedSkills: uniqueSkills, // includes manual + extracted
    //     downloadFilename: formattedFilename,
    // });
    //     } catch (error) {
    //     console.error("❌ Error in processResume controller:", error);
    //     res.status(500).json({ error: "An unexpected error occurred." });
    //     }
    // };




    // // --- We keep your old functions below just in case they are used elsewhere ---
    // // --- You can delete them later if you are sure they are not needed. ---

    // exports.extract = async (req, res) => {
    //     try {
    //     if (!req.file) {
    //         return res.status(400).json({ error: "No file uploaded" });
    //     }
    //     const extractedData = await parserService.parseResume(req.file);
    //     res.json({ extracted: extractedData });
    //     } catch (error) {
    //     console.error("❌ Error processing request:", error);
    //     res.status(500).json({ error: "Failed to process resume" });
    //     }
    // };

    // exports.generatePDF = async (req, res) => {
    //     try {
    //     const pdfBuffer = await pdfService.generatePDF(req.body);
    //     res.set({
    //         "Content-Type": "application/pdf",
    //         "Content-Disposition": "attachment; filename=company_resume.pdf",
    //     });
    //     res.send(pdfBuffer);
    //     } catch (error) {
    //     console.error("❌ Error generating PDF:", error);
    //     res.status(500).send("Error generating PDF");
    //     }
    // };



    // // Add new manual skill function
    // exports.addManualSkill = async (req, res) => {
    //     try {
    //     const { userId } = req.params;
    //     const { skillName } = req.body;

    //     if (!skillName || !userId) {
    //         return res.status(400).json({ error: "Missing skillName or userId" });
    //     }

    //     // 1. Check if skill exists in `skills` table
    //     const [existingSkill] = await dbPool.query(
    //         "SELECT id FROM skills WHERE LOWER(name) = LOWER(?)",
    //         [skillName]
    //     );

    //     let skillId;
    //     if (existingSkill.length > 0) {
    //         skillId = existingSkill[0].id;
    //     } else {
    //         // 2. Insert new skill into skills table
    //         const [insertResult] = await dbPool.query(
    //         "INSERT INTO skills (name) VALUES (?)",
    //         [skillName]
    //         );
    //         skillId = insertResult.insertId;
    //     }

    //     // 3. Insert into employee_skills (prevent duplicates)
    //     await dbPool.query(
    //         "INSERT INTO employee_skills (employee_id, skill_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE employee_id=employee_id",
    //         [userId, skillId]
    //     );

    //     res.status(200).json({ success: true, message: "Skill added successfully", skillId });
    //     } catch (error) {
    //     console.error("❌ Error adding manual skill:", error);
    //     res.status(500).json({ error: "Failed to add skill" });
    //     }
    // };




    // // this is the resume rouutes



    // // backend/routes/resumeRoutes.js
    // // const db = require("../db");
    // const dbPool = require("../db"); // Use the promise-based pool
    // const express = require("express");
    // const multer = require("multer");

    // const path = require("path"); // <-- Make sure this is imported
    // const resumeController = require("../controllers/resumeController");

    // const router = express.Router();
    // const upload = multer({ storage: multer.memoryStorage() });

    // // =================================================================
    // // NEW ROUTES
    // // =================================================================

    // // This is our main route for the single upload feature
    // router.post(
    // "/process/:userId",
    // upload.single("resume"),
    // resumeController.processResume
    // );

    // // This route lets the user download the generated PDF
    // router.get("/download/:filename", (req, res) => {
    // const { filename } = req.params;
    // const safePath = path.join(__dirname, '..', 'uploads', 'formatted', filename);

    // // Security check to prevent users from accessing files outside the intended folder
    // if (!safePath.startsWith(path.join(__dirname, '..', 'uploads', 'formatted'))) {
    //     return res.status(403).send("Forbidden");
    // }

    // res.download(safePath, (err) => {
    //     if (err) {
    //     console.error("File download error:", err);
    //     res.status(404).send("File not found.");
    //     }
    // });
    // });

    // router.get("/employee/:userId", async (req, res) => {
    // const { userId } = req.params;
    // console.log(`[DEBUG] Attempting to fetch data for userId: ${userId}`);

    // try {
    //     // This 'await' call is what causes the error if the function is not 'async'.
    //     // ADDED 'DISTINCT' to GROUP_CONCAT to prevent duplicate skills.
    //     const [results] = await dbPool.query(
    //     `SELECT 
    //         e.original_resume_path, 
    //         e.formatted_resume_path, 
    //         GROUP_CONCAT(DISTINCT s.name SEPARATOR '|||') AS skills
    //     FROM employees e
    //     LEFT JOIN employee_skills es ON e.id = es.employee_id
    //     LEFT JOIN skills s ON es.skill_id = s.id
    //     WHERE e.id = ?
    //     GROUP BY e.id`,
    //     [userId]
    //     );

    //     console.log(`[DEBUG] SQL query completed for userId: ${userId}. Rows found: ${results.length}`);

    //     if (results.length === 0) {
    //     return res.status(404).json({ error: "Employee not found" });
    //     }

    //     const employeeData = results[0];
    //     console.log(`[DEBUG] Employee data found:`, employeeData);
        
    //     if (!employeeData.formatted_resume_path) {
    //         console.log(`[DEBUG] No formatted resume found for userId: ${userId}. Sending empty response.`);
    //         return res.json({ resume: null, skills: [] });
    //     }

    //     const skillsArray = employeeData.skills ? employeeData.skills.split('|||') : [];

    //     res.json({
    //     resume: {
    //         original: employeeData.original_resume_path,
    //         formatted: employeeData.formatted_resume_path,
    //     },
    //     skills: skillsArray,
    //     });

    // } catch (error) {
    //     console.error(`❌ CRITICAL ERROR fetching resume data for employee ${userId}:`, error);
    //     res.status(500).json({ error: "Database query failed" });
    // }
    // });


    // // =================================================================
    // // OLD ROUTES (can be deleted later)
    // // =================================================================

    // router.post("/extract", upload.single("resume"), resumeController.extract);
    // router.post("/resume-template", resumeController.generatePDF);
    // // The old '/upload/:userId' is now handled by '/process/:userId' so it's gone.



    // // Add manual skill route
    // router.post("/employee/:userId/add-skill", resumeController.addManualSkill);


    // module.exports = router;







    // import React, { useEffect, useState } from "react";
    // import {
    // Box,
    // Button,
    // Card,
    // CardContent,
    // Typography,
    // TextField,
    // Pagination,
    // CircularProgress,
    // Divider,
    // Chip,
    // } from "@mui/material";
    // import axios from "axios";
    // interface User {
    // id: number;
    // name: string;
    // email: string;
    // }

    // const UsersList: React.FC = () => {
    // const [users, setUsers] = useState<User[]>([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);
    // const [searchTerm, setSearchTerm] = useState("");
    // const [currentPage, setCurrentPage] = useState(1);
    // const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // const [isProcessing, setIsProcessing] = useState(false);
    // const [uploadMessage, setUploadMessage] = useState<string>("");
    // const [resumeFile, setResumeFile] = useState<File | null>(null);
    // const [downloadFilename, setDownloadFilename] = useState<string | null>(null);
    // const [matchedSkills, setMatchedSkills] = useState<string[]>([]);

    // const [userLoggedHours, setUserLoggedHours] = useState<number | null>(null);
    // const [hoursLoading, setHoursLoading] = useState(false);
    // const [lastProject, setLastProject] = useState<ProjectInfo | null>(null);
    // const [lastProjectLoading, setLastProjectLoading] = useState(false);  

    // const [newSkill, setNewSkill] = useState("");

    // const USERS_PER_PAGE = 7;

    // useEffect(() => {
    //     fetch("http://localhost:5000/api/users")
    //     .then((res) => res.json())
    //     .then((data) => {
    //         setUsers(data);
    //         setLoading(false);
    //     })
    //     .catch((err) => {
    //         setError(err.message);
    //         setLoading(false);
    //     });
    // }, []);

    // useEffect(() => {
    //     if (!selectedUser) return;

    //     setIsProcessing(false);
    //     setUploadMessage("");
    //     setResumeFile(null);
    //     setDownloadFilename(null);
    //     setMatchedSkills([]);

    //     fetch(`http://localhost:5000/api/resumes/employee/${selectedUser.id}`)
    //     .then((res) => res.json())
    //     .then((data) => {
    //         if (data.resume) {
    //         if (data.resume.formatted) setDownloadFilename(data.resume.formatted);
    //         // if (data.skills) setMatchedSkills(data.skills);
    //         if (Array.isArray(data.skills)) {
    // setMatchedSkills(data.skills);
    // }

    //         setUploadMessage("Existing resume loaded.");
    //         } else {
    //         setUploadMessage("No resume uploaded yet.");
    //         }
    //     })
    //     .catch(() => setUploadMessage("Failed to fetch resume data."));
    // }, [selectedUser]);


    // useEffect(() => {
    //     if (!selectedUser) {
    //     setUserLoggedHours(null);
    //     return;
    //     }
    //     setHoursLoading(true);
    //     fetch(`http://localhost:5000/api/users/${selectedUser.id}/logged-hours`)
    //     .then((res) => res.json())
    //     .then((data) => {
    //         setUserLoggedHours(data.loggedHours);
    //     })
    //     .catch((err) => {
    //         console.error("Failed to fetch logged hours:", err);
    //         setUserLoggedHours(null);
    //     })
    //     .finally(() => {
    //         setHoursLoading(false);
    //     });
    // }, [selectedUser]);

    // useEffect(() => {
    //     if (!selectedUser) {
    //     setLastProject(null);
    //     return;
    //     }

    //     setLastProjectLoading(true);
    //     axios.get(`http://localhost:5000/api/users/${selectedUser.id}/memberships`)
    //     .then(res => {
    //         const memberships = res.data?.user?.memberships;
    //         if (memberships && memberships.length > 0) {
    //             const latestMembership = memberships[memberships.length - 1]; // Get the last project in the array
    //             setLastProject(latestMembership.project);
    //         } else {
    //             setLastProject(null);
    //         }
    //     })
    //     .catch(err => {
    //         console.error("Failed to fetch memberships:", err);
    //         setLastProject(null);
    //     })
    //     .finally(() => {
    //         setLastProjectLoading(false);
    //     });
    // }, [selectedUser]);



    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files?.length) {
    //     setResumeFile(e.target.files[0]);
    //     setUploadMessage("");
    //     setDownloadFilename(null);
    //     }
    // };

    // const handleProcessResume = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!selectedUser || !resumeFile) {
    //     setUploadMessage("Please select a user and a file.");
    //     return;
    //     }

    //     setIsProcessing(true);
    //     setUploadMessage("Processing resume...");

    //     const formData = new FormData();
    //     formData.append("resume", resumeFile);

    //     try {
    //     const response = await fetch(
    //         `http://localhost:5000/api/resumes/process/${selectedUser.id}`,
    //         { method: "POST", body: formData }
    //     );
    //     const data = await response.json();
    //     if (!response.ok) throw new Error(data.error || "Unknown error");
    //     setUploadMessage("Resume processed successfully!");
    //     setMatchedSkills(data.matchedSkills || []);
    //     setDownloadFilename(data.downloadFilename || null);
    //     } catch (error: any) {
    //     setUploadMessage(`Error: ${error.message}`);
    //     } finally {
    //     setIsProcessing(false);
    //     }
    // };

    // const filteredUsers = users.filter((u) =>
    //     u.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    // const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    // const currentUsers = filteredUsers.slice(
    //     (currentPage - 1) * USERS_PER_PAGE,
    //     currentPage * USERS_PER_PAGE
    // );

    // if (loading)
    //     return (
    //     <Box p={4} textAlign="center">
    //         <CircularProgress />
    //         <Typography mt={2}>Loading users...</Typography>
    //     </Box>
    //     );

    // if (error)
    //     return (
    //     <Box p={4} textAlign="center" color="red">
    //         <Typography>Error: {error}</Typography>
    //     </Box>
    //     );


    //     const handleAddSkill = async () => {
    // if (!selectedUser || !newSkill.trim()) return;

    // try {
    //     const res = await axios.post(
    //     `http://localhost:5000/api/resumes/employee/${selectedUser.id}/add-skill`,
    //     { skillName: newSkill }
    //     );

    //     // if (res.data.success) {
    //     //   setMatchedSkills((prev) => [...prev, newSkill]); // update UI instantly
    //     //   setNewSkill("");
    //     // }



    //     if (res.data.success) {
    // setMatchedSkills((prev) =>
    //     prev.includes(newSkill) ? prev : [...prev, newSkill]
    // );
    // setNewSkill("");
    // }
    // } catch (err) {
    //     console.error("Error adding skill:", err);
    // }
    // };


    // return (
    //     <Box display="flex" height="100vh">
    //     {/* Left Panel: User List */}
    //     <Box
    //         flex={1}
    //         // maxWidth="350px"
    //         width={900}
    //         p={3}
    //         borderRight="1px solid #e0e0e0"
    //         display="flex"
    //         flexDirection="column"
    //     >
    //         <TextField
    //         label="Search by name"
    //         variant="outlined"
    //         fullWidth
    //         value={searchTerm}
    //         onChange={(e) => setSearchTerm(e.target.value)}
    //         sx={{ mb: 2 }}
    //         />
    //         <Box flex={1} overflow="auto" display="flex" flexDirection="column" gap={2}>
    //         {currentUsers.map((u) => (
    //             <Card
    //             key={u.id}
    //             onClick={() => setSelectedUser(u)}
    //             sx={{
    //                 cursor: "pointer",
    //                 border:
    //                 selectedUser?.id === u.id
    //                     ? "2px solid #1976d2"
    //                     : "1px solid #e0e0e0",
    //             }}
    //             >
    //             <CardContent>
    //                 <Typography variant="subtitle1" fontWeight="bold">
    //                 {u.name}
    //                 </Typography>
    //                 <Typography variant="body2" color="textSecondary">
    //                 {u.email}
    //                 </Typography>
    //             </CardContent>
    //             </Card>
    //         ))}
    //         </Box>
    //         <Box mt={2} display="flex" justifyContent="center">
    //         <Pagination
    //             count={totalPages}
    //             page={currentPage}
    //             onChange={(_, value) => setCurrentPage(value)}
    //             color="primary"
    //         />
    //         </Box>
    //     </Box>

    //     {/* Right Panel: User Details & Resume Upload */}
    //     <Box flex={2} p={3} overflow="auto" width={"100%"}>
    //         <Card sx={{ height: "100%" }}>
    //         <CardContent>
    //             <Typography variant="h6" gutterBottom>
    //             Employee Details
    //             </Typography>
    //             {selectedUser ? (
    //             <>
    //                 <Typography>
    //                 <strong>Name:</strong> {selectedUser.name}
    //                 </Typography>
    //                 <Typography>
    //                 <strong>Email:</strong> {selectedUser.email}
    //                 </Typography>
    //                 {hoursLoading ? (
    //                 <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
    //                     <CircularProgress size={16} sx={{ mr: 1 }} />
    //                     <Typography>Loading hours...</Typography>
    //                 </Box>
    //                 ) : (
    //                 userLoggedHours !== null && (
    //                     <Typography>
    //                     <strong>Logged Hours:</strong> {userLoggedHours} hrs
    //                     </Typography>
    //                 )
    //                 )}

    //                 {lastProjectLoading ? (
    //                     <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
    //                         <CircularProgress size={16} sx={{ mr: 1 }} />
    //                         <Typography>Loading last project...</Typography>
    //                     </Box>
    //                 ) : (
    //                     lastProject && (
    //                         <Typography>
    //                             <strong>Last Project:</strong> {lastProject.name}
    //                         </Typography>
    //                     )
    //                 )}


    //                 <Divider sx={{ my: 3 }} />

    //                 <Typography variant="subtitle1" gutterBottom>
    //                 Upload and Process Resume
    //                 </Typography>
    //                 <form onSubmit={handleProcessResume}>
    //                 <input
    //                     type="file"
    //                     accept=".pdf,.doc,.docx"
    //                     onChange={handleFileChange}
    //                     disabled={isProcessing}
    //                 />
    //                 <br />
    //                 <Button
    //                     type="submit"
    //                     variant="contained"
    //                     sx={{ mt: 2 }}
    //                     disabled={isProcessing || !resumeFile}
    //                 >
    //                     {isProcessing ? "Processing..." : "Upload & Process"}
    //                 </Button>
    //                 </form>

    //                 {uploadMessage && (
    //                 <Typography
    //                     mt={2}
    //                     color={
    //                     uploadMessage.startsWith("Error") ? "error" : "success.main"
    //                     }
    //                 >
    //                     {uploadMessage}
    //                 </Typography>
    //                 )}

    //                 {/* {matchedSkills.length > 0 && (
    //                 <Box mt={3}>
    //                     <Typography fontWeight="bold">Matched Skills</Typography>
    //                     <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
    //                     {matchedSkills.map((skill, i) => (
    //                         <Chip key={i} label={skill} color="primary" />
    //                     ))}
    //                     </Box>
    //                 </Box>
    //                 )} */}


    //                 <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
    // {matchedSkills.map((skill, i) => (
    //     <Chip key={i} label={skill} color="primary" />
    // ))}
    // </Box>

    // {/* Add new skill manually */}
    // <Box mt={2} display="flex" gap={1}>
    // <TextField
    //     label="Add Skill"
    //     value={newSkill}
    //     onChange={(e) => setNewSkill(e.target.value)}
    //     size="small"
    // />
    // <Button
    //     variant="contained"
    //     onClick={handleAddSkill}
    //     disabled={!newSkill.trim()}
    // >
    //     Add
    // </Button>
    // </Box>
    

    //                 {downloadFilename && (
    //                 <Box mt={3}>
    //                     <Typography fontWeight="bold">
    //                     Download Formatted Resume
    //                     </Typography>
    //                     <Button
    //                     href={`http://localhost:5000/api/resumes/download/${downloadFilename}`}
    //                     target="_blank"
    //                     variant="outlined"
    //                     sx={{ mt: 1 }}
    //                     >
    //                     Download PDF
    //                     </Button>
    //                 </Box>
    //                 )}
    //             </>
    //             ) : (
    //             <Typography>Select a user to view details and upload resume.</Typography>
    //             )}
    //         </CardContent>
    //         </Card>
    //     </Box>
    //     </Box>
    // );
    // };

    // export default UsersList;


    // //this is the userLisit

   // backend/services/skillService.js
const dbPool = require('../db');

// Add a new skill to the main skills table
const addSkillToDb = async (skillName) => {
//   const [result] = await dbPool.query("INSERT INTO skills (name) VALUES (?)", [skillName]);
    const [result] = await dbPool.query("INSERT INTO skills (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name", [skillName]);
  return result.insertId;
};

// Add a skill to an employee's profile. Handles adding the skill to the main table first if needed.
const addEmployeeSkill = async (employeeId, skillName) => {
  // Check if skill already exists in the skills table
  const [existingSkillRows] = await dbPool.query(
    "SELECT id FROM skills WHERE LOWER(name) = LOWER(?)",
    [skillName]
  );
  
  let skillId;
  if (existingSkillRows.length > 0) {
    skillId = existingSkillRows[0].id;
  } else {
    // If not, add it to the skills table first
    skillId = await addSkillToDb(skillName);
  }

  // Insert into employee_skills table
  await dbPool.query(
    "INSERT INTO employee_skills (employee_id, skill_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE employee_id=employee_id",
    [employeeId, skillId]
  );
  
  return { id: skillId, name: skillName };
};

// Fetch all skills for a given employee
const getEmployeeSkills = async (employeeId) => {
    const [rows] = await dbPool.query(
        "SELECT s.id, s.name FROM employee_skills es JOIN skills s ON es.skill_id = s.id WHERE es.employee_id = ?",
        [employeeId]
    );
    return rows;
};

// Fetch all skills from the main skills table
const getAllSkills = async () => {
    const [rows] = await dbPool.query("SELECT id, name FROM skills ORDER BY name ASC");
    return rows;
};

module.exports = {
  addEmployeeSkill,
  getEmployeeSkills,
  getAllSkills,
};
