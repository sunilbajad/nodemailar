const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");
const mysql = require("mysql2");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const fs = require("fs");
var cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Set up Multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Serve the 'qrcodes' directory as static files
app.use(express.static("qrcodes"));

// Route to serve the frontend
app.use(express.static("public"));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., Gmail, Yahoo, etc.
  auth: {
    user: 'bajadsunil9@gmail.com',
    pass: 'segagfdwkezywoxi',
  },
});

app.post("/send-bulk-email", async (req, res) => {
  try {
    const query = "SELECT email, qrcode FROM users";
    const [rows] = await db.promise().execute(query);
    if (rows.length === 0) {
      return res.status(400).json({ error: "No users found" });
    }

    for (const row of rows) {
      const { email, qrcode } = row;
      const emailSubject = "Your QR Code";
      const emailMessage = "Please find your QR code attached below.";

      const htmlContent = `<h1>Hello ${email}</h1><p>${emailMessage}</p><img src="cid:qrcode" alt="QR Code">`;
      const mailOptions = {
        from: 'bajadsunil9@gmail.com',
        to: email,
        subject: emailSubject,
        html: htmlContent,
        // text: emailMessage,
        attachments: [
          {
            filename: `${qrcode}`,
            path: `${qrcode}`,
            cid: "qrcode",
          },
        ],
      };

      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({ message: "Bulk email sent successfully" });
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    return res.status(500).json({ error: "Error sending bulk emails" });
  }
});

// Route to fetch all users
app.get("/get-users", (req, res) => {
  const query = "SELECT name, email, qrcode FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Error fetching users" });
    }

    return res.json(results);
  });
});

// Function to generate and save QR code images
const generateQRCode = async (qrcodeData, filename) => {
  try {
    await QRCode.ā(`./qrcodes/${filename}.png`, qrcodeData);
    return `./qrcodes/${filename}.png`;
  } catch (err) {
    console.error("Error generating QR code:", err);
    return null;
  }
};

// Route to handle CSV upload
app.post("/upload-csv", upload.single("csvFile"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No CSV file uploaded" });
  }

  const results = [];

  // Read and process the CSV file
  fs.createReadStream(file.path)
    .pipe(csvParser())
    .on("data", async (row) => {
      // Assuming the CSV file has columns 'name' and 'email'
      const qrcodeData = JSON.stringify({ name: row.name, email: row.email });
      const qrcodeFilename = Math.random().toString(36).substr(2, 10); // Generate a random QR code filename
      const qrcodePath = await generateQRCode(qrcodeData, qrcodeFilename);

      if (qrcodePath) {
        results.push({ ...row, qrcode: qrcodePath });

        // Insert record into the database
        const insertQuery =
          "INSERT INTO users (name, email, qrcode) VALUES (?, ?, ?)";
        const insertValues = [row.name, row.email, qrcodePath];
        try {
          await db.promise().execute(insertQuery, insertValues);
        } catch (err) {
          console.error("Error inserting record:", err);
        }
      }
    })
    .on("end", () => {
      // Clean up the uploaded file
      fs.unlinkSync(file.path);

      res.json({ message: "CSV file processed successfully" });
    });
});

// Route to send bulk emails with QR codes
app.post("/send-bulk-email", async (req, res) => {
  try {
    const query = "SELECT email, qrcode FROM users";
    const [rows] = await db.promise().execute(query);
    if (rows.length === 0) {
      return res.status(400).json({ error: "No users found" });
    }

    const recipients = rows.map((row) => row.email);
    const qrCodes = rows.map((row) => row.qrcode);

    const emailSubject = "Your QR Code";
    const emailMessage = "Please find your QR code attached below.";

    const mailOptions = {
      from: "aneeshb35@gmail.com",
      to: recipients.join(", "),
      subject: emailSubject,
      text: emailMessage,
      attachments: qrCodes.map((qrcode) => ({
        filename: `${qrcode}.png`,
        path: `./qrcodes/${qrcode}.png`,
      })),
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Bulk email sent successfully" });
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    return res.status(500).json({ error: "Error sending bulk emails" });
  }
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
