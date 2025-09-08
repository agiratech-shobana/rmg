


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

    // If text is found, return it
    if (pdfData.text && pdfData.text.trim().length > 50) {
      return pdfData.text;
    }

    // Fallback to OCR if no text
    console.log("No text layer found in PDF, using OCR...");
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
    console.error(" An error occurred during the Groq API call or parsing:", error);
    throw new Error("The AI failed to process the resume. Please check the document's content and format or try again later.");
  }
};

exports.extractTextFromFile = extractText;


