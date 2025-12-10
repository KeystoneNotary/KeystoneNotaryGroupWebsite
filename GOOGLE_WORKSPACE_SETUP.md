# Google Workspace / Calendar Setup Guide

Complete guide to integrate your Keystone Notary Group website with Google Calendar for automated booking management.

---

## Overview

This integration allows:
- ✅ Automatic creation of Google Calendar events when customers book appointments
- ✅ Real-time availability checking to prevent double-booking
- ✅ Centralized calendar management through Google Calendar
- ✅ Mobile notifications through Google Calendar app
- ✅ Sync across all your devices (phone, tablet, desktop)

---

## Prerequisites

**Required:**
- Google Workspace account (formerly G Suite) **OR** Regular Google Account
- Admin access to Google Cloud Console
- 10-15 minutes to complete setup

**Recommended:**
- Dedicated calendar for notary bookings (we'll create this)
- Basic familiarity with Google Cloud Platform

---

## Step 1: Create Google Cloud Project

### 1.1 Go to Google Cloud Console

Visit: [https://console.cloud.google.com](https://console.cloud.google.com)

**Sign in with your Google account** (the one that owns the calendar you'll use)

### 1.2 Create New Project

1. Click the project dropdown at the top (says "Select a project")
2. Click **"New Project"** in the top-right corner
3. Enter project details:
   - **Project Name**: `Keystone Notary Bookings` (or your preference)
   - **Organization**: Leave as is
   - **Location**: Leave as is
4. Click **"Create"**
5. Wait 10-20 seconds for project creation

### 1.3 Select Your Project

1. Click the project dropdown again
2. Select your newly created project ("Keystone Notary Bookings")

---

## Step 2: Enable Google Calendar API

### 2.1 Navigate to API Library

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Or visit: [https://console.cloud.google.com/apis/library](https://console.cloud.google.com/apis/library)

### 2.2 Enable Calendar API

1. In the search bar, type: `Google Calendar API`
2. Click on **"Google Calendar API"** from results
3. Click the blue **"Enable"** button
4. Wait for API to be enabled (10-15 seconds)

---

## Step 3: Create Service Account

A service account allows your website to access Google Calendar without requiring user login.

### 3.1 Navigate to Service Accounts

1. In the left sidebar: **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** at the top
3. Select **"Service Account"**

### 3.2 Configure Service Account

**Step 1 - Service account details:**
- **Service account name**: `notary-booking-service`
- **Service account ID**: (auto-generated, leave as is)
- **Description**: `Service account for managing notary booking calendar`
- Click **"Create and Continue"**

**Step 2 - Grant access (Optional):**
- Skip this step (not needed)
- Click **"Continue"**

**Step 3 - Grant users access (Optional):**
- Skip this step (not needed)
- Click **"Done"**

### 3.3 Create Service Account Key

This is the credential your website will use:

1. You should now see your service account in the list
2. Click on the **email address** of your new service account
3. Click the **"Keys"** tab at the top
4. Click **"Add Key"** → **"Create new key"**
5. Select **"JSON"** format
6. Click **"Create"**

**Important:** A JSON file will download to your computer. This contains sensitive credentials - keep it safe!

---

## Step 4: Extract Credentials from JSON File

### 4.1 Open the Downloaded JSON File

1. Locate the file (likely in your Downloads folder)
2. Named something like: `keystone-notary-bookings-abc123.json`
3. Open with a text editor (Notepad, VSCode, etc.)

### 4.2 Find the Two Required Values

Look for these two fields in the JSON:

```json
{
  "type": "service_account",
  "project_id": "keystone-notary-bookings-123456",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...\n-----END PRIVATE KEY-----\n",
  "client_email": "notary-booking-service@keystone-notary-bookings-123456.iam.gserviceaccount.com",
  "client_id": "123456789",
  ...
}
```

**You need:**
1. **`client_email`** - The email address of your service account
2. **`private_key`** - The entire private key (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

---

## Step 5: Share Calendar with Service Account

The service account needs permission to access your Google Calendar.

### 5.1 Open Google Calendar

Visit: [https://calendar.google.com](https://calendar.google.com)

### 5.2 Create Dedicated Booking Calendar (Recommended)

**Option A: Create New Calendar (Recommended)**

1. In the left sidebar, click **"+"** next to "Other calendars"
2. Select **"Create new calendar"**
3. Enter details:
   - **Name**: `Notary Bookings`
   - **Description**: `Customer appointment bookings`
   - **Time zone**: `America/New_York` (or your timezone)
4. Click **"Create calendar"**

**Option B: Use Existing Calendar**

Skip to Step 5.3 and use your primary calendar instead.

### 5.3 Share Calendar with Service Account

1. In the left sidebar, find your calendar ("Notary Bookings" or "Primary")
2. Hover over it and click the **three dots** (⋮)
3. Select **"Settings and sharing"**
4. Scroll down to **"Share with specific people or groups"**
5. Click **"+ Add people and groups"**
6. **Paste the service account email** (from JSON file: `client_email`)
   - Example: `notary-booking-service@keystone-notary-bookings-123456.iam.gserviceaccount.com`
7. Set permission to **"Make changes to events"**
8. Click **"Send"**

### 5.4 Get Calendar ID

1. Still in calendar settings, scroll down to **"Integrate calendar"** section
2. Copy the **"Calendar ID"**
   - For primary calendar: Usually your email address
   - For custom calendar: Looks like `abc123xyz@group.calendar.google.com`

**Save this Calendar ID** - you'll need it for environment variables.

---

## Step 6: Add Environment Variables

### 6.1 Open Your `.env.local` File

In your project directory, open `.env.local` (or create it from `env.example`).

### 6.2 Add Google Calendar Variables

```bash
# Google Calendar Integration
GOOGLE_CLIENT_EMAIL=notary-booking-service@keystone-notary-bookings-123456.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=abc123xyz@group.calendar.google.com
```

**Important Notes:**

1. **`GOOGLE_CLIENT_EMAIL`** - Copy exactly from JSON file
2. **`GOOGLE_PRIVATE_KEY`** - Must be wrapped in **double quotes** because it contains newlines (`\n`)
3. **`GOOGLE_CALENDAR_ID`** - Use `primary` for main calendar OR the custom calendar ID

### 6.3 Format Private Key Correctly

The private key in the JSON file has actual line breaks. You need to **escape them as `\n`**.

**Example:**

JSON file shows:
```
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgI...\n-----END PRIVATE KEY-----\n"
```

Your `.env.local` should have:
```bash
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQ...\n-----END PRIVATE KEY-----\n"
```

**Tip:** Most JSON files already have `\n` in the string - just copy it exactly as shown.

---

## Step 7: Test the Integration

### 7.1 Start Development Server

```bash
npm run dev
```

### 7.2 Test Calendar Connection

Open your browser's developer console and check for errors when accessing:

```
http://localhost:3000/api/bookings/check-availability?date=2025-12-15
```

**Success Response:**
```json
{
  "availableSlots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
}
```

**Error Response:**
- If you see "Failed to check availability" → Check credentials
- Check server logs for specific error messages

### 7.3 Test Booking Creation

1. Go to: `http://localhost:3000/#booking`
2. Fill out and submit a test booking
3. Check your Google Calendar - you should see the event appear!

---

## Step 8: Verify Admin Dashboard

### 8.1 Login to Admin Panel

```
http://localhost:3000/admin/login
```

### 8.2 Check Calendar Sync Status

In the dashboard, you should see:
- **Green checkmark** "Synced" for bookings with calendar events
- **Yellow warning** "Not Synced" for bookings without calendar events

---

## Troubleshooting

### Issue: "Calendar API has not been used in project"

**Cause:** Calendar API not enabled

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **"APIs & Services"** → **"Library"**
4. Search "Google Calendar API"
5. Click **"Enable"**

### Issue: "Insufficient Permission"

**Cause:** Service account doesn't have calendar access

**Solution:**
1. Open [Google Calendar](https://calendar.google.com)
2. Find your calendar in the sidebar
3. Click three dots (⋮) → **"Settings and sharing"**
4. Under **"Share with specific people"**, verify service account email is listed
5. Ensure permission is set to **"Make changes to events"**

### Issue: "Error: Invalid grant"

**Cause:** `GOOGLE_PRIVATE_KEY` is malformed

**Solution:**
1. Re-download the JSON key file from Google Cloud Console
2. Copy the `private_key` value exactly (including `\n` characters)
3. Wrap in double quotes in `.env.local`
4. Restart development server

### Issue: Calendar events not appearing

**Cause:** Wrong calendar ID or calendar not shared

**Solution:**
1. Verify `GOOGLE_CALENDAR_ID` in `.env.local`
2. Check calendar sharing settings
3. Try using `primary` as the calendar ID to test main calendar
4. Check server logs for specific errors

### Issue: "Cannot read property 'data' of undefined"

**Cause:** API response structure changed or network error

**Solution:**
1. Check your internet connection
2. Verify Google Calendar API is enabled
3. Check service account key is valid
4. Review server logs for detailed error messages

---

## Security Best Practices

### ✅ DO:
- Keep the JSON key file secure (add to `.gitignore`)
- Use a dedicated service account for bookings
- Regularly rotate service account keys (every 6-12 months)
- Use a dedicated calendar for bookings (not your personal calendar)
- Enable 2FA on your Google Workspace account

### ❌ DON'T:
- Commit the JSON key file to Git
- Share your service account credentials
- Use your personal calendar for production bookings
- Give service account more permissions than needed

---

## Calendar Configuration Options

### Business Hours

Default availability: **9 AM - 5 PM EST**

To change, edit `src/lib/google-calendar.ts`:

```typescript
// Line 93-94
const timeMin = `${date}T09:00:00-05:00`; // 9 AM EST
const timeMax = `${date}T17:00:00-05:00`; // 5 PM EST
```

### Appointment Duration

Default duration: **60 minutes**

To change, edit `src/lib/google-calendar.ts`:

```typescript
// Line 51-52
const endTime = new Date(startTime);
endTime.setHours(endTime.getHours() + 1); // Change to 2 for 2-hour appointments
```

### Timezone

Default timezone: **America/New_York (EST/EDT)**

To change, edit `src/lib/google-calendar.ts`:

```typescript
// Line 10
const TIMEZONE = "America/New_York"; // Change to your timezone
```

[See all timezones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

---

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. **Add environment variables to your hosting platform:**
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_CALENDAR_ID`

2. **Test in production:**
   - Submit a test booking
   - Verify calendar event is created
   - Check admin dashboard shows "Synced" status

3. **Monitor for errors:**
   - Check platform logs for calendar-related errors
   - Set up error alerts if available

---

## Maintenance

### Monthly:
- [ ] Review calendar events for accuracy
- [ ] Check for any "Not Synced" bookings in admin dashboard
- [ ] Verify calendar sharing permissions are still active

### Quarterly:
- [ ] Review service account permissions
- [ ] Check for Google Calendar API updates
- [ ] Test booking flow end-to-end

### Annually:
- [ ] Rotate service account key
- [ ] Review and update business hours/timezone if needed
- [ ] Audit calendar access permissions

---

## Additional Resources

- **Google Calendar API Docs:** [https://developers.google.com/calendar/api](https://developers.google.com/calendar/api)
- **Service Accounts Guide:** [https://cloud.google.com/iam/docs/service-accounts](https://cloud.google.com/iam/docs/service-accounts)
- **Google Cloud Console:** [https://console.cloud.google.com](https://console.cloud.google.com)

---

## Need Help?

- **Implementation details:** See [CLAUDE.md](CLAUDE.md:41-84)
- **Quick start:** See [QUICK_START.md](QUICK_START.md:76-94)
- **Deployment:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md:32-44)

---

**Google Calendar Integration Complete ✅**

Your website will now automatically sync bookings with Google Calendar!
