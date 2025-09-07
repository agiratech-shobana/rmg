



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

  const html = await ejs.renderFile(
    path.join(__dirname, "../views", "resumeTemplate.ejs"),
    dataForEJS
  );  

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  // const headerTemplateHtml = `
  //   <div style="
  //       display: flex;
  //       align-items: center;
  //       border-bottom: 2px solid #0056b3;
  //       padding-bottom: 15px;
  //       margin-bottom: 20px;
  //       padding-left: 20px;
  //       padding-right: 20px;
  //   ">
  //     <img src="${logoUrl}" alt="Company Logo" style="
  //         height: 50px;
  //         margin-right: 20px;
  //     ">
  //     <div style="
  //         display: flex;
  //         flex-direction: column;
  //     ">
  //       <h1 style="
  //           margin: 0;
  //           color: #0056b3;
  //       ">${dataForEJS.name || "Candidate Name"}</h1>
  //       <p style="
  //           margin: 0;
  //           color: #555;
  //           font-weight: bold;
  //       ">${dataForEJS.designation || ""}</p>
  //     </div>
  //   </div>
  // `;

  // const footerTemplateHtml = `
  //   <div style="
  //       width: 100%;
  //       display: flex;
  //       justify-content: space-between;
  //       align-items: center;
  //       border-top: 1px solid #ddd;
  //       font-size: 10px;
  //       color: #888;
  //       padding: 10px 20px;
  //       position: fixed;
  //       bottom: 0;
  //       left: 0;
  //       right: 0;
  //   ">
  //       <span>AGIRA | ${dataForEJS.designation || "Role"}</span>
  //       <span>Agira is common | Page <span class="pageNumber"></span></span>
  //   </div>
  // `;


  // const headerTemplateHtml = `
  //   <div style="
  //       font-family: 'Helvetica Neue', Arial, sans-serif;
  //       font-size: 12px;
  //       width: 100%;
  //       padding: 0 20px;
  //       box-sizing: border-box;
  //   ">
  //     <div style="
  //         display: flex;
  //         align-items: center;
  //         border-bottom: 2px solid #0056b3;
  //         padding-bottom: 15px;
  //         margin-bottom: 10px;
  //     ">
  //       <img src="${logoUrl}" alt="Company Logo" style="
  //           height: 40px;
  //           margin-right: 15px;
  //       ">
  //       <div style="
  //           display: flex;
  //           flex-direction: column;
  //       ">
  //         <h1 style="
  //             margin: 0;
  //             font-size: 1.2em;
  //             color: #0056b3;
  //         ">${dataForEJS.name || "Candidate Name"}</h1>
  //         <p style="
  //             margin: 0;
  //             color: #555;
  //             font-weight: bold;
  //         ">${dataForEJS.designation || ""}</p>
  //       </div>
  //     </div>
  //   </div>
  // `;

  const headerTemplateHtml = `
    <div style="
        width: 100%;
        display: flex;
        justify-content: flex-start; /* Align logo to the left */
        align-items: center;
        border-bottom: 2px solid #0056b3;
        padding: 10px 20px;
        box-sizing: border-box;
    ">
      <img src="${logoUrl}" alt="Company Logo" style="
          height: 40px;
      ">
    </div>
`;
  const footerTemplateHtml = `
    <div style="
        font-family: 'Helvetica Neue', Arial, sans-serif;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #ddd;
        font-size: 10px;
        color: #888;
        padding: 5px 20px;
        box-sizing: border-box;
    ">
        <span>AGIRA | ${dataForEJS.designation || "Role"}</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
    </div>
  `;

  const pdfBuffer = await page.pdf({
    format: "A4",
     displayHeaderFooter: true,
     headerTemplate: headerTemplateHtml,
     footerTemplate: footerTemplateHtml,
    margin: { top: '100px', bottom: '50px', left: '20px', right: '20px' },
    printBackground: true,
  });

  await browser.close();

  return pdfBuffer;
};