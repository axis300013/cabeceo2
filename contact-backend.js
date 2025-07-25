// Simple Express backend for sending email via Sendinblue SMTP

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: '92fed7001@smtp-brevo.com', // <-- replace with your Sendinblue email
    pass: 'PU93XWYxrI2gqBaD' // <-- replace with your Sendinblue SMTP key
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  transporter.sendMail({
    from: '92fed7001@smtp-brevo.com', // Use your verified sender
    to: 'cabeceo.monika@gmail.com',
    replyTo: email, // User's email for reply
    subject: `Contact from ${name}`,
    text: message,
    html: `<p><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>`
  }, (err, info) => {
    if (err) {
      console.error('Email send error:', err);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    res.send('OK');
  });
});

app.listen(3001, () => {
  console.log('Contact backend running on http://localhost:3001');
});
