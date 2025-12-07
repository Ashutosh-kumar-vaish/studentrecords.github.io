// app.js  
const express = require("express"); 
const multer = require("multer");
const pool = require("./db");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files (IMPORTANT)
app.use(express.static(__dirname));

// Upload folder setup
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Allow uploaded files to be accessible
app.use("/uploads", express.static(UPLOAD_DIR));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ------------------ USER FORM SUBMIT ------------------

app.post("/submit-form", upload.fields([
  { name: "seat_allotment", maxCount: 1 },
  { name: "income_certificate", maxCount: 1 },
  { name: "caste_certificate", maxCount: 1 },
  { name: "jee_scorecard", maxCount: 1 },
  { name: "class10_result", maxCount: 1 },
  { name: "class12_result", maxCount: 1 },
  { name: "gap_certificate", maxCount: 1 },
  { name: "medical_certificate", maxCount: 1 },
  { name: "photo", maxCount: 1 }
]), async (req, res) => {

  const { full_name, email, mobile, father_name, dob, course } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO admission_form (
        full_name,email,mobile,father_name,dob,course,
        seat_allotment,income_certificate,caste_certificate,jee_scorecard,
        class10_result,class12_result,gap_certificate,medical_certificate,photo
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
      [
        full_name, email, mobile, father_name, dob, course,
        req.files["seat_allotment"]?.[0]?.filename || null,
        req.files["income_certificate"]?.[0]?.filename || null,
        req.files["caste_certificate"]?.[0]?.filename || null,
        req.files["jee_scorecard"]?.[0]?.filename || null,
        req.files["class10_result"]?.[0]?.filename || null,
        req.files["class12_result"]?.[0]?.filename || null,
        req.files["gap_certificate"]?.[0]?.filename || null,
        req.files["medical_certificate"]?.[0]?.filename || null,
        req.files["photo"]?.[0]?.filename || null
      ]
    );

   
  res.send(`
    <html>
      <body style="font-family: Arial; text-align: center; margin-top: 50px;">
      
        <script>
          alert("Form submitted successfully!");
        </script>

        <h1 style="color: green;">Submitted Successfully ✔</h1>
        <p>Your form has been submitted.</p>
        <br>

        <a href="/" style="text-decoration:none; color: blue;">
          Go Back to Home
        </a>

      </body>
    </html>
  `);
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ------------------ SERVER START ------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
