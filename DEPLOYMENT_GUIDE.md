# Production Deployment Guide

This guide covers the steps to deploy your hardened Keystone Notary Group website to production.

## Pre-Deployment Checklist

### 1. Environment Variables Setup

Copy your `.env.example` to `.env.local` and update with production values:

```bash
cp env.example .env.local
```

#### Required Variables

**Session Secret (CRITICAL)**
```bash
# Use the generated value below or generate a new one
SESSION_SECRET=f38f4b2af97f6924b47a931d75e782a3af7342451d4baa9749c890701af1f1a1
```

**Admin Password Hash**
```bash
# Generate using the script:
npm run hash-password

# Then add the output to .env.local:
ADMIN_PASSWORD_HASH=<your_bcrypt_hash_here>
```

**Supabase** (Required for bookings)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Google Calendar** (Optional but recommended)
```bash
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----"
GOOGLE_CALENDAR_ID=primary
```

**Resend Email** (Optional but recommended)
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
NOTARY_EMAIL=contact@keystonenotarygroup.com
```

**Upstash Redis** (Optional - for rate limiting)
```bash
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your_token_here
```

**Site Configuration**
```bash
NEXT_PUBLIC_SITE_URL=https://keystonenotarygroup.com
```

---

## 2. Local Testing

### Test Authentication Flow

1. **Generate Admin Password Hash**
```bash
npm run hash-password
# Enter your desired admin password
# Copy the hash to .env.local as ADMIN_PASSWORD_HASH
```

2. **Start Development Server**
```bash
npm run dev
```

3. **Test Login**
- Navigate to `http://localhost:3000/admin/login`
- Enter your admin password
- Should be redirected to `/admin/dashboard`
- Verify you cannot access dashboard without logging in first

4. **Test CSRF Protection**
- Open browser DevTools > Network tab
- Submit the login form
- Look for `x-csrf-token` header in the request
- Cookie `csrf_token` should be set

### Test Booking Flow

1. **Navigate to Booking Section**
```bash
# Visit http://localhost:3000/#booking
```

2. **Test CSRF Token Fetch**
- Open DevTools Console
- When form opens, check Network tab for `/api/csrf` call
- Should return `{success: true, token: "..."}`

3. **Submit Test Booking**
- Fill out booking form
- Submit and verify:
  - CSRF token is sent in `x-csrf-token` header
  - Booking is saved to Supabase
  - Calendar event is created (if configured)
  - Confirmation emails are sent (if configured)

### Test Rate Limiting

**Login Rate Limit (5 attempts/min)**
```bash
# Try logging in with wrong password 6 times rapidly
# 6th attempt should return 429 Too Many Requests
```

**Booking Rate Limit (10 requests/10s)**
```bash
# If Redis is configured, rapid booking submissions should be rate limited
```

---

## 3. Build Verification

```bash
# Clean build
npm run build

# Should complete without errors
# Check for:
# ✓ Compiled successfully
# ✓ Generating static pages
# ✓ Finalizing page optimization
```

**Expected Output:**
```
Route (app)
┌ ○ /
├ ○ /admin/dashboard
├ ○ /admin/login
├ ƒ /api/admin/bookings
├ ƒ /api/auth/login
├ ƒ /api/auth/logout
├ ƒ /api/bookings/check-availability
├ ƒ /api/bookings/create
└ ƒ /api/csrf

ƒ Proxy (Middleware)
```

---

## 4. Security Verification

### Session Security

**Verify Encrypted Session Cookie:**
1. Login to admin panel
2. Open DevTools > Application > Cookies
3. Find `kng_admin_session` cookie
4. Should be:
   - HttpOnly: ✓
   - Secure: ✓ (in production)
   - SameSite: Strict
   - Value: Encrypted blob (not readable)

### CSRF Protection

**Verify CSRF Implementation:**
1. Inspect booking form submission
2. Check request headers include: `x-csrf-token`
3. Verify cookie `csrf_token` is HttpOnly
4. Try submitting without token → Should get 403

### Rate Limiting

**Test Auth Rate Limit:**
```bash
# Use curl to test:
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"password":"wrong"}' \
    -w "\nStatus: %{http_code}\n"
done

# 6th request should return 429
```

---

## 5. Production Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "feat: Production security hardening

- Implement iron-session for encrypted authentication
- Add CSRF protection with double-submit pattern
- Add auth rate limiting (5 attempts/min)
- Add security headers (HSTS, CSP, etc.)
- Sanitize user inputs in calendar/email
- Fix booking race condition (DB first)
- Add comprehensive pricing tests
- Fix font display FOIT
"

git push origin main
```

2. **Configure Environment Variables in Vercel**
```bash
# Via Vercel Dashboard or CLI:
vercel env add SESSION_SECRET production
vercel env add ADMIN_PASSWORD_HASH production
# ... add all other env vars
```

3. **Deploy**
```bash
vercel --prod
```

### Other Platforms (Netlify, Railway, etc.)

1. Set all environment variables in platform dashboard
2. Ensure Node.js version is 18+ (check `package.json` engines field)
3. Build command: `npm run build`
4. Start command: `npm start`

---

## 6. Post-Deployment Verification

### Security Headers Check

Visit [SecurityHeaders.com](https://securityheaders.com/?q=https://your-domain.com)

**Expected Headers:**
- Strict-Transport-Security: ✓
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

**Target Grade: A or A+**

### SSL/TLS Check

Visit [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com)

**Target Grade: A or A+**

### Functionality Testing

**Critical Path Tests:**
1. ✓ Homepage loads
2. ✓ Booking form works end-to-end
3. ✓ Calendar availability checks work
4. ✓ Admin login works
5. ✓ Admin dashboard requires authentication
6. ✓ Email confirmations are sent
7. ✓ Calendar events are created

---

## 7. Monitoring & Maintenance

### Error Monitoring

Consider adding error tracking:
- **Sentry**: Application error monitoring
- **LogRocket**: Session replay for debugging
- **Vercel Analytics**: Performance monitoring

### Database Backups

**Supabase:**
- Enable automatic backups in project settings
- Test restore procedure quarterly

### Security Audits

**Regular Checks:**
- Monthly: Review Supabase logs for suspicious activity
- Monthly: Check rate limit effectiveness in Upstash dashboard
- Quarterly: Rotate SESSION_SECRET and ADMIN_PASSWORD_HASH
- Annually: Full security audit

### Updates

```bash
# Check for dependency updates monthly
npm outdated

# Update dependencies (test thoroughly)
npm update

# Rebuild and redeploy
npm run build
npm test
```

---

## 8. Rollback Procedure

If issues arise in production:

1. **Immediate Rollback**
```bash
vercel rollback
```

2. **Fix and Redeploy**
```bash
# Fix the issue locally
npm run build
npm test

# Deploy when ready
vercel --prod
```

---

## Common Issues & Solutions

### Issue: Login Fails with "Session configuration error"

**Solution:** SESSION_SECRET is missing or too short
```bash
# Verify in Vercel/Platform dashboard
# Must be at least 32 characters (64 recommended)
```

### Issue: CSRF Validation Fails

**Solution:** Check that CSRF token endpoint is accessible
```bash
curl https://your-domain.com/api/csrf
# Should return: {"success":true,"token":"..."}
```

### Issue: Rate Limiting Not Working

**Solution:** Verify Upstash Redis credentials
```bash
# Check UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN
# Visit Upstash dashboard to verify connection
```

### Issue: Middleware Throws Error

**Solution:** SESSION_SECRET environment variable not set in production
```bash
# Add to Vercel environment variables
# Redeploy
```

---

## Security Incident Response

If a security incident is detected:

1. **Immediate Actions**
   - Rotate SESSION_SECRET immediately
   - Change ADMIN_PASSWORD_HASH
   - Review Supabase logs for unauthorized access
   - Check Upstash rate limit logs

2. **Investigation**
   - Review application logs
   - Check for unusual booking patterns
   - Verify no data breach occurred

3. **Communication**
   - Notify affected users if personal data compromised
   - Document incident and response
   - Update security procedures

---

## Performance Optimization

### After Deployment

1. **Run Lighthouse Audit**
```bash
# In Chrome DevTools
# Target scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 95+
```

2. **Monitor Core Web Vitals**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

3. **Optimize as Needed**
- Enable Vercel Edge Functions for middleware
- Configure ISR (Incremental Static Regeneration) for dynamic pages
- Add CDN caching headers

---

## Support & Resources

- **Documentation**: /IMPLEMENTATION_PLAN.md
- **Claude Code Guide**: https://claude.com/claude-code
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Iron-Session**: https://github.com/vvo/iron-session

---

**Deployment Completed Successfully? ✓**

Run through this checklist one final time before marking as production-ready.
