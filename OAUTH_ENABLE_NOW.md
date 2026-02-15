# Fix "Refused to Connect" Error - Enable OAuth Now

You're seeing this error because OAuth providers need to be enabled in your Supabase Dashboard.

## Your Supabase Project

**Project URL:** `https://klqofdwwbczamcfbsvsc.supabase.co`
**Project Reference:** `klqofdwwbczamcfbsvsc`

---

## Quick Fix: Enable Google OAuth (5 minutes)

### Step 1: Google Cloud Console

1. Go to https://console.cloud.google.com/
2. Create/select a project
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Add this **Authorized redirect URI**:
   ```
   https://klqofdwwbczamcfbsvsc.supabase.co/auth/v1/callback
   ```
7. Copy your **Client ID** and **Client Secret**

### Step 2: Enable in Supabase

1. Go to https://supabase.com/dashboard/project/klqofdwwbczamcfbsvsc/auth/providers
2. Find **Google** in the providers list
3. Toggle **Enable Sign in with Google** to ON
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click **Save**

### Step 3: Test

1. Go back to your app
2. Click the **Google** sign-in button
3. It should now work!

---

## Quick Fix: Enable Apple OAuth (10 minutes)

### Step 1: Apple Developer Portal

1. Go to https://developer.apple.com/account/resources/identifiers/list/serviceId
2. Click **+** to create a new Services ID
3. Register a Services ID (e.g., `com.neuralflow.app`)
4. Enable **Sign in with Apple**
5. Configure with this Return URL:
   ```
   https://klqofdwwbczamcfbsvsc.supabase.co/auth/v1/callback
   ```

### Step 2: Create a Key

1. Go to https://developer.apple.com/account/resources/authkeys/list
2. Click **+** to create a key
3. Enable **Sign in with Apple**
4. Download the `.p8` file (save it!)
5. Note the **Key ID**

### Step 3: Get Team ID

1. Go to https://developer.apple.com/account
2. Find your **Team ID** in the Membership section

### Step 4: Enable in Supabase

1. Go to https://supabase.com/dashboard/project/klqofdwwbczamcfbsvsc/auth/providers
2. Find **Apple** in the providers list
3. Toggle **Enable Sign in with Apple** to ON
4. Enter your:
   - **Services ID** (e.g., `com.neuralflow.app`)
   - **Team ID**
   - **Key ID**
   - Upload or paste your **.p8 key file** contents
5. Click **Save**

### Step 5: Test

1. Go back to your app
2. Click the **Apple** sign-in button
3. It should now work!

---

## Important Notes

✅ **Email/Password authentication works immediately** - no setup needed

❌ **Google/Apple OAuth requires dashboard configuration** - that's why you're seeing the error

🔗 **Direct link to your Auth Providers page:**
   https://supabase.com/dashboard/project/klqofdwwbczamcfbsvsc/auth/providers

---

## After Setup

Once you've enabled either provider:
1. The "refused to connect" error will disappear
2. Users will be redirected to Google/Apple for authentication
3. After approval, they'll return to your dashboard
4. New users automatically get a 14-day free trial

---

## Need Help?

- **Detailed Guide:** See [OAUTH_SETUP.md](./OAUTH_SETUP.md)
- **Quick Reference:** See [OAUTH_QUICKSTART.md](./OAUTH_QUICKSTART.md)
- **Support:** ront.devops@gmail.com

---

## Why This Happens

The "refused to connect" error occurs because:
1. Your app tries to redirect to Supabase's OAuth endpoint
2. Supabase checks if the provider (Google/Apple) is enabled
3. If not enabled, Supabase refuses the connection to protect your app
4. Once you enable it in the dashboard, the connection is allowed

This is a security feature, not a bug! 🔒
