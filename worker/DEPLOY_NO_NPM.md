# Deploy Contact Form Worker - No NPM Required

## Easiest Option: Cloudflare Dashboard

This method requires **no local installations** - just your browser and Cloudflare account.

### Step 1: Access Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Log into your account
3. Navigate to **Workers & Pages**

### Step 2: Create Worker

1. Click **"Create application"**
2. Select **"Create Worker"** 
3. Name it: `contact-form-worker`
4. Click **"Deploy"** (creates empty worker)

### Step 3: Add the Code

1. Click **"Edit code"** on your new worker
2. Delete the default code
3. Copy and paste the entire contents from `worker/src/index.js`
4. Click **"Save and deploy"**

### Step 4: Configure Environment Variables

1. Go to your worker's **Settings** tab
2. Click **"Variables"** in the sidebar
3. Add these encrypted variables:
   - **Variable name:** `SMTP2GO_API_KEY`
   - **Value:** Your SMTP2GO API key
   - **Encrypt:** (checked)
   
   - **Variable name:** `RECIPIENT_EMAIL` 
   - **Value:** Your email address
   - **Encrypt:** (checked)

### Step 5: Set Up Custom Route (Optional)

1. Go to **Triggers** tab
2. Click **"Add Custom Domain"** or **"Add Route"**
3. Add route: `yourdomain.com/api/contact`

### Step 6: Test

Your worker is now live! Test it by:
1. Visiting your contact form
2. Submitting a test message
3. Checking your email

## Getting SMTP2GO API Key

1. Sign up at [SMTP2GO](https://www.smtp2go.com)
2. Go to **Settings** → **API Keys**
3. Click **"Add API Key"**
4. Copy the generated key

## Troubleshooting

- **Worker not receiving requests:** Check your route configuration
- **Emails not sending:** Verify SMTP2GO API key and recipient email
- **CORS errors:** The worker includes CORS headers for your domain

That's it! No npm, no wrangler, no local installations needed.