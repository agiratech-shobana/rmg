



   // backend/services/skillService.js
const dbPool = require('../db');

// Add a new skill to the main skills table
const addSkillToDb = async (skillName) => {
    const [result] = await dbPool.query("INSERT INTO skills (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name", [skillName]);
  return result.insertId;
};

// Add a skill to an employee's profile. Handles adding the skill to the main table first if needed.
const addEmployeeSkill = async (employeeId, skillName) => {
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
