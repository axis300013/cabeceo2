
# 📬 Contact Form Email Integration for www.cabeceo.hu (Node.js Version)

This document explains how to send emails from the **Contact page** on `www.cabeceo.hu` to `info@cabeceo.hu` using **Zoho Mail SMTP** with **Node.js**.

---

## ✅ Requirements

- ✅ Domain `cabeceo.hu` fully verified with Zoho Mail
- ✅ Email account `info@cabeceo.hu` created and active
- ✅ DNS records (MX, SPF, DKIM) correctly set up in Rackforest DNS
- ✅ Node.js environment

---

## 📤 Email Flow

Visitors to the contact form on your site submit a message, which gets emailed to `info@cabeceo.hu` via Zoho SMTP.

---

## 🔧 SMTP Settings (Zoho)

| Setting        | Value              |
|----------------|--------------------|
| SMTP Host      | smtp.zoho.com      |
| SMTP Port      | 587 (TLS)          |
| SMTP Auth      | Yes                |
| Username       | info@cabeceo.hu    |
| Password       | App-specific password |
| Encryption     | TLS                |

> 🔐 Use an [app-specific password from Zoho](https://accounts.zoho.com/u/h#security) if 2FA is enabled.

---

## 🚀 Setup with Node.js and Nodemailer

### 1. Install Nodemailer

```bash
npm install nodemailer express body-parser
```

### 2. Sample `server.js`

```js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 587,
  secure: false,
  auth: {
    user: 'info@cabeceo.hu',
    pass: 'your_app_specific_password'
  }
});

app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: '"Cabeceo Contact Form" <info@cabeceo.hu>',
    to: 'info@cabeceo.hu',
    subject: `New message from ${name}`,
    text: `Sender: ${name} <${email}>\n\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email: ' + error.toString());
    }
    res.send('Message sent successfully.');
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

---

## 🌐 Contact Form (HTML Example)

```html
<form method="POST" action="/send">
  <label>Name: <input type="text" name="name" required></label><br>
  <label>Email: <input type="email" name="email" required></label><br>
  <label>Message:<br><textarea name="message" required></textarea></label><br>
  <button type="submit">Send</button>
</form>
```

> Use JavaScript `fetch()` or AJAX for a more dynamic form experience.

---

## 🧪 Testing & Troubleshooting

- ✅ Ensure app password is correct (not your Zoho login password)
- ✅ Confirm SPF, DKIM, and MX records are active and correct
- ✅ Check spam folder if messages don't appear

---

## ✅ Outcome

All form submissions from `www.cabeceo.hu` are delivered to `info@cabeceo.hu` via Zoho Mail SMTP using a Node.js backend.

---
