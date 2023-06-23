const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config({ path: path.join(__dirname, "./config.env") });
const app = express();
app.use(helmet());
app.use(
  cors({
    origin: "furniturefav.com",
  })
);
app.use(express.json());
app.post("/submit-data", async (req, res, next) => {
  try {
    const { name, address, phoneNumber, email } = req.body;
    if (!name || !address || !phoneNumber || !email) {
      throw new Error("name, address,phone,email is required");
    }
    const config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    };
    const transporter = nodemailer.createTransport(config);
    const info = transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "FURNITURE FAV CONTACT",
      text: `NAME :${name}
        ADDRESS: ${address}
        PHONE: ${phoneNumber}
    `,
    });
    res.status(200).json({
      status: "success",
      message: "email sent",
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
});
app.listen(3000, () => {
  console.log("listening");
});
