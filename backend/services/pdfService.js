// const puppeteer = require("puppeteer");
// const ejs = require("ejs");
// const path = require("path");
// const fs = require("fs");

// exports.generatePDF = async (data) => {

//  const logoPath = path.join(__dirname, "..", "public", "images", "agira-logo.png");
//   // <-- NEW: Convert it to a URL format that Puppeteer understands -->
//   // const logoUrl = `file://${logoPath}`;

//      const imageBuffer = fs.readFileSync(logoPath);
//     // Convert the image to a base64 string
//     const base64Image = imageBuffer.toString('base64');
//     // Create the full data URL for the image
//     const logoUrl = `data:image/png;base64,${base64Image}`; 



//   const dataForEJS = {
//     name: data.name,
//     designation: data.designation,
//     careerObjectiveOrSummary: data.careerObjectiveOrSummary,
//     skills: data.parsedSkills || {},
//     projects: data.parsedProjects || [],
//      logoUrl: logoUrl,
//   };

//   const html = await ejs.renderFile(
//     path.join(__dirname, "../views", "resumeTemplate.ejs"),
//     dataForEJS
//   );

//   const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//   const page = await browser.newPage();
//   await page.setContent(html, { waitUntil: "networkidle0" });

//   const pdfBuffer = await page.pdf({ format: "A4" });
//   await browser.close();

//   return pdfBuffer;
// };

const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

exports.generatePDF = async (data) => {
  const logoPath = path.join(__dirname, "..", "public", "images", "agira-logo.png");
  const imageBuffer = fs.readFileSync(logoPath);
  const base64Image = imageBuffer.toString('base64');
  const logoUrl = `data:image/png;base64,${base64Image}`;

  const dataForEJS = {
    name: data.name,
    designation: data.designation,
    careerObjectiveOrSummary: data.careerObjectiveOrSummary,
    skills: data.parsedSkills || {},
    projects: data.parsedProjects || [],
    logoUrl: logoUrl,
  };

  // The main content of the PDF will be rendered here.
  // The header section is removed from this template.
  const html = await ejs.renderFile(
    path.join(__dirname, "../views", "resumeTemplate.ejs"),
    dataForEJS
  );

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  // Define the HTML for the header, including dynamic data
  const headerTemplateHtml = `
    <div style="
        display: flex;
        align-items: center;
        border-bottom: 2px solid #0056b3;
        padding-bottom: 15px;
        margin-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
    ">
      <img src="${logoUrl}" alt="Company Logo" style="
          height: 50px;
          margin-right: 20px;
      ">
      <div style="
          display: flex;
          flex-direction: column;
      ">
        <h1 style="
            margin: 0;
            color: #0056b3;
        ">${dataForEJS.name || "Candidate Name"}</h1>
        <p style="
            margin: 0;
            color: #555;
            font-weight: bold;
        ">${dataForEJS.designation || ""}</p>
      </div>
    </div>
  `;

  // Generate the PDF with the header on every page
  const pdfBuffer = await page.pdf({
    format: "A4",
    displayHeaderFooter: true,
    headerTemplate: headerTemplateHtml,
    // Add top margin to prevent content from overlapping with the header
    margin: { top: '100px', bottom: '50px', left: '20px', right: '20px' },
    printBackground: true,
  });

  await browser.close();

  return pdfBuffer;
};