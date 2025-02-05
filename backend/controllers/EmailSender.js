const verifiedUser = require("../models/verifiedUser.js");
const generateQRCode = require("./qrCodeGenrator.js");
const nodemailer = require("nodemailer");
require("dotenv").config();

const path = require("path");
// const transporter = require('../config/nodeMailer');

const sendQRCodeEmail = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await verifiedUser.findOne({ where: { userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email } = user;

    console.log("Sending email to:", email);

    const qrData = `User: ${name}, Email: ${email}`;

    const qrFilename = "qr_code.png";

    const qrFilePath = await generateQRCode(qrData, qrFilename);

    //    console.log(process.env, "process.env");
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465, // SMTP port for SSL
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER, // Your Hostinger email (e.g., info@dealbaba.com.au)
        pass: process.env.EMAIL_PASSWORD, // Your Hostinger email password
      },
      // service: "gmail",
      //   auth: {
      //     user: process.env.EMAIL_USER,
      //     pass: process.env.EMAIL_PASSWORD, // Use an App Password if 2FA is enabled
      //   },
    });

    const mailOptions = {
      from: "info@dealbaba.com.au",
      to: email,
      subject: "Your QR Code",
      text: "Here is your QR code for verification.",
      attachments: [
        {
          filename: qrFilename,
          path: qrFilePath,
        },
      ],
    };
    console.log("herrere", transporter, transporter.sendMail())
    transporter.sendMail(mailOptions, (error, info) => {
      console.log("herer insidee")
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent successfully:", info.response);
        return res
          .status(200)
          .json({ message: "QR Code email sent successfully" });
      }
    });
  } catch (error) {
    // Rollback transaction in case of error
    if (connection) {
      await connection.rollback();
    }
    console.error("Error during signup:", error);
    res
      .status(500)
      .json({ message: error.message || "Signup failed. Please try again." });
  } finally {
    // Release the connection back to the pool
    console.log("dnalt")
    if (connection) {
      await connection.release();
    }
  }
};

module.exports = sendQRCodeEmail;

