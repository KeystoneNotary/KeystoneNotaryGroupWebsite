# Backend Infrastructure - Keystone Notary Group LLC

## Overview
This directory contains backend infrastructure templates and documentation for future service integration.

## Status
🚧 **Not Yet Implemented** - Awaiting service provisioning

## Required Services

### 1. Google Calendar / Google Workspace Integration
**Priority:** HIGH  
**Purpose:** Booking system calendar synchronization

**Setup Steps:**
1. Create Google Cloud Project
2. Enable Google Calendar API
3. Create OAuth 2.0 credentials
4. Configure consent screen
5. Add authorized redirect URIs
6. Store credentials in `.env`

**Documentation:** [Google Calendar API Docs](https://developers.google.com/calendar/api/guides/overview)

---

### 2. Email Service Provider
**Priority:** HIGH  
**Purpose:** Contact form and booking confirmation emails

**Options:**

#### Option A: SendGrid (Recommended for ease of setup)
- Free tier: 100 emails/day
- Setup time: ~15 minutes
- [Sign up](https://signup.sendgrid.com/)

#### Option B: AWS SES (Recommended for cost)
- $0.10 per 1,000 emails
- Requires AWS account
- [Documentation](https://aws.amazon.com/ses/)

#### Option C: Mailgun
- Free tier: 5,000 emails/month (first 3 months)
- [Sign up](https://www.mailgun.com/)

---

### 3. Google reCAPTCHA v3
**Priority:** HIGH  
**Purpose:** Spam protection for forms

**Setup Steps:**
1. Go to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register site: `www.keystonenotarygroup.com`
3. Choose reCAPTCHA v3
4. Copy Site Key and Secret Key to `.env`
5. Add script to HTML (see implementation guide)

---

## Directory Structure

```
backend/
├── api/              # API endpoint handlers (future)
├── services/         # Service integrations (future)
├── utils/            # Utility functions (future)
└── README.md         # This file
```

---

## Implementation Guides

### Contact Form Handler (Template)

```javascript
// backend/api/contact.js
const sendEmail = require('../services/email');
const validateRecaptcha = require('../utils/recaptcha');

async function handleContactForm(req, res) {
    try {
        // Validate reCAPTCHA
        const isHuman = await validateRecaptcha(req.body.recaptchaToken);
        if (!isHuman) {
            return res.status(400).json({ error: 'reCAPTCHA validation failed' });
        }

        // Validate input
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Send email
        await sendEmail({
            to: process.env.NOTIFICATION_EMAIL,
            from: process.env.BUSINESS_EMAIL,
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { handleContactForm };
```

### Google Calendar Integration (Template)

```javascript
// backend/services/calendar.js
const { google } = require('googleapis');

async function createCalendarEvent(appointmentData) {
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_WORKSPACE_CLIENT_ID,
        process.env.GOOGLE_WORKSPACE_CLIENT_SECRET
    );

    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
        summary: `Notary Appointment - ${appointmentData.name}`,
        description: `
            Document Type: ${appointmentData.documentType}
            Service Focus: ${appointmentData.serviceFocus}
            Notes: ${appointmentData.notes}
        `,
        start: {
            dateTime: appointmentData.startDateTime,
            timeZone: 'America/New_York',
        },
        end: {
            dateTime: appointmentData.endDateTime,
            timeZone: 'America/New_York',
        },
        attendees: [
            { email: appointmentData.email }
        ],
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all',
    });

    return response.data;
}

module.exports = { createCalendarEvent };
```

---

## Deployment Options

### Option 1: Netlify Functions (Recommended)
- Serverless functions
- Easy deployment
- Free tier available
- [Documentation](https://docs.netlify.com/functions/overview/)

### Option 2: Vercel Serverless Functions
- Similar to Netlify
- Excellent performance
- [Documentation](https://vercel.com/docs/functions)

### Option 3: AWS Lambda + API Gateway
- Most scalable
- Pay per use
- Requires more setup
- [Documentation](https://aws.amazon.com/lambda/)

---

## Security Checklist

- [ ] Environment variables configured
- [ ] reCAPTCHA v3 implemented
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] API keys never exposed to client
- [ ] Error messages don't leak sensitive info

---

## Testing

Before going live:
1. Test contact form submission
2. Test booking form submission
3. Verify email delivery
4. Test reCAPTCHA validation
5. Test rate limiting
6. Verify calendar event creation
7. Test error handling

---

## Next Steps

1. **Choose email service provider** and create account
2. **Register for Google reCAPTCHA** and get keys
3. **Set up Google Calendar API** access
4. **Choose hosting platform** (Netlify/Vercel/AWS)
5. **Implement backend handlers** using templates above
6. **Test thoroughly** before production deployment
7. **Update frontend** to call backend endpoints

---

## Support

For implementation assistance:
- Google Calendar API: [Stack Overflow](https://stackoverflow.com/questions/tagged/google-calendar-api)
- SendGrid: [Support Docs](https://docs.sendgrid.com/)
- reCAPTCHA: [Developer Guide](https://developers.google.com/recaptcha/docs/v3)

---

**Last Updated:** Current Session  
**Status:** Documentation complete, awaiting service provisioning
