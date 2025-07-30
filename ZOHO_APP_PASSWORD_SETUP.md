# 🔐 Zoho App-Specific Password Setup for Contact Form

## Problem
The contact form is showing "535 Authentication Failed" error when trying to send emails through Zoho SMTP.

## Solution
You need to create an **app-specific password** for your `info@cabeceo.hu` Zoho account.

## Steps to Create App-Specific Password

### 1. Login to Zoho EU Accounts
Go to: https://accounts.zoho.eu/

### 2. Navigate to Security Settings
- Click on your profile (top right)
- Go to **"Security"** tab
- Or directly visit: https://accounts.zoho.eu/u/h#security

### 3. Find Application-Specific Passwords
- Look for **"Application-Specific Passwords"** section
- Click **"Generate New Password"**

### 4. Create Password for Email Client
- **Application Name**: Enter something like "Cabeceo Website Contact Form"
- **Select Application Type**: Choose "Mail Client" or "Email Client"
- Click **"Generate"**

### 5. Copy the Generated Password
- Zoho will show you a password like: `abcd1234efgh5678`
- **Copy this password immediately** (you won't see it again!)

### 6. Update the Backend Code
Replace `'clobuf01'` in `contact-backend.js` with the new app-specific password:

```javascript
auth: {
  user: 'info@cabeceo.hu',
  pass: 'your_new_app_specific_password_here' // Replace with the generated password
}
```

## Testing After Update

1. Save the `contact-backend.js` file with the new password
2. Restart the backend server: `npm run contact-server`
3. Test the contact form on your website

## Alternative: Enable Less Secure Apps (Not Recommended)
If you don't want to use app-specific passwords, you can enable "Less Secure Apps" in Zoho settings, but this is less secure.

## Current Status
- ✅ Backend server is configured correctly
- ✅ Zoho SMTP settings are correct
- ❌ Need app-specific password (current issue)
- ✅ Contact form UI is ready

## Next Steps
1. Create app-specific password using steps above
2. Update `contact-backend.js` with new password
3. Test the contact form
