const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");

exports.generatePDF = async (data) => {
  const dataForEJS = {
    name: data.name,
    designation: data.designation,
    careerObjectiveOrSummary: data.careerObjectiveOrSummary,
    skills: data.parsedSkills || {},
    projects: data.parsedProjects || [],
  };

  const html = await ejs.renderFile(
    path.join(__dirname, "../views", "resumeTemplate.ejs"),
    dataForEJS
  );

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  return pdfBuffer;
};