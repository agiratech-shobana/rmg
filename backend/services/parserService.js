const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Groq = require("groq-sdk");
const dotenv = require("dotenv");

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractText(file) {  
  if (file.mimetype === "application/pdf") {
    const pdfData = await pdfParse(file.buffer);
    return pdfData.text;
  } else if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  } else {
    throw new Error("Unsupported file format");
  }
}



async function parseSkills(skillsText) {
  try {
    const skillsCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an expert skills parser. Take the raw skills text and structure it into a JSON object. The keys should be skill categories and the values a comma-separated string of skills. If a category is not explicitly mentioned, group all skills under a single 'Technical Skills' key. Do not add conversational text."
        },
        {
          role: "user",
          content: `Raw skills text:\n${skillsText}\n\nExtract this text into a JSON object.`
        }
      ],
      temperature: 0,
    });
    let skillsOutput = skillsCompletion.choices[0]?.message?.content?.trim() || "{}";
    if (skillsOutput.startsWith("```")) {
      skillsOutput = skillsOutput.replace(/```json|```/g, "").trim();
    }
    return JSON.parse(skillsOutput);
  } catch (e) {
    console.error("❌ Failed to parse skills with Groq:", e.message);
    return { "Technical Skills": skillsText };
  }
}

async function parseProjects(projectsText) {
  try {
    const projectCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an expert project parser. Take the raw project text and structure it into a JSON array of objects. Each object should have 'title', 'description', 'roles', and 'techStack'. The 'roles' and 'techStack' should be an array of strings. If a detail is missing, provide an empty string or an empty array. Do not add conversational text."
        },
        {
          role: "user",
          content: `Raw project text:\n${projectsText}\n\nExtract this text into a JSON array of project objects.`
        }
      ],
      temperature: 0,
    });
    let projectOutput = projectCompletion.choices[0]?.message?.content?.trim() || "[]";
    if (projectOutput.startsWith("```")) {
      projectOutput = projectOutput.replace(/```json|```/g, "").trim();
    }
    return JSON.parse(projectOutput);
  } catch (e) {
    console.error("❌ Failed to parse projects with Groq:", e.message);
    return [];
  }
}

exports.parseResume = async (file) => {
  const resumeText = await extractText(file);
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are a resume parser. Your primary goal is to extract specific sections of text as raw strings. Ensure the output is a single-line, minified JSON string without any newline or control characters that could break parsing. Always return valid JSON."
      },
      {
        role: "user",
        content: `Resume text:\n${resumeText}\n\nExtract the following sections as raw text, placing them under the specified JSON keys: name, designation, careerObjectiveOrSummary, skills, projects. For 'name', extract only the full name. For 'skills', extract everything from the skills heading until the next major section. For 'projects', extract everything from the projects heading until the next major section. Return a JSON object only.`
      }
    ],
    temperature: 0,
  });

  let extractedText = completion.choices[0]?.message?.content?.trim() || "";
  if (extractedText.startsWith("```")) {
    extractedText = extractedText.replace(/```json|```/g, "").trim();
  }
  let extracted = JSON.parse(extractedText);

  extracted.parsedSkills = extracted.skills ? await parseSkills(extracted.skills) : {};
  extracted.parsedProjects = extracted.projects ? await parseProjects(extracted.projects) : [];

  return extracted;
};