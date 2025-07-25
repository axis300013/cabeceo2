import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import nodemailer from "nodemailer";

// Set global options for all functions
setGlobalOptions({ maxInstances: 10 });

// Configure transporter with Gmail using Firebase environment config
// Use Firebase config (functions:config:set gmail.email=... gmail.password=...) or .env for local dev
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL || "",
    pass: process.env.GMAIL_PASSWORD || "",
  },
});

export const sendContactEmail = onRequest((req, res) => {
  // Allow CORS for local dev
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  const { name, email, message } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_EMAIL || "yourgmail@gmail.com",
    to: "cabeceo.monika@gmail.com",
    subject: `Új üzenet a weboldalról: ${name}`,
    text: `Név: ${name}\nEmail: ${email}\nÜzenet:\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    return res.status(200).send("Email sent: " + info.response);
  });
});
