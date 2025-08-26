// // backend/controllers/userController.js

// const db = require('../db');

// exports.getUserDetails = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const query = `
//             SELECT 
//                 e.id,
//                 e.name,
//                 e.email,
//                 e.formatted_resume_path,
//                 s.name AS skillName
//             FROM 
//                 employees e
//             LEFT JOIN 
//                 employee_skills es ON e.id = es.employee_id
//             LEFT JOIN 
//                 skills s ON es.skill_id = s.id
//             WHERE 
//                 e.id = ?
//         `;

//         db.query(query, [userId], (err, results) => {
//             if (err) {
//                 console.error("DB Error fetching user details:", err);
//                 return res.status(500).json({ error: "Database error" });
//             }

//             if (results.length === 0) {
//                 return res.status(404).json({ error: "User not found" });
//             }

//             // This logic groups the skills into a single array
//             const userDetails = {
//                 id: results[0].id,
//                 name: results[0].name,
//                 email: results[0].email,
//                 formatted_resume_path: results[0].formatted_resume_path,
//                 skills: results[0].skillName ? results.map(row => row.skillName) : []
//             };

//             res.json(userDetails);
//         });

//     } catch (error) {
//         console.error("Error in getUserDetails:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// };