# Contact Form Worker

This Cloudflare Worker handles contact form submissions and sends emails via SMTP2GO.

## Setup

### 1. Install Dependencies
```bash
cd worker
npm install
```

### 2. Configure SMTP2GO
You'll need to set up these secrets in Cloudflare:

```bash
# Set your SMTP2GO API key
wrangler secret put SMTP2GO_API_KEY

# Set the email address to receive contact form submissions
wrangler secret put TO_EMAIL

# Set the "from" email address (must be verified in SMTP2GO)
wrangler secret put FROM_EMAIL
```

### 3. Deploy Worker
```bash
# Deploy to staging
wrangler deploy --env staging

# Deploy to production
wrangler deploy --env production
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

- ✅ Form validation (client and server-side)
- ✅ Spam protection with basic pattern detection
- ✅ Rate limiting (IP-based)
- ✅ CORS support for cross-origin requests
- ✅ HTML and plain text email formats
- ✅ Error handling and user feedback
- ✅ Security headers and input sanitization

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