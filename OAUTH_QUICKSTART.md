# OAuth Quick Start Guide

This is a simplified guide to get Google and Apple OAuth working quickly.

## Google OAuth (5 minutes)

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Add this redirect URI:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```
   (Replace YOUR-PROJECT-REF with your actual Supabase project reference from your Supabase URL)

7. Copy the **Client ID** and **Client Secret**

### 2. Supabase Configuration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** > **Providers**
4. Find **Google** and toggle it ON
5. Paste your Client ID and Client Secret
6. Click **Save**

### Done! Google OAuth is now active.

---

## Apple OAuth (10 minutes)

### 1. Apple Developer Portal Setup

1. Go to [Apple Developer](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a **Services ID**:
   - Click Identifiers > **+** button
   - Select **Services IDs**
   - Enter an identifier (e.g., `com.yourapp.auth`)
   - Enable **Sign in with Apple**
   - Configure with redirect URL:
     ```
     https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
     ```

4. Create a **Key**:
   - Go to **Keys** > **+** button
   - Give it a name
   - Enable **Sign in with Apple**
   - Download the `.p8` file (save it!)
   - Note the **Key ID**

5. Get your **Team ID** from the Membership page

### 2. Supabase Configuration

1. Go to your Supabase Dashboard
2. Go to **Authentication** > **Providers**
3. Find **Apple** and toggle it ON
4. Enter:
   - Services ID (e.g., `com.yourapp.auth`)
   - Team ID
   - Key ID
   - Upload the `.p8` key file
5. Click **Save**

### Done! Apple OAuth is now active.

---

## Finding Your Supabase Project Reference

Your Supabase project reference is in your Supabase URL:
```
https://YOUR-PROJECT-REF.supabase.co
```

You can find it in:
- Your Supabase dashboard URL
- Your `.env` file in `VITE_SUPABASE_URL`

---

## Testing

1. Go to your app's sign-in page
2. Click **Google** or **Apple** button
3. Complete the OAuth flow
4. You should be redirected back and logged in

---

## Troubleshooting

**"OAuth not configured" error**
- Make sure you've enabled the provider in Supabase Dashboard
- Verify your Client ID/Secret are correct

**Redirect URI mismatch**
- Ensure the redirect URI matches exactly (including https://)
- No trailing slashes

**Still not working?**
- Check Supabase logs: Dashboard > Logs
- Verify your credentials are saved in Supabase
- Contact support: ront.devops@gmail.com

---

For more detailed instructions, see [OAUTH_SETUP.md](./OAUTH_SETUP.md)
