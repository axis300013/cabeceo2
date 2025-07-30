console.log('Starting server...');

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

console.log('Modules imported successfully');

const app = express();
app.use(cors());
app.use(express.json());

console.log('Express configured');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'info@cabeceo.hu',
    pass: 'clobuf01'
  }
});

console.log('Transporter created');

app.post('/api/contact', (req, res) => {
  console.log('Contact endpoint hit with:', req.body);
  const { name, email, message } = req.body;
  
  const mailOptions = {
    from: '"Cabeceo Contact Form" <info@cabeceo.hu>',
    to: 'info@cabeceo.hu',
    replyTo: email,
    subject: `Új üzenet a weboldal kapcsolati űrlapjából - ${name}`,
    text: `Feladó: ${name} <${email}>\n\nÜzenet:\n${message}`,
    html: `
      <h3>Új üzenet a Cabeceo weboldal kapcsolati űrlapjából</h3>
      <p><strong>Név:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Üzenet:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <hr>
      <small style="color: #666;">Ezt az üzenetet a cabeceo.hu weboldal kapcsolati űrlapja küldte.</small>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Email send error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Hiba az üzenet küldésekor. Próbáld újra később.' 
      });
    }
    console.log('Email sent successfully:', info.response);
    res.json({ 
      success: true, 
      message: 'Üzenet sikeresen elküldve!' 
    });
  });
});

console.log('Route configured');

app.listen(3001, () => {
  console.log('✅ Contact backend running on http://localhost:3001');
  console.log('✅ Using Zoho SMTP with info@cabeceo.hu');
});
