# OAuth Setup Guide

This guide will walk you through setting up Google and Apple OAuth authentication for your application.

## Prerequisites

- A Supabase project with authentication enabled
- Access to your Supabase dashboard
- A Google Cloud Console account (for Google OAuth)
- An Apple Developer account (for Apple OAuth)

## Supabase OAuth Configuration

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers**

---

## Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth 2.0 Credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Choose **Web application**
   - Add a name (e.g., "NeuralFlow App")

5. Configure Authorized Redirect URIs:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   Replace `[YOUR-PROJECT-REF]` with your actual Supabase project reference

6. Copy your **Client ID** and **Client Secret**

### Step 2: Configure Google OAuth in Supabase

1. In your Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **Google** and click to expand
3. Toggle **Enable Sign in with Google** to ON
4. Paste your **Client ID** from Google Cloud Console
5. Paste your **Client Secret** from Google Cloud Console
6. Click **Save**

---

## Apple OAuth Setup

### Step 1: Create Apple OAuth Configuration

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Sign in with your Apple Developer account
3. Navigate to **Certificates, Identifiers & Profiles**

4. Create a Services ID:
   - Select **Identifiers** from the sidebar
   - Click the **+** button to create a new identifier
   - Select **Services IDs** and click **Continue**
   - Register a Services ID (e.g., "com.neuralflow.app")
   - Click **Continue** and **Register**

5. Configure Sign in with Apple:
   - Select your Services ID from the list
   - Check **Sign in with Apple**
   - Click **Configure**

6. Add Return URLs:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   Replace `[YOUR-PROJECT-REF]` with your actual Supabase project reference

7. Create a Key:
   - Go to **Keys** in the sidebar
   - Click the **+** button
   - Give it a name (e.g., "Sign in with Apple Key")
   - Check **Sign in with Apple**
   - Click **Configure** and select your App ID
   - Click **Save** and **Continue**
   - Download the `.p8` key file (you can only download this once!)
   - Note your **Key ID**

8. Get your Team ID:
   - Go to **Membership** in the sidebar
   - Copy your **Team ID**

### Step 2: Configure Apple OAuth in Supabase

1. In your Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **Apple** and click to expand
3. Toggle **Enable Sign in with Apple** to ON
4. Enter your **Services ID** (e.g., "com.neuralflow.app")
5. Enter your **Team ID**
6. Enter your **Key ID**
7. Upload or paste the contents of your `.p8` key file
8. Click **Save**

---

## Testing OAuth Integration

### Test Google Sign-In

1. Go to your application's authentication page
2. Click the **Google** button
3. You should be redirected to Google's login page
4. Sign in with your Google account
5. Grant permissions
6. You should be redirected back to your dashboard

### Test Apple Sign-In

1. Go to your application's authentication page
2. Click the **Apple** button
3. You should be redirected to Apple's login page
4. Sign in with your Apple ID
5. Grant permissions
6. You should be redirected back to your dashboard

---

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**
   - Ensure the redirect URI in Google/Apple matches exactly with your Supabase callback URL
   - Check for trailing slashes or http vs https

2. **Invalid Credentials**
   - Double-check your Client ID, Client Secret, and Key files
   - Ensure there are no extra spaces when copying

3. **OAuth Not Enabled**
   - Verify that OAuth is enabled in your Supabase dashboard
   - Check that the providers are properly configured

4. **Local Development**
   - OAuth redirects work with your production URL
   - For local development, you may need to add `http://localhost:5173` to your authorized redirect URIs

### Support

If you encounter issues:
- Check Supabase logs in Dashboard > Logs
- Verify your OAuth credentials in Google Cloud Console / Apple Developer Portal
- Contact support at: **ront.devops@gmail.com**

---

## Security Best Practices

1. **Never commit OAuth credentials** to version control
2. **Use environment variables** for sensitive data
3. **Regularly rotate keys** and credentials
4. **Monitor authentication logs** for suspicious activity
5. **Enable 2FA** on your Google and Apple developer accounts

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
