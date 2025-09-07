// // const pdfParse = require("pdf-parse");
// // const mammoth = require("mammoth");
// // const Groq = require("groq-sdk");
// // const dotenv = require("dotenv");

// // dotenv.config();

// // const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // async function extractText(file) {  
// //   if (file.mimetype === "application/pdf") {
// //     const pdfData = await pdfParse(file.buffer);
// //     return pdfData.text;
// //   } else if (
// //     file.mimetype ===
// //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
// //     file.mimetype === "application/msword"
// //   ) {
// //     const result = await mammoth.extractRawText({ buffer: file.buffer });
// //     return result.value;
// //   } else {
// //     throw new Error("Unsupported file format");
// //   }
// // }

// // async function parseSkills(skillsText) {
// //   try {
// //     const skillsCompletion = await groq.chat.completions.create({
// //       model: "llama-3.1-8b-instant",
// //       messages: [
// //         {
// //           role: "system",
// //           content: "You are an expert skills parser. Take the raw skills text and structure it into a JSON object. The keys should be skill categories and the values a comma-separated string of skills. If a category is not explicitly mentioned, group all skills under a single 'Technical Skills' key. Do not add conversational text."
// //         },
// //         {
// //           role: "user",
// //           content: `Raw skills text:\n${skillsText}\n\nExtract this text into a JSON object.`
// //         }
// //       ],
// //       temperature: 0,
// //     });
// //     let skillsOutput = skillsCompletion.choices[0]?.message?.content?.trim() || "{}";
// //     if (skillsOutput.startsWith("```")) {
// //       skillsOutput = skillsOutput.replace(/```json|```/g, "").trim();
// //     }
// //     return JSON.parse(skillsOutput);
// //   } catch (e) {
// //     console.error("❌ Failed to parse skills with Groq:", e.message);
// //     return { "Technical Skills": skillsText };
// //   }
// // }

// // async function parseProjects(projectsText) {
// //   try {
// //     const projectCompletion = await groq.chat.completions.create({
// //       model: "llama-3.1-8b-instant",
// //       messages: [
// //         {
// //           role: "system",
// //           content: "You are an expert project parser. Take the raw project text and structure it into a JSON array of objects. Each object should have 'title', 'description', 'roles', and 'techStack'. The 'roles' and 'techStack' should be an array of strings. If a detail is missing, provide an empty string or an empty array. Do not add conversational text."
// //         },
// //         {
// //           role: "user",
// //           content: `Raw project text:\n${projectsText}\n\nExtract this text into a JSON array of project objects.`
// //         }
// //       ],
// //       temperature: 0,
// //     });
// //     let projectOutput = projectCompletion.choices[0]?.message?.content?.trim() || "[]";
// //     if (projectOutput.startsWith("```")) {
// //       projectOutput = projectOutput.replace(/```json|```/g, "").trim();
// //     }
// //     return JSON.parse(projectOutput);
// //   } catch (e) {
// //     console.error("❌ Failed to parse projects with Groq:", e.message);
// //     return [];
// //   }
// // }

// // exports.parseResume = async (file) => {
// //   const resumeText = await extractText(file);
// //   const completion = await groq.chat.completions.create({
// //     model: "llama-3.1-8b-instant",
// //     messages: [
// //       {
// //         role: "system",
// //         content: "You are a resume parser. Your primary goal is to extract specific sections of text as raw strings. Ensure the output is a single-line, minified JSON string without any newline or control characters that could break parsing. Always return valid JSON."
// //       },
// //       {
// //         role: "user",
// //         content: `Resume text:\n${resumeText}\n\nExtract the following sections as raw text, placing them under the specified JSON keys: name, designation, careerObjectiveOrSummary, skills, projects. For 'name', extract only the full name. For 'skills', extract everything from the skills heading until the next major section. For 'projects', extract everything from the projects heading until the next major section. Return a JSON object only.`
// //       }
// //     ],
// //     temperature: 0,
// //   });

// //   let extractedText = completion.choices[0]?.message?.content?.trim() || "";
// //   if (extractedText.startsWith("```")) {
// //     extractedText = extractedText.replace(/```json|```/g, "").trim();
// //   }
// //   let extracted = JSON.parse(extractedText);

// //   extracted.parsedSkills = extracted.skills ? await parseSkills(extracted.skills) : {};
// //   extracted.parsedProjects = extracted.projects ? await parseProjects(extracted.projects) : [];

// //   return extracted;
// // };



// const pdfParse = require("pdf-parse");
// const mammoth = require("mammoth");
// const Groq = require("groq-sdk");
// const dotenv = require("dotenv");

// dotenv.config();

// // Ensure your GROQ_API_KEY is set in your .env file
// if (!process.env.GROQ_API_KEY) {
//   throw new Error("GROQ_API_KEY is not set in the environment variables.");
// }

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// /**
//  * Extracts raw text from an uploaded file buffer (PDF or DOCX).
//  * @param {object} file - The file object from multer, containing the buffer and mimetype.
//  * @returns {Promise<string>} A promise that resolves to the extracted text.
//  */
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
//     // This error will be caught by the controller and sent to the user.
//     throw new Error("Unsupported file format. Please upload a PDF or DOCX file.");
//   }
// }

// /**
//  * Parses resume text using a single, intelligent call to the Groq API.
//  * @param {object} file - The file object from multer.
//  * @returns {Promise<object>} A promise that resolves to the structured resume data.
//  */
// // exports.parseResume = async (file) => {
// //   // Step 1: Extract text from the uploaded document.
// //   const resumeText = await extractText(file);

// //   // Step 2: Perform a single, comprehensive API call to parse the entire resume.
// //   try {
// //     const completion = await groq.chat.completions.create({
// //       // Consider using "llama-3.1-70b-versatile" for higher accuracy on complex resumes.
// //       // "llama-3.1-8b-instant" is faster but may be less accurate.
// //       model: "llama-3.1-8b-instant",
// //       messages: [
// //         {
// //           role: "system",
// //           content: `You are an expert resume parsing AI. Your task is to analyze the provided resume text and convert it into a structured JSON object.

// //           Follow these rules strictly:
// //           1.  Your final output MUST be a single, valid JSON object and nothing else.
// //           2.  'name': Extract the full name of the candidate. Default to null if not found.
// //           3.  'designation': Extract the primary job title or role (e.g., "Senior Software Engineer"). Default to null if not found.
// //           4.  'careerObjectiveOrSummary': Extract the professional summary or career objective section. Default to null if not found.
// //           5.  'parsedSkills': Create an object where keys are skill categories (e.g., "Programming Languages", "Databases", "Cloud Technologies", "Tools"). The value for each key must be an array of skill strings. If categories are not clear, group all skills under a single "Technical Skills" key. The final value should be an object, e.g., { "Technical Skills": ["JavaScript", "React"] }. Default to an empty object {} if no skills are found.
// //           6.  'parsedProjects': Create an array of project objects. Each object must have the following keys: 'title', 'description', 'roles' (array of strings), and 'techStack' (array of strings). If a detail is missing for a project, use an empty string or an empty array. Default to an empty array [] if no projects are found.
// //           7.  Do not add any conversational text, explanations, or markdown formatting around the JSON output.`
// //         },
// //         {
// //           role: "user",
// //           content: `Please parse the following resume text into the specified JSON format:\n\n---RESUME TEXT---\n${resumeText}\n---END RESUME TEXT---`
// //         }
// //       ],
// //       temperature: 0.1, // A low temperature for more predictable, factual output.
// //       response_format: { type: "json_object" }, // Guarantees the output will be a valid JSON string.
// //     });

// //     const responseContent = completion.choices[0]?.message?.content;

// //     if (!responseContent) {
// //       throw new Error("AI response was empty.");
// //     }

// //     // Step 3: Parse the guaranteed JSON response.
// //     const parsedData = JSON.parse(responseContent);

// //     // Step 4: Sanitize and structure the data for consistency, ensuring all keys required by the PDF generator are present.
// //     const finalData = {
// //       name: parsedData.name || "Not specified",
// //       designation: parsedData.designation || "Not specified",
// //       careerObjectiveOrSummary: parsedData.careerObjectiveOrSummary || "",
// //       parsedSkills: parsedData.parsedSkills || {},
// //       parsedProjects: parsedData.parsedProjects || [],
// //     };

// //     return finalData;

// //   } catch (error) {
// //     console.error("❌ An error occurred during the Groq API call or parsing:", error);
// //     // This error will propagate to the controller, which should handle it and inform the user.
// //     throw new Error("The AI failed to process the resume. Please check the document's content and format or try again later.");
// //   }
// // };


// // In backend/services/parserService.js

// exports.parseResume = async (file) => {
//   // Step 1: Extract text from the uploaded document (this function remains the same).
//   const resumeText = await extractText(file);

//   // Step 2: Perform the API call with our new, highly-detailed prompt.
//   try {
//     const completion = await groq.chat.completions.create({
//       // The model is unchanged, as you requested.
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "system",
//           // --- THIS IS THE NEW, UPGRADED PROMPT ---
//           content: `You are a highly precise resume-to-JSON conversion engine. Your task is to analyze the resume text provided by the user and convert it into a structured JSON object. Adhere to the following JSON structure and extraction rules meticulously.

//           <json_structure>
//           {
//             "name": "string | null",
//             "designation": "string | null",
//             "careerObjectiveOrSummary": "string | null",
//             "parsedSkills": { "CategoryName": ["skill1", "skill2"], ... },
//             "parsedProjects": [{ "title": "string", "description": "string", "roles": ["string"], "techStack": ["string"] }, ...]
//           }
//           </json_structure>

//           <rules_for_extraction>
//           1.  **name**: Find the most prominent full name, usually at the very top of the resume. Default to null if not found.
//           2.  **designation**: Find the primary job title or professional role, often located directly under the name (e.g., "Senior Software Engineer"). Default to null if not found.
//           3.  **careerObjectiveOrSummary**:
//               - First, scan the top of the resume for a primary introductory section.
//               - Common headings for this section include: "Summary", "Career Objective", "Objective", "Professional Summary", "Professional Profile", or "About Me".
//               - Once a heading is found, capture ALL text, paragraphs, and bullet points that follow it.
//               - IMPORTANT: Stop capturing text when you encounter the next major section heading, such as "Experience", "Skills", "Projects", or "Education".
//               - Preserve all original line breaks from the text.
//           4.  **parsedSkills**:
//               - Find the skills section. Headings might be "Skills", "Technical Skills", "Proficiencies", or "Software Known".
//               - Group the skills into logical categories (e.g., "Programming Languages", "Databases", "Frameworks", "Tools"). If you cannot determine categories, use a single key "Technical Skills".
//               - The value for each category MUST be an array of strings.
//           5.  **parsedProjects**:
//               - Find the projects section. Headings could be "Projects", "Project Experience", or "Personal Projects".
//               - For each distinct project, extract the 'title', 'description', 'roles', and 'techStack'.
//               - Ensure both 'roles' and 'techStack' are returned as arrays of strings, even if there is only one item.
//           </rules_for_extraction>

//           Your final output must be ONLY the JSON object, with no other text, comments, or markdown formatting.`
//         },
//         {
//           role: "user",
//           content: `Please parse the following resume text based on the system instructions.

//           <resume_text>
//           ${resumeText}
//           </resume_text>`
//         }
//       ],
//       temperature: 0.1,
//       response_format: { type: "json_object" },
//     });

//     const responseContent = completion.choices[0]?.message?.content;

//     if (!responseContent) {
//       throw new Error("AI response was empty.");
//     }

//     const parsedData = JSON.parse(responseContent);

//     const finalData = {
//       name: parsedData.name || "Not specified",
//       designation: parsedData.designation || "Not specified",
//       careerObjectiveOrSummary: parsedData.careerObjectiveOrSummary || "",
//       parsedSkills: parsedData.parsedSkills || {},
//       parsedProjects: parsedData.parsedProjects || [],
//     };

//     return finalData;

//   } catch (error) {
//     console.error("❌ An error occurred during the Groq API call or parsing:", error);
//     throw new Error("The AI failed to process the resume. Please check the document's content and format or try again later.");
//   }
// };



const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Groq = require("groq-sdk");
const dotenv = require("dotenv");



const { pdfToPng } = require("pdf-to-png-converter");
const Tesseract = require("tesseract.js");

dotenv.config();

// Ensure your GROQ_API_KEY is set in your .env file
if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in the environment variables.");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Extracts raw text from an uploaded file buffer (PDF or DOCX).
 * @param {object} file - The file object from multer, containing the buffer and mimetype.
 * @returns {Promise<string>} A promise that resolves to the extracted text.
 */
async function extractText(file) {
  if (file.mimetype === "application/pdf") {
    const pdfData = await pdfParse(file.buffer);

    // ✅ If text is found, return it
    if (pdfData.text && pdfData.text.trim().length > 50) {
      return pdfData.text;
    }

    // ⚠️ Fallback to OCR if no text
    console.log("⚠️ No text layer found in PDF, using OCR...");
     const pngPages = await pdfToPng(file.buffer, {
      disableFontFace: true,
      useSystemFonts: true,
      viewportScale: 2.0, // higher = sharper OCR
      outputFolder: "/tmp/pdf-ocr", // temp folder
    });

    let ocrText = "";
    for (const page of pngPages) {
      const { data: { text } } = await Tesseract.recognize(page.content, "eng");
      ocrText += text + "\n";
    }
  
    return ocrText;
  } 
  else if (
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  } 
  else {
    // This error will be caught by the controller and sent to the user.
    throw new Error("Unsupported file format. Please upload a PDF or DOCX file.");
  }
}

exports.parseResume = async (file) => {
  // Step 1: Extract text from the uploaded document
  const resumeText = await extractText(file);

  // Step 2: Perform the API call with our detailed prompt
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a highly precise resume-to-JSON conversion engine. Your task is to analyze the resume text provided by the user and convert it into a structured JSON object. Adhere to the following JSON structure and extraction rules meticulously.

          <json_structure>
          {
            "name": "string | null",
            "designation": "string | null",
            "careerObjectiveOrSummary": "string | null",
            "parsedSkills": { "CategoryName": ["skill1", "skill2"], ... },
            "parsedProjects": [{ "title": "string", "description": "string", "roles": ["string"], "techStack": ["string"] }, ...]
          }
          </json_structure>

          <rules_for_extraction>
          1.  **name**: Find the most prominent full name, usually at the very top of the resume. Default to null if not found.
          2.  **designation**: Find the primary job title or professional role, often located directly under the name.
          3.  **careerObjectiveOrSummary**: Capture all text under headings like Summary, Career Objective, Objective, Professional Summary, etc. Stop at the next major heading.
          4.  **parsedSkills**: Group skills into logical categories (Programming Languages, Databases, Frameworks, Tools, etc.). Use "Technical Skills" if unsure.
          5.  **parsedProjects**: Extract each project with title, description, roles[], techStack[].
          </rules_for_extraction>

          Your final output must be ONLY the JSON object, with no other text, comments, or markdown formatting.`
        },
        {
          role: "user",
          content: `Please parse the following resume text based on the system instructions.

          <resume_text>
          ${resumeText}
          </resume_text>`
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("AI response was empty.");
    }

    const parsedData = JSON.parse(responseContent);

    const finalData = {
      name: parsedData.name || "Not specified",
      designation: parsedData.designation || "Not specified",
      careerObjectiveOrSummary: parsedData.careerObjectiveOrSummary || "",
      parsedSkills: parsedData.parsedSkills || {},
      parsedProjects: parsedData.parsedProjects || [],
    };

    return finalData;

  } catch (error) {
    console.error("❌ An error occurred during the Groq API call or parsing:", error);
    throw new Error("The AI failed to process the resume. Please check the document's content and format or try again later.");
  }
};

exports.extractTextFromFile = extractText;


