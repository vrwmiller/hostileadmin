# hostileadmin website

A modern, elegant website built with static HTML/CSS and powered by Cloudflare Workers for dynamic functionality.

## Architecture

- **Frontend**: Static HTML/CSS with modern glassmorphism design
- **Backend**: Cloudflare Worker for contact form processing
- **Email**: SMTP2GO integration for reliable email delivery
- **Hosting**: Cloudflare Pages for global CDN and performance

## Project Structure

```
hostiladmin-cf/
├── public/              # Static website files
│   ├── *.html          # Website pages
│   ├── style.css       # Modern CSS with glassmorphism
│   └── images/         # Images and assets
├── worker/              # Cloudflare Worker
│   ├── src/
│   │   └── index.js    # Contact form handler
│   ├── package.json    # Worker dependencies
│   ├── wrangler.toml   # Worker configuration
│   ├── deploy.sh       # Deployment script
│   └── README.md       # Worker setup guide
└── README.md           # This file
```

## Quick Start

### 1. Static Website
The static files in `public/` can be deployed to any static hosting service. For Cloudflare Pages:

```bash
# Deploy to Cloudflare Pages
# Connect your GitHub repo in the Cloudflare dashboard
# Set build directory to: public/
```

### 2. Contact Form Worker

Choose your preferred deployment method:

- **GitHub Actions** (Recommended): Automatic deployment on push
  - See `.github/GITHUB_ACTIONS_SETUP.md` for complete setup guide

- **Cloudflare Dashboard**: No local tools needed  
  - See `worker/DEPLOY_NO_NPM.md` for browser-only deployment

- **Local CLI**: Traditional npm/wrangler workflow
  - See `worker/README.md` for detailed instructions

## Features

### Website
- **Modern Design**: Glassmorphism effects and elegant typography
- **Responsive**: Mobile-first design that works on all devices  
- **Performance**: Optimized static files with CDN delivery
- **Navigation**: Clean, intuitive navigation between pages

### Contact Form
- **Email Integration**: SMTP2GO for reliable email delivery
- **Security**: Input validation, spam protection, rate limiting
- **Validation**: Client and server-side form validation
- **UX**: Real-time feedback and loading states

## Development

### Local Development
```bash
# Serve static files locally
cd public
python -m http.server 8000
# Visit: http://localhost:8000

# Test worker locally
cd worker
npm run dev
```

### Making Changes
1. Edit files in `public/` for website changes
2. Edit `worker/src/index.js` for contact form functionality  
3. Test locally before deploying
4. Deploy via Cloudflare dashboard or CLI

## Email Configuration

The contact form uses SMTP2GO for email delivery. You'll need:

1. **SMTP2GO Account**: Sign up at smtp2go.com
2. **API Key**: Generate in SMTP2GO dashboard
3. **Verified Sender**: Add your domain/email to SMTP2GO
4. **Worker Secrets**: Configure via Wrangler CLI

See `worker/README.md` for detailed setup instructions.

## Security

- Input validation and sanitization
- Basic spam detection patterns
- Rate limiting to prevent abuse  
- CORS properly configured
- Secrets stored securely in Cloudflare

## Monitoring

- **Website**: Cloudflare Analytics for traffic and performance
- **Worker**: Cloudflare dashboard for logs and metrics
- **Email**: SMTP2GO dashboard for delivery statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
