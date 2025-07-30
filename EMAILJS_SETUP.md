# 📧 EmailJS Setup for Cabeceo Contact Form

## 🚀 Why EmailJS?
- ✅ **100% Free** (200 emails/month)
- ✅ **No backend server** needed
- ✅ **Works with Firebase Hosting**
- ✅ **Direct email sending** from browser

## 🔧 Setup Steps

### 1. Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for free account
3. Verify your email

### 2. Add Email Service
1. Go to **Email Services** tab
2. Click **Add New Service**
3. Choose **Zoho** (or Gmail if you prefer)
4. Configure with your credentials:
   - **Service ID**: `service_cabeceo` (you can name it)
   - **User ID**: `info@cabeceo.hu`
   - **Access Token**: Your Zoho password

### 3. Create Email Template
1. Go to **Email Templates** tab
2. Click **Create New Template**
3. **Template ID**: `template_cabeceo`
4. **Template content**:

```html
Subject: Új üzenet a Cabeceo weboldalról - {{from_name}}

To: info@cabeceo.hu
From: {{from_name}} <{{from_email}}>
Reply-To: {{from_email}}

---

Új üzenet érkezett a cabeceo.hu weboldal kapcsolati űrlapjából:

Feladó neve: {{from_name}}
Email címe: {{from_email}}

Üzenet:
{{message}}

---
Cabeceo.hu Contact Form
```

### 4. Get Public Key
1. Go to **Account** tab
2. Copy your **Public Key**

### 5. Update Contact.jsx
Replace the placeholder values in `src/components/Contact.jsx`:

```javascript
const result = await emailjs.send(
  'service_cabeceo',    // Replace with your Service ID
  'template_cabeceo',   // Replace with your Template ID
  {
    from_name: form.name,
    from_email: form.email,
    message: form.message,
    to_email: 'info@cabeceo.hu',
    reply_to: form.email
  },
  'YOUR_PUBLIC_KEY'     // Replace with your actual Public Key
);
```

## 📝 Configuration Values Needed

In `Contact.jsx`, replace these values:
- `service_cabeceo` → Your EmailJS Service ID
- `template_cabeceo` → Your EmailJS Template ID  
- `YOUR_PUBLIC_KEY` → Your EmailJS Public Key

## 🧪 Testing

1. Complete the setup above
2. Update the values in Contact.jsx
3. Build and deploy: `npm run build && firebase deploy`
4. Test the contact form on your live site

## ✅ Benefits

- **No monthly costs** (free tier: 200 emails/month)
- **No server maintenance**
- **Automatic spam protection**
- **Email delivery tracking**
- **Works with any email provider**

## 🔐 Security Note

EmailJS handles the secure email sending. Your Zoho credentials are stored securely on EmailJS servers, not exposed in your frontend code.

## 📊 Usage Limits

**Free Plan:**
- 200 emails/month
- 2 email services
- 4 email templates
- Basic support

This is more than enough for a contact form on a business website.
