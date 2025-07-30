import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { config } from "firebase-functions";
import nodemailer from "nodemailer";

// Set global options for all functions - use Europe region for better performance
setGlobalOptions({ 
  maxInstances: 10,
  region: "europe-west1" 
});

export const sendContactEmail = onRequest(async (req, res) => {
  // Handle CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    res.status(405).json({ 
      success: false, 
      message: "Method not allowed" 
    });
    return;
  }

  const { name, email, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    res.status(400).json({
      success: false,
      message: "Minden mező kitöltése kötelező."
    });
    return;
  }

  // Configure transporter with Zoho EU SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: "info@cabeceo.hu",
      pass: config().zoho.password, // Use Firebase config
    },
  });

  const mailOptions = {
    from: '"Cabeceo Contact Form" <info@cabeceo.hu>',
    to: "info@cabeceo.hu",
    replyTo: email,
    subject: `Új üzenet a weboldal kapcsolati űrlapjából - ${name}`,
    text: `Feladó: ${name} <${email}>\n\nÜzenet:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
          🌟 Új üzenet a Cabeceo weboldal kapcsolati űrlapjából
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>👤 Név:</strong> ${name}</p>
          <p style="margin: 0 0 10px 0;"><strong>📧 Email:</strong> 
            <a href="mailto:${email}" style="color: #d4a574;">${email}</a>
          </p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">💬 Üzenet:</h3>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; line-height: 1.6;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>🕒 ${new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })}</p>
          <p>🌐 Ezt az üzenetet a <strong>cabeceo.hu</strong> weboldal kapcsolati űrlapja küldte.</p>
        </div>
      </div>
    `
  };

  try {
    console.log(`📬 Contact form submission from: ${name} <${email}>`);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully: ${info.response}`);
    
    res.status(200).json({
      success: true,
      message: "Üzenet sikeresen elküldve!"
    });
    
  } catch (error) {
    console.error("❌ Email send error:", error);
    
    let errorMessage = "Hiba az üzenet küldésekor. Próbáld újra később.";
    
    if (error.code === "EAUTH") {
      console.error("🔐 AUTHENTICATION FAILED - Check Zoho credentials");
      errorMessage = "SMTP hitelesítési hiba. Ellenőrizd a beállításokat.";
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
});
