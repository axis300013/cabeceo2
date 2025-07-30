console.log('🔄 Starting Cabeceo Contact Backend Server...');

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

console.log('📦 All modules imported successfully');

const app = express();
app.use(cors());
app.use(express.json());

console.log('⚙️ Express configured');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',  // EU server
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'info@cabeceo.hu',
    pass: 'Clobufclobuf01#'
  }
});

console.log('📧 Zoho EU SMTP transporter created');

app.post('/api/contact', (req, res) => {
  console.log('📬 Contact form submission received:', req.body);
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Minden mező kitöltése kötelező.'
    });
  }
  
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
      console.error('❌ Email send error:', err.message);
      
      let errorMessage = 'Hiba az üzenet küldésekor. Próbáld újra később.';
      if (err.code === 'EAUTH') {
        console.error('🔐 AUTHENTICATION FAILED - Check password or create app-specific password');
        errorMessage = 'SMTP hitelesítési hiba. Ellenőrizd a beállításokat.';
      }
      
      return res.status(500).json({ 
        success: false, 
        message: errorMessage
      });
    }
    
    console.log('✅ Email sent successfully:', info.response);
    res.json({ 
      success: true, 
      message: 'Üzenet sikeresen elküldve!' 
    });
  });
});

app.listen(3001, () => {
  console.log('🚀 Cabeceo Contact Backend Server is running!');
  console.log('🌐 Server URL: http://localhost:3001');
  console.log('📧 Using Zoho EU SMTP (smtp.zoho.eu)');
  console.log('📬 Email account: info@cabeceo.hu');
  console.log('');
  console.log('Ready to receive contact form submissions! 💌');
});
