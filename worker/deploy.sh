#!/bin/bash

# Contact Form Worker Deployment Script
# This script helps deploy the worker and set up the necessary configuration

set -e

echo "Deploying Contact Form Worker"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "ERROR: Wrangler CLI not found. Please install it first:"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if we're in the worker directory
if [ ! -f "wrangler.toml" ]; then
    echo "ERROR: Please run this script from the worker directory"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Check for required secrets
echo "Checking for required secrets..."
echo "Make sure you have set these secrets:"
echo "- SMTP2GO_API_KEY (your SMTP2GO API key)"
echo "- TO_EMAIL (email address to receive submissions)"
echo "- FROM_EMAIL (verified sender email in SMTP2GO)"
echo ""

read -p "Have you set all required secrets? (y/n): " -n 1 -r
echo
if [[ ! $REPLYMATCHES ^[Yy]$ ]]; then
    echo "Please set secrets first:"
    echo "wrangler secret put SMTP2GO_API_KEY"
    echo "wrangler secret put TO_EMAIL"
    echo "wrangler secret put FROM_EMAIL"
    exit 1
fi

# Ask for deployment environment
echo "Select deployment environment:"
echo "1) Staging"
echo "2) Production"
read -p "Enter choice (1-2): " choice

case $choice in
    1)
        echo "Deploying to staging..."
        wrangler deploy --env staging
        ;;
    2)
        echo "Deploying to production..."
        wrangler deploy --env production
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Configure worker route in Cloudflare dashboard:"
echo "   Route: yourdomain.com/api/contact"
echo "   Worker: hostileladmin-contact-worker"
echo ""
echo "2. Test the contact form on your website"
echo ""
echo "3. Monitor logs in the Cloudflare dashboard"