# GitHub Actions Deployment Setup

## Overview

This setup enables automatic deployment of your Cloudflare Worker whenever you push changes to the `worker/` directory. No local npm/wrangler installation required!

## Setup Steps

### 1. Get Your Cloudflare Credentials

#### Cloudflare API Token:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Use **"Custom token"** template
4. Set permissions:
   - **Account**: Workers Scripts:Edit
   - **Zone**: Zone Settings:Read, Zone:Read  
   - **Account Resources**: Include All accounts
5. Copy the generated token

#### Cloudflare Account ID:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain
3. In the right sidebar, copy your **Account ID**

### 2. Get Your SMTP2GO API Key

1. Log into [SMTP2GO](https://www.smtp2go.com)
2. Go to **Settings** → **API Keys**
3. Click **"Add API Key"**
4. Copy the generated key

### 3. Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add each of these:

| Secret Name | Value | Description |
|-------------|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token | For deploying workers |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | Required for deployment |
| `SMTP2GO_API_KEY` | Your SMTP2GO API key | For sending emails |
| `RECIPIENT_EMAIL` | your@email.com | Where contact form emails go |

### 4. How It Works

The workflow automatically triggers when:

- **Push to main branch** with changes in `worker/` folder
- **Pull request** affecting `worker/` folder  
- **Manual trigger** via GitHub Actions tab

### 5. Workflow Features

- **Smart triggering**: Only runs when worker files change
- **Dependency caching**: Speeds up subsequent runs
- **PR comments**: Adds deployment status to pull requests
- **Manual deployment**: Can trigger manually if needed
- **Environment isolation**: Separate environments for PR previews

### 6. Using the Workflow

#### Automatic Deployment:
```bash
# Make changes to worker files
git add worker/
git commit -m "Update contact form validation"
git push origin main
# Deployment starts automatically!
```

#### Manual Deployment:
1. Go to your GitHub repo → **Actions** tab
2. Click **"Deploy Cloudflare Worker"**  
3. Click **"Run workflow"** → **"Run workflow"**

### 7. Monitoring Deployments

- **GitHub Actions tab**: View deployment logs and status
- **Cloudflare Dashboard**: See deployed worker versions
- **Pull requests**: Get deployment status comments

### 8. Troubleshooting

#### Common Issues:

**"API token verification failed"**
- Check your `CLOUDFLARE_API_TOKEN` secret
- Ensure token has Workers:Edit permission

**"Account ID not found"** 
- Verify your `CLOUDFLARE_ACCOUNT_ID` secret
- Copy from Cloudflare dashboard sidebar

**"Secrets not found"**
- Check all 4 secrets are added to GitHub
- Secret names are case-sensitive

**"npm ci failed"**
- Usually resolved automatically on retry
- Check worker/package.json syntax

### 9. Advanced Configuration

You can customize the workflow by editing `.github/workflows/deploy-worker.yml`:

- **Change trigger branches**: Modify `branches: [main]`
- **Add staging environment**: Duplicate job with different secrets
- **Add tests**: Insert testing steps before deployment
- **Notifications**: Add Slack/Discord notifications

### 10. Benefits

- **Zero setup** on local machine  
- **Automatic deployment** on code changes  
- **Team collaboration** with PR previews  
- **Deployment history** and rollback capability  
- **Secure secret management**  
- **Free** (GitHub Actions free tier)

## Next Steps

1. Add the GitHub secrets (step 3 above)
2. Push any change to the `worker/` folder  
3. Watch the magic happen in the Actions tab!

Your worker will be automatically deployed and live within minutes.