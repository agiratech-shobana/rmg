const parserService = require("../services/parserService");
const pdfService = require("../services/pdfService");

exports.extract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const extractedData = await parserService.parseResume(req.file);
    res.json({ extracted: extractedData });

  } catch (error) {
    console.error("❌ Error processing request:", error);
    res.status(500).json({ error: "Failed to process resume" });
  }
};

exports.generatePDF = async (req, res) => {
  try {
    const pdfBuffer = await pdfService.generatePDF(req.body);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=company_resume.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};