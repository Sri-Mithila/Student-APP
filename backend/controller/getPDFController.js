const { google } = require("googleapis");
const sheets = google.sheets("v4");
const drive = google.drive("v3");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { authorize } = require("./oauthController");
const headerData = require("../config/header.json"); // Import header data

// Extract sheet names from the header.json file
const sheetNames = headerData.sheets.map((sheet) => sheet.name);

// Fetches data across multiple sheets for a given roll number
async function fetchDataForRollNumber(spreadsheetId, sheetNames, rollNumber) {
  const auth = await authorize();
  let studentData = {};

  for (const sheetName of sheetNames) {
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A:ZZ`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) continue;

    const headerRow = rows[0];
    const studentRow = rows.find((row) => row[1] === rollNumber); // Assume roll number is in the 2nd column

    if (studentRow) {
      studentRow.forEach((value, index) => {
        studentData[headerRow[index]] = value;
      });
    }
  }
  return studentData;
}

// Render HTML content for the student using the student data
function renderHTMLFromTemplate(studentData) {
  // Construct the HTML content dynamically
  // Modify this to match your specific HTML template structure
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .student-info { margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>Student Information</h1>
        <div class="student-info">
          <p><strong>Name:</strong> ${studentData['Name']}</p>
          <p><strong>Roll Number:</strong> ${studentData['Roll Number']}</p>
          <p><strong>Course:</strong> ${studentData['Course']}</p>
          <p><strong>Department:</strong> ${studentData['Department']}</p>
        </div>
      </body>
    </html>
  `;
}

// Generate PDF using Puppeteer
async function generatePDFUsingPuppeteer(htmlContent, pdfPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: pdfPath, format: 'A4' });
  await browser.close();
}

// Upload PDF to Google Drive
async function uploadToGoogleDrive(pdfPath, driveFolderId) {
  const auth = await authorize();
  const fileMetadata = {
    name: path.basename(pdfPath),
    parents: [driveFolderId],
  };
  const media = {
    mimeType: "application/pdf",
    body: fs.createReadStream(pdfPath),
  };

  const res = await drive.files.create({
    auth,
    resource: fileMetadata,
    media,
    fields: "id",
  });

  console.log(`File uploaded to Google Drive with ID: ${res.data.id}`);
}

// Generate PDF for a single roll number and upload it to Google Drive
async function generatePDFForRollNumber(
  spreadsheetId,
  rollNumber,
  templatePath,
  driveFolderId
) {
  const studentData = await fetchDataForRollNumber(
    spreadsheetId,
    sheetNames,
    rollNumber
  );

  if (!studentData || Object.keys(studentData).length === 0) {
    throw new Error(`No data found for roll number ${rollNumber}`);
  }

  // Render HTML content based on student data
  const htmlContent = renderHTMLFromTemplate(studentData);

  // Generate PDF path
  const pdfPath = path.join(__dirname, "temp", `${rollNumber}.pdf`);

  // Generate PDF using Puppeteer
  await generatePDFUsingPuppeteer(htmlContent, pdfPath);

  // Upload PDF to Google Drive
  await uploadToGoogleDrive(pdfPath, driveFolderId);

  // Clean up temporary files
  fs.unlinkSync(pdfPath);
  console.log(`Generated and uploaded PDF for roll number ${rollNumber}`);
}

// Endpoint handler for single PDF generation
async function generateSinglePDF(req, res) {
  const { spreadsheet_id, roll_number, folder_id } = req.query;
  const templatePath = path.join(__dirname, "templates", "StudentTemplate.html");

  if (!spreadsheet_id || !roll_number || !folder_id) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    await generatePDFForRollNumber(
      spreadsheet_id,
      roll_number,
      templatePath,
      folder_id
    );
    res.json({
      success: true,
      message: `PDF generated and uploaded for roll number ${roll_number}`,
    });
  } catch (error) {
    console.error("Error in single PDF generation:", error);
    res
      .status(500)
      .json({ error: "Error generating PDF", details: error.message });
  }
}

// Endpoint handler for multiple PDF generation
async function generateMultiplePDFs(req, res) {
  const { spreadsheet_id, roll_numbers, folder_id } = req.body; // Accept roll numbers as an array

  if (!spreadsheet_id || !Array.isArray(roll_numbers) || !folder_id) {
    return res.status(400).json({ error: "Missing or invalid parameters" });
  }

  try {
    const promises = roll_numbers.map((rollNumber) =>
      generatePDFForRollNumber(
        spreadsheet_id,
        rollNumber,
        folder_id
      )
    );
    await Promise.all(promises);
    res.json({
      success: true,
      message: "PDFs generated and uploaded for all specified roll numbers",
    });
  } catch (error) {
    console.error("Error in multiple PDF generation:", error);
    res
      .status(500)
      .json({
        error: "Error generating multiple PDFs",
        details: error.message,
      });
  }
}

module.exports = { generateSinglePDF, generateMultiplePDFs };
