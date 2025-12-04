# Deployment Guide - Keystone Notary Group LLC Website

## Pre-Deployment Checklist

### 1. Domain & DNS Configuration
- [x] Domain registered: `www.keystonenotarygroup.com`
- [ ] DNS A record pointing to hosting provider
- [ ] DNS CNAME for www subdomain
- [ ] SSL certificate configured
- [ ] HTTPS redirect enabled

### 2. Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all required API keys
- [ ] Verify Google Calendar credentials
- [ ] Verify email service credentials
- [ ] Verify reCAPTCHA keys

### 3. Asset Optimization
- [ ] Compress hero video to <2MB
- [ ] Create mobile-optimized video version
- [ ] Add video poster images
- [ ] Optimize all images
- [ ] Minify CSS and JavaScript

### 4. Testing
- [ ] Test all forms locally
- [ ] Verify email delivery
- [ ] Test booking calendar
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (target >90)
- [ ] Verify accessibility (WCAG AA)
- [ ] Cross-browser testing

---

## Recommended Hosting: Netlify

### Why Netlify?
- Free SSL certificates
- Automatic HTTPS
- CDN included
- Serverless functions support
- Easy deployment from Git
- Excellent performance

### Deployment Steps

#### 1. Prepare Repository
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Connect to Netlify
1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command:** `npm run build` (if using build process)
   - **Publish directory:** `.` (root directory for static site)

#### 3. Configure Environment Variables
In Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add all variables from `.env.example`
3. Save changes

#### 4. Configure Domain
1. Go to Domain settings
2. Add custom domain: `www.keystonenotarygroup.com`
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic with Netlify)

#### 5. Deploy
- Netlify will automatically deploy on every push to main branch
- Manual deploy: Click "Trigger deploy" in dashboard

---

## Alternative: Vercel

### Deployment Steps
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts to configure project
```

---

## Alternative: AWS S3 + CloudFront

### For Static Site Hosting

#### 1. Create S3 Bucket
```bash
aws s3 mb s3://www.keystonenotarygroup.com
```

#### 2. Configure Bucket for Website Hosting
```bash
aws s3 website s3://www.keystonenotarygroup.com \
  --index-document index.html \
  --error-document index.html
```

#### 3. Upload Files
```bash
aws s3 sync . s3://www.keystonenotarygroup.com \
  --exclude ".git/*" \
  --exclude "node_modules/*" \
  --exclude ".env"
```

#### 4. Create CloudFront Distribution
- Origin: S3 bucket
- Enable HTTPS
- Configure custom domain
- Set up SSL certificate (AWS Certificate Manager)

---

## Performance Optimization

### Video Optimization
```bash
# Compress hero video using FFmpeg
ffmpeg -i assets/videos/hero-video.mp4 \
  -vcodec libx264 -crf 28 \
  -preset slow \
  -vf scale=1920:-2 \
  assets/videos/hero-video-optimized.mp4

# Create mobile version
ffmpeg -i assets/videos/hero-video.mp4 \
  -vcodec libx264 -crf 30 \
  -preset slow \
  -vf scale=1280:-2 \
  assets/videos/hero-video-mobile.mp4
```

### Image Optimization
```bash
# Install imagemin-cli
npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant

# Optimize images
imagemin assets/images/*.{jpg,png} \
  --out-dir=assets/images/optimized \
  --plugin=mozjpeg \
  --plugin=pngquant
```

---

## Build Process (Optional)

### Using Vite

#### 1. Install Vite
```bash
npm install --save-dev vite
```

#### 2. Create vite.config.js
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap']
        }
      }
    }
  }
});
```

#### 3. Update package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### 4. Build for Production
```bash
npm run build
```

---

## Post-Deployment

### 1. Verify Deployment
- [ ] Visit https://www.keystonenotarygroup.com
- [ ] Test all navigation links
- [ ] Submit test contact form
- [ ] Test booking calendar
- [ ] Verify mobile responsiveness
- [ ] Check SSL certificate

### 2. Set Up Monitoring
- [ ] Google Analytics 4
- [ ] Google Search Console
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Error tracking (Sentry)

### 3. SEO Setup
- [ ] Submit sitemap to Google Search Console
- [ ] Verify structured data (Schema.org)
- [ ] Set up Google My Business
- [ ] Configure robots.txt

---

## Continuous Deployment

### Automatic Deployment on Git Push
With Netlify or Vercel, every push to main branch triggers automatic deployment.

### Manual Deployment
```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod
```

---

## Rollback Procedure

### Netlify
1. Go to Deploys tab
2. Find previous successful deploy
3. Click "Publish deploy"

### Vercel
```bash
vercel rollback
```

---

## Troubleshooting

### Issue: Forms not working
- Verify backend endpoints are deployed
- Check environment variables
- Verify CORS configuration

### Issue: Slow load times
- Check video file sizes
- Verify CDN is enabled
- Run Lighthouse audit
- Check image optimization

### Issue: SSL certificate errors
- Verify DNS configuration
- Wait for DNS propagation (up to 48 hours)
- Check certificate renewal settings

---

## Support Resources

- **Netlify Docs:** https://docs.netlify.com/
- **Vercel Docs:** https://vercel.com/docs
- **AWS S3 Docs:** https://docs.aws.amazon.com/s3/
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse

---

## Maintenance Schedule

### Weekly
- Check uptime monitoring
- Review error logs
- Monitor form submissions

### Monthly
- Review analytics
- Update dependencies
- Check SSL certificate expiration
- Backup website files

### Quarterly
- Security audit
- Performance review
- Content updates
- SEO review

---

**Last Updated:** Current Session  
**Status:** Ready for deployment pending service provisioning
