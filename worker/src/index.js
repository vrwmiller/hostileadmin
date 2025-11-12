/**
// Contact Form Worker for SMTP2GO integration
// Handles form submissions and sends emails
// Test deployment via GitHub Actions
 */

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Debug: Log request details
      console.log('Request method:', request.method);
      console.log('Request path:', url.pathname);
      console.log('Environment variables available:', {
        hasApiKey: !!env.SMTP2GO_API_KEY,
        hasToEmail: !!env.TO_EMAIL,
        hasFromEmail: !!env.FROM_EMAIL
      });
      
      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      // Check if this is the contact form endpoint
      if (url.pathname !== '/api/contact' && url.pathname !== '/') {
        return new Response('Not Found', { 
          status: 404, 
          headers: corsHeaders 
        });
      }

      // Only allow POST requests for form submissions
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { 
          status: 405, 
          headers: corsHeaders 
        });
      }

      // Parse form data
      const formData = await request.formData();
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const subject = formData.get('subject')?.toString().trim();
      const message = formData.get('message')?.toString().trim();

      // Validate required fields
      const validation = validateFormData({ name, email, subject, message });
      if (!validation.isValid) {
        return new Response(JSON.stringify({
          success: false,
          error: validation.errors.join(', ')
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Check rate limiting (simple IP-based)
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rateLimitKey = `rate_limit:${clientIP}`;
      
      // Note: In production, you'd use Cloudflare KV or Durable Objects for rate limiting
      // This is a simplified version for demonstration

      // Send email via SMTP2GO
      const emailResult = await sendEmailViaSMTP2GO({
        name,
        email,
        subject,
        message
      }, env);

      if (!emailResult.success) {
        console.error('Email sending failed:', emailResult.error);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to send email. Please try again later.'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Success response
      return new Response(JSON.stringify({
        success: true,
        message: 'Thank you for your message. We\'ll get back to you soon!'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'An unexpected error occurred. Please try again later.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Validate form data
 */
function validateFormData({ name, email, subject, message }) {
  const errors = [];

  if (!name || name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!subject || subject.length < 3) {
    errors.push('Subject must be at least 3 characters long');
  }

  if (!message || message.length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  // Check for potential spam patterns
  if (containsSpamPatterns(message)) {
    errors.push('Message contains prohibited content');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Simple email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Basic spam detection
 */
function containsSpamPatterns(text) {
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
    /https?:\/\/[^\s]+\.(tk|ml|ga|cf)\b/i, // Suspicious TLDs
    /\b\w*\d{4,}\w*\b/g // Long number sequences
  ];

  return spamPatterns.some(pattern => pattern.test(text));
}

/**
 * Send email via SMTP2GO API
 */
async function sendEmailViaSMTP2GO({ name, email, subject, message }, env) {
  try {
    const smtp2goPayload = {
      api_key: env.SMTP2GO_API_KEY,
      to: [env.TO_EMAIL || 'contact@hostileadmin.com'],
      sender: env.FROM_EMAIL || 'noreply@hostileadmin.com',
      subject: `[Contact Form] ${subject}`,
      text_body: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from hostileadmin.com contact form
IP: ${env.CF_CONNECTING_IP || 'unknown'}
Timestamp: ${new Date().toISOString()}
      `.trim(),
      html_body: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <h4>Message:</h4>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent from hostileadmin.com contact form<br>
        Timestamp: ${new Date().toISOString()}</small></p>
      `
    };

    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Smtp2go-Api-Key': env.SMTP2GO_API_KEY
      },
      body: JSON.stringify(smtp2goPayload)
    });

    const result = await response.json();

    if (!response.ok || result.request_id === undefined) {
      console.error('SMTP2GO API error:', result);
      return {
        success: false,
        error: result.error || 'SMTP2GO API request failed'
      };
    }

    console.log('Email sent successfully:', result.request_id);
    return {
      success: true,
      requestId: result.request_id
    };

  } catch (error) {
    console.error('SMTP2GO integration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}