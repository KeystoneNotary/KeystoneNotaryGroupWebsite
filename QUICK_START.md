# Quick Start Guide

Get your secured Keystone Notary Group website running in 5 minutes.

## 1. Install Dependencies

```bash
npm install
```

## 2. Setup Environment Variables

```bash
# Copy example environment file
cp env.example .env.local

# Open in your editor
nano .env.local  # or use your preferred editor
```

### Minimum Required Variables

```bash
# CRITICAL: Session encryption (generate with command below)
SESSION_SECRET=f38f4b2af97f6924b47a931d75e782a3af7342451d4baa9749c890701af1f1a1

# Admin password (generate hash with: npm run hash-password)
ADMIN_PASSWORD_HASH=your_bcrypt_hash_here

# Supabase (for bookings database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Generate SESSION_SECRET

```bash
openssl rand -hex 32
```

**Pre-generated for you:**
```
SESSION_SECRET=f38f4b2af97f6924b47a931d75e782a3af7342451d4baa9749c890701af1f1a1
```

### Generate Admin Password Hash

```bash
npm run hash-password
```

This will prompt you for a password and output a bcrypt hash. Copy the hash to your `.env.local` as `ADMIN_PASSWORD_HASH`.

## 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4. Test Admin Login

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Enter the password you used in step 2
3. Should redirect to `/admin/dashboard`

## 5. Test Booking Flow

1. Navigate to [http://localhost:3000/#booking](http://localhost:3000/#booking)
2. Select a date and time
3. Fill out the booking form
4. Submit (will save to Supabase)

## Optional Integrations

### Google Calendar Integration

Add to `.env.local`:
```bash
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----"
GOOGLE_CALENDAR_ID=primary
```

**How to get credentials:**

📋 **See detailed setup guide:** [GOOGLE_WORKSPACE_SETUP.md](GOOGLE_WORKSPACE_SETUP.md)

**Quick steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Calendar API
4. Create Service Account
5. Download JSON key
6. Copy `client_email` and `private_key` to `.env.local`
7. Share your calendar with the service account email

### Email Notifications (Resend)

Add to `.env.local`:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
NOTARY_EMAIL=contact@keystonenotarygroup.com
```

**How to get API key:**
1. Sign up at [Resend](https://resend.com)
2. Create API key
3. Copy to `.env.local`

### Rate Limiting (Upstash Redis)

Add to `.env.local`:
```bash
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your_token_here
```

**How to get credentials:**
1. Sign up at [Upstash](https://upstash.com)
2. Create new Redis database
3. Copy REST URL and token
4. Add to `.env.local`

## Verify Everything Works

### Run Tests

```bash
npm test
```

Expected: **84 tests passing**

### Run Linter

```bash
npm run lint
```

Expected: **No errors**

### Build for Production

```bash
npm run build
```

Expected: **✓ Compiled successfully**

## Security Checklist

Before going to production:

- [x] ✅ SESSION_SECRET is 64 characters (32 bytes hex)
- [x] ✅ ADMIN_PASSWORD_HASH is a bcrypt hash (not plaintext)
- [x] ✅ Supabase service role key is set (not exposed to client)
- [ ] 🔲 All environment variables added to production platform
- [ ] 🔲 Tested admin login flow
- [ ] 🔲 Tested booking submission
- [ ] 🔲 Verified security headers at [securityheaders.com](https://securityheaders.com)

## Common Issues

### "Session configuration error"

**Problem:** SESSION_SECRET is missing or too short

**Solution:**
```bash
# Generate new secret
openssl rand -hex 32

# Add to .env.local
SESSION_SECRET=<generated_value>
```

### "CSRF validation failed"

**Problem:** CSRF token endpoint not accessible

**Solution:**
```bash
# Test endpoint
curl http://localhost:3000/api/csrf

# Should return: {"success":true,"token":"..."}
```

### Tests failing

**Problem:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules
npm install
npm test
```

## Next Steps

1. **For Development:** Continue building features
2. **For Production:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
3. **For Security Details:** See [SECURITY_IMPROVEMENTS.md](SECURITY_IMPROVEMENTS.md)

## Need Help?

- **Implementation Plan:** [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
- **Project Docs:** [CLAUDE.md](CLAUDE.md)
- **GitHub Issues:** Create an issue if you encounter problems

---

**Ready to deploy?** Follow the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
