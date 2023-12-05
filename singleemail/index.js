const express = require("express");
const multer = require("multer");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());



// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bajadsunil2008@gmail.com',
        pass: 'segagfdwkezywoxi',
    },
});

// Set up Multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Serve the 'qrcodes' directory as static files
app.use(express.static("qrcodes"));

// Route to serve the frontend
app.use(express.static("public"));

// Route to handle registration
app.post("/register", upload.none(), async (req, res) => {
    try {
        const { name, email, mobile } = req.body;

        // Generate QR code based on user information
        const qrcodeData = JSON.stringify({ name, email, mobile });
        const qrcodeFilename = `${name}-${Date.now()}`;
        const qrcodePath = await generateQRCode(qrcodeData, qrcodeFilename);

        if (!qrcodePath) {
            return res.status(500).json({ error: "Error generating QR code" });
        }

        // Create HTML content with embedded QR code
        const htmlContent = `
            
            <center style="  width: 100%;
            table-layout: fixed;
            background-color: white;">
<table style="width: 100%;
padding-top: 3em !important;
margin: 0;
padding: 0;
max-width: 400px;
background-image: linear-gradient(0deg, rgba(235, 192, 72, 1),rgba(255, 255, 255, 1)); border-spacing: 0;" width="100%">
  
    <tr style="">
<td style="padding: 0; margin: 0;" align="center">
<table style="border-spacing: 0;" width="100%">
    <tr align="center">
        <td class="two-columns" style="
            padding: 0;
            font-size: 0;
            max-width: 100%;
            display: flex;
            padding-left: 4em;
                padding-right: 4em;
         
        ">
            <table class="column2" style="
            
                border-spacing: 0;
                display: inline-block;
                max-width: 400px;
                width: 100%;
                vertical-align: top;
                padding-bottom: 4%;
            ">
                <tr>
                    <td class="padding" style="padding: 0;">
                        <table class="content" style="border-spacing: 0;width: 100%;">
                            <tr>
                                <td style="padding: 0;">
                                    <!-- <p style="
                                        font-size: 12px;
                                        font-weight: 700;
                                        margin: 0;
                                        padding: 0;
                                        margin-bottom: 1em;
                                       
                                        font-family: arial;
                                    ">
                                        Let's make the Boiler World more energetic! Steam Up!
                                    </p> -->
                                  <img src="https://sms.procohat.tech/wp-content/uploads/2023/12/images/logo1.png" width="40%"/>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0; margin: 0;" align="center"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
              <table class="column2" style="
                margin-top: 1%;
                border-spacing: 0;
                display: inline-block;
                max-width: 100px;
                width: 100%;
                vertical-align: top;
                margin-top: 5%;
            
            ">
                <tr>
                    <td class="padding" style="padding: 0;">
                        <table class="content" style="border-spacing: 0;width: 100%;">
                            <tr>
                                <td style="padding: 0;">
                                    <p style="
                                        font-size: 20px;
                                        font-weight: 300;
                                        margin: 0;
                                        padding: 0;
                                        margin-bottom: 1em;
                                       
                                     font-family: 'Poppins', sans-serif;
                                    ">
                            A BLOCK
                                    </p>
                                  <!-- <img src="https://sms.procohat.tech/wp-content/uploads/2023/12/images/logo1.png" width="50%"/> -->
                                </td>
                            </tr>
                           
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</td>
</tr>
<tr>
<td align="center">
<div>


<img src="https://sms.procohat.tech/wp-content/uploads/2023/12/images/suhani.png"  class="" width="300" style="max-width:100%; " />
  </div>
<i style=" font-family: 'Poppins', sans-serif;">  LIVE at Nagpur</i>
<div>


<i style=" font-family: 'Poppins', sans-serif; font-size: 11.3px; font-weight: 600;">Program to start with Orchestra by Divyang Children.</i>
</div>
</td>
</tr>


  
    <tr style="">
<td style="padding: 0; margin: 0;" align="center" >
<table style="border-spacing: 0;" width="100%">
    <tr >
        <td class="two-columns" style="
           
            font-size: 0;
            max-width: 100%;
            display: flex;
         
        " > 
            <table class="column2" style="
            
                border-spacing: 0;
                display: inline-block;
                max-width: 400px;
                width: 100%;
                vertical-align: top;
                padding-bottom: 4%;
            ">
                <tr>
                    <td class="padding" style="padding: 0;">
                        <table class="content" style="border-spacing: 0;width: 100%;">
                            <tr>
                                <td style="padding: 0;">
                                    <div style="display: flex; gap: 0.3em;">

                                 
                                    <img src="https://sms.procohat.tech/wp-content/uploads/2023/12/images/clock.png"  width="20" height="20"  />
                                    <p style="
                                        font-size: 16px;
                                        font-weight: 700;
                                      
                                    
                                       
                                  font-family: 'Poppins', sans-serif;
                                    ">
                                        8 p.m to 10 p.m
                                    </p>
                                       </div>
                                  <!-- <img src="https://sms.procohat.tech/wp-content/uploads/2023/12/images/logo1.png" width="40%"/> -->
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0; margin: 0;" align="center"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <table class="column2" style="
            
                border-spacing: 0;
                display: inline-block;
                max-width: 20px;
                width: 100%;
                vertical-align: top;
                 margin-top: 2%;
               
            ">
                <tr>
                    <td class="padding" style="padding: 0;" >
                        <table class="content" style="border-spacing: 0;width: 100%;">
                            <tr>
                                <td style="padding: 0;  " >
                              

                            
                                 <div style="border-left: 2px solid black ; height: 30px;  "></div>
                                 
                                  <!-- <img src="https://sms.procohat.tech/wp-content/uploads/2023/12/images/logo1.png" width="40%"/> -->
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0; margin: 0;" align="center"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
             <table class="column2" style="
            
                border-spacing: 0;
                display: inline-block;
                max-width: 400px;
                width: 100%;
                vertical-align: top;
      
            ">
                <tr>
                    <td class="padding" style="padding: 0;">
                        <table class="content" style="border-spacing: 0;width: 100%;">
                            <tr>
                                <td style="padding: 0;">
                                    <div style="display: flex; gap: 0.3em;">

                                 
                                    <img src="https://sms.procohat.tech/wp-content/uploads/2023/12/images/calendar.png"  width="20" height="20"/>
                                    <p style="
                                        font-size: 16px;
                                        font-weight: 700;
                                      
                                    
                                       
                                        font-family: 'Poppins', sans-serif;
                                    ">
                                  25 Jan 2024
                                    </p>
                                       </div>
                                  <!-- <img src="https://sms.procohat.tech/wp-content/uploads/2023/12/images/logo1.png" width="40%"/> -->
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0; margin: 0;" align="center"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</td>
</tr>

    
<tr>
    <td>
        <div  style="display: flex; align-items: center; gap: 0.4em;">

   
        <div>
            <img src="https://sms.procohat.tech/wp-content/uploads/2023/12/images/location.png"  width="20" height="20" />
        </div>
        <div>
            <p style="margin: 0; padding: 0;  font-size: 16px;
                                        font-weight: 700;
                                      
                                    
                                       
                                  font-family: 'Poppins', sans-serif;">
                Suresh Bhat Auditorium

            </p>
            <p style="margin: 0; padding: 0; font-size: 15px;">44Q6+373, Great Nag Rd, Reshim Bagh, Nagpur, Maharashtra 440009</p>
        </div>
             </div>
    </td>
</tr>

   <tr>
    <td align="center">
               <div style="margin: 3em 0;">


<img src="cid:qrcode"  class="" width="200" style="max-width:100%; " />
  </div>
    </td>
   </tr>
        <tr>
    <td align="center" style="padding: 0; margin: 0;">
               <div style="padding: 0; margin: 0;">


<img src="https://sms.procohat.tech/wp-content/uploads/2023/12/images/SUHANISHAHPIC.png"  class=""  style="max-width:100%; padding: 0; margin: 0; " />
  </div>
    </td>
   </tr>
     




</table>
</center>

        `;

        // Send HTML email with embedded QR code
        const mailOptions = {
            from: 'bajadsunil2008@gmail.com',
            to: email,
            subject: "Registration Successful",
            html: htmlContent,
            attachments: [
                {
                    filename: `${qrcodeFilename}.png`,
                    path: qrcodePath,
                    cid: "qrcode", // Content ID for embedding in HTML
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        // Clean up the generated QR code
        fs.unlinkSync(qrcodePath);

        return res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: "Error during registration" });
    }
});

// Function to generate and save QR code images
const generateQRCode = async (qrcodeData, filename) => {
    try {
        await QRCode.toFile(`./qrcodes/${filename}.png`, qrcodeData);
        return `./qrcodes/${filename}.png`;
    } catch (err) {
        console.error("Error generating QR code:", err);
        return null;
    }
};

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
