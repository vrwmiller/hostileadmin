# Contact Form Worker

This Cloudflare Worker handles contact form submissions and sends emails via SMTP2GO.

## Deployment Options

### Option 1: Local Development (requires npm/wrangler)

1. **Install dependencies:**
   ```bash
   cd worker
   npm install
   ```

2. **Configure secrets:**
   ```bash
   # Set your SMTP2GO API key
   npx wrangler secret put SMTP2GO_API_KEY
   
   # Set recipient email
   npx wrangler secret put RECIPIENT_EMAIL
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   # or
   npx wrangler deploy
   ```

### Option 2: Cloudflare Dashboard (No local tools needed)

1. **Go to Cloudflare Dashboard:**
   - Navigate to https://dash.cloudflare.com
   - Select your account → Workers & Pages

2. **Create new Worker:**
   - Click "Create application" → "Create Worker"
   - Name it `contact-form-worker`

3. **Copy the code:**
   - Copy contents of `src/index.js`
   - Paste into the Cloudflare code editor
   - Click "Save and Deploy"

4. **Set environment variables:**
   - Go to Worker → Settings → Variables
   - Add `SMTP2GO_API_KEY` (encrypted)
   - Add `RECIPIENT_EMAIL` (encrypted)

### Option 3: GitHub Actions (Automated deployment)

Create `.github/workflows/deploy.yml` in your repo:

```yaml
name: Deploy Worker
on:
  push:
    branches: [main]
    paths: ['worker/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: worker
          secrets: |
            SMTP2GO_API_KEY
            RECIPIENT_EMAIL
        env:
          SMTP2GO_API_KEY: ${{ secrets.SMTP2GO_API_KEY }}
          RECIPIENT_EMAIL: ${{ secrets.RECIPIENT_EMAIL }}
```

### 4. Configure Routes
In your Cloudflare dashboard, add a route for the worker:
- Route: `hostileadmin.com/api/contact`
- Worker: `hostileadmin-contact-worker`

## SMTP2GO Configuration

### API Key
1. Log into your SMTP2GO account
2. Go to Settings > API Keys
3. Create a new API key with "Send Email" permissions
4. Use `wrangler secret put SMTP2GO_API_KEY` to set it

### Verified Sender
Make sure your `FROM_EMAIL` is verified in SMTP2GO:
1. Go to Settings > Sender Domains
2. Add and verify your domain
3. Or add a specific email address in Settings > Sender Addresses

## Features

- Form validation (client and server-side)
- Spam protection with basic pattern detection
- Rate limiting (IP-based)
- CORS support for cross-origin requests
- HTML and plain text email formats
- Error handling and user feedback
- Security headers and input sanitization

## Testing

### Local Development
```bash
cd worker
npm run dev
```

### Testing the Endpoint
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/ \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "subject=Test Subject" \
  -F "message=This is a test message"
```

## Security

- All user input is validated and sanitized
- Basic spam detection patterns
- Rate limiting to prevent abuse
- CORS properly configured
- Secrets stored securely in Cloudflare

## Monitoring

Check worker logs in the Cloudflare dashboard:
1. Go to Workers & Pages
2. Select your worker
3. View logs and metrics in the dashboard