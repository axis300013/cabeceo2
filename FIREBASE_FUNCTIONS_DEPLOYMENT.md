# 🚀 Firebase Functions Deployment Guide for Cabeceo Contact Form

## 🔥 Step 1: Upgrade to Blaze Plan

1. **Visit**: https://console.firebase.google.com/project/cabeceo02/usage/details
2. **Click**: "Modify plan" or "Upgrade to Blaze"
3. **Add credit card** for billing (required for verification)
4. **Set spending limit** (optional but recommended):
   - Set to €5-10/month for safety
   - Your actual usage will be FREE (within free tier)

## 💰 Cost Breakdown
- **Free tier**: 2M invocations/month, 400k GB-seconds
- **Your contact form**: ~100-200 invocations/month
- **Actual cost**: €0.00/month (well within free limits)
- **Credit card**: Only for verification, not charged unless you exceed free tier

## 🛠️ Step 2: Deploy Functions

After upgrading to Blaze plan:

```bash
firebase deploy --only functions
```

This will:
- Deploy the `sendContactEmail` function
- Create the public URL endpoint
- Configure Zoho SMTP integration

## 📍 Step 3: Update Function URL

After successful deployment, you'll get a URL like:
```
https://sendcontactemail-yrmh5nz2aq-ew.a.run.app
```

Update this URL in `/src/components/Contact.jsx`:

```javascript
const FUNCTION_URL = process.env.NODE_ENV === 'production' 
  ? 'YOUR_ACTUAL_FUNCTION_URL_HERE' // Replace with real URL
  : 'http://localhost:3001/api/contact';
```

## 🧪 Step 4: Test the Function

1. **Deploy your site**: `npm run build && firebase deploy`
2. **Test contact form** on your live site
3. **Check Firebase logs**: `firebase functions:log`

## 🔐 Security Features

✅ **Secure password storage** via Firebase config
✅ **CORS protection** configured
✅ **Input validation** for all fields
✅ **Professional email formatting**
✅ **Error handling** with specific messages

## 📊 Monitoring

Monitor your function usage:
- **Firebase Console**: https://console.firebase.google.com/project/cabeceo02/functions
- **View logs**: `firebase functions:log`
- **Usage stats**: Available in Firebase Console

## 🆘 Troubleshooting

### Common Issues:

1. **"Blaze plan required"**
   - Solution: Upgrade to Blaze plan first

2. **"Authentication failed"**
   - Check Zoho password in Firebase config
   - Ensure Zoho account allows SMTP

3. **CORS errors**
   - Function already configured for CORS
   - Check the function URL is correct

## ✅ Final Setup Status

After deployment:
- ✅ Firebase Function deployed
- ✅ Zoho EU SMTP configured
- ✅ Contact form integrated
- ✅ Professional email templates
- ✅ Error handling and validation
- ✅ CORS and security configured

## 🌐 Production URL Structure

Your contact form will POST to:
```
https://sendcontactemail-[PROJECT-ID].cloudfunctions.net/sendContactEmail
```

Or the newer Cloud Run format:
```
https://sendcontactemail-[HASH]-ew.a.run.app
```

This URL will be displayed after deployment.

---

**Ready to deploy?** 
1. Upgrade to Blaze plan
2. Run `firebase deploy --only functions`
3. Update the function URL in Contact.jsx
4. Deploy your site and test! 🎉
