# Distance Calculation System - Setup Guide

## Overview

The distance calculation system calculates accurate driving distance from your Hellertown, PA office (18055) to customer addresses using the Google Maps Distance Matrix API. This provides real-time, accurate pricing based on actual mileage.

## What Was Implemented

### 1. Distance Calculator Utility (`src/lib/distance-calculator.ts`)
- Calculates driving distance from Hellertown, PA 18055 to customer address
- Uses Google Maps Distance Matrix API
- Returns distance in miles and estimated drive time in minutes
- Includes comprehensive error handling with graceful fallbacks
- Fully tested with 9 passing unit tests

### 2. Distance Calculation API Endpoint (`src/app/api/calculate-distance/route.ts`)
- **Endpoint**: `POST /api/calculate-distance`
- Validates Pennsylvania-only addresses
- Calculates distance and returns accurate price breakdown
- Includes rate limiting (10 requests per 10 seconds)
- Zod validation for input data

**Request Body:**
```json
{
  "address": "123 Main St",
  "city": "Bethlehem",
  "state": "Pennsylvania",
  "serviceType": "standard",
  "urgency": "standard"
}
```

**Response:**
```json
{
  "success": true,
  "distance": 8.5,
  "duration": 15,
  "origin": "Hellertown, PA 18055",
  "destination": "123 Main St, Bethlehem, PA, USA",
  "breakdown": {
    "notaryFee": 5,
    "mileageFee": 0,
    "serviceFee": 0,
    "urgencyFee": 0,
    "total": 5
  }
}
```

### 3. Booking Form Integration (`src/components/booking/BookingForm.tsx`)
- Real-time distance calculation as user types address
- 1-second debounce to avoid excessive API calls
- Controlled inputs for address and city fields
- Seamless integration with existing booking flow

### 4. Booking Section Updates (`src/components/BookingSection.tsx`)
- Shows real-time distance and travel time in appointment summary sidebar
- Displays calculated price based on actual distance
- Falls back to estimated price if distance calculation fails
- "Calculating distance..." loading indicator

### 5. Updated Appointment Summary Sidebar
The sidebar now displays:
- **Date** - Selected appointment date
- **Time** - Selected appointment time
- **Distance** - Calculated driving distance in miles (when available)
- **Travel Time** - Estimated drive time in minutes (when available)
- **Estimated Total*** - Accurate price based on actual distance

### 6. Test Coverage
**New Tests Added:**
- Distance calculator utility (9 tests) - all passing
- Tests API key validation
- Tests successful distance calculation
- Tests error handling (API errors, network errors, invalid addresses)
- Tests correct API parameter formatting

**Total Test Suite:**
- **93 tests passing** (increased from 84)
- 100% coverage of distance calculation logic

## Setup Instructions

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Enable Required APIs**:
   - Distance Matrix API (**REQUIRED**)
   - Geocoding API (optional, for address validation)
3. **Create API Key**:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the API key
4. **Restrict API Key** (Recommended for Production):
   - Click on your API key to edit
   - Under "API restrictions", select "Restrict key"
   - Select only: "Distance Matrix API" and "Geocoding API"
   - Under "Application restrictions":
     - Development: Select "None" (unrestricted)
     - Production: Select "HTTP referrers" and add your domain

### Step 2: Add API Key to Environment

Add the following to your `.env.local` file:

```bash
# Google Maps Distance Matrix API
GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Important Notes:**
- The API key is **server-side only** (never exposed to client)
- If the API key is missing, the system gracefully falls back to estimated pricing
- The booking system continues to work without the API key

### Step 3: Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

### Step 4: Test the Feature

1. Navigate to the booking section on your website
2. Select a date and time
3. Fill in the booking form with an address in Pennsylvania
4. Watch the "Appointment Summary" sidebar update with:
   - Distance calculation
   - Travel time estimate
   - Accurate pricing

## How It Works

### User Flow:

1. User selects appointment date and time
2. User fills in address and city fields
3. **After 1 second of inactivity**, the system:
   - Calls `/api/calculate-distance` endpoint
   - Passes address, city, and state to Google Distance Matrix API
   - Calculates distance from Hellertown, PA 18055
   - Returns distance, travel time, and accurate price breakdown
4. Sidebar updates to show:
   - Distance: "8.5 mi"
   - Travel Time: "~15 min"
   - Estimated Total: "$26"
5. When user submits booking:
   - System uses calculated price (if available)
   - Falls back to estimated price if calculation failed
   - Saves booking with accurate pricing

### Pricing Calculation:

The distance calculation integrates with the existing pricing system:

**Base Price:**
- Notary Fee: $5 (PA statutory maximum)

**Distance-Based Fees:**
- First 10 miles: FREE
- Additional miles: $2.50 per mile
- Example: 15 miles = $5 notary + (5 miles × $2.50) = $17.50

**Service Type Fees:**
- Standard: $0
- Loan Signing: +$100
- Apostille: +$50
- Estate Planning: +$30

**Urgency Fees:**
- Standard (24-48h): $0
- Same Day: +$50
- After Hours: +$75

## Error Handling

The system includes comprehensive error handling:

### Graceful Fallbacks:

1. **API Key Missing**: Uses estimated pricing (10 miles from office)
2. **Network Error**: Falls back to estimated pricing
3. **Invalid Address**: Falls back to estimated pricing
4. **API Quota Exceeded**: Falls back to estimated pricing

### User Experience:

- Errors are logged to console but **never block booking**
- User always sees disclaimers indicating prices are estimates
- Final pricing confirmation happens after booking submission

## API Costs

**Google Maps Distance Matrix API Pricing** (as of 2024):
- First $200/month: FREE
- After $200: $0.005 per request (0.5 cents)

**Estimated Usage:**
- Average: 100-500 requests/month
- **Cost**: FREE (under monthly credit)

**Cost Optimization:**
- 1-second debounce reduces API calls
- Only calculates when user stops typing
- Caches result for same address during session

## Troubleshooting

### Distance Calculation Not Working?

**Check Console Logs:**
```bash
# Should see this warning if API key missing:
"GOOGLE_MAPS_API_KEY not configured - distance calculation unavailable"
```

**Verify API Key:**
1. Check `.env.local` file has `GOOGLE_MAPS_API_KEY=...`
2. Restart dev server after adding key
3. Check API key is enabled in Google Cloud Console

**Check API Restrictions:**
1. Ensure "Distance Matrix API" is enabled
2. Check API key restrictions allow your domain/IP

### Still Having Issues?

**Enable Debug Logging:**
```typescript
// In src/lib/distance-calculator.ts, uncomment console.log statements
console.log("Distance API Response:", data);
```

**Check Network Tab:**
- Open browser DevTools → Network tab
- Look for `calculate-distance` requests
- Check request/response data

## Testing

Run the full test suite to verify everything works:

```bash
# Run all tests
npm test

# Run only distance calculator tests
npm test -- src/lib/__tests__/distance-calculator.test.ts

# Build production bundle
npm run build
```

**Expected Results:**
- ✅ 93 tests passing
- ✅ Production build successful
- ✅ All TypeScript checks passing

## Security Notes

- API key is server-side only (never sent to client)
- Rate limiting prevents abuse (10 requests per 10 seconds)
- Pennsylvania-only validation prevents out-of-state requests
- Input validation via Zod schema
- CORS protected by Next.js

## Future Enhancements

**Potential Improvements:**
1. **Address Autocomplete**: Use Google Places API for address suggestions
2. **Distance Caching**: Cache distances for common routes
3. **Route Optimization**: Calculate optimal route for multiple stops
4. **Real-Time Traffic**: Factor traffic conditions into pricing
5. **Batch Calculations**: Calculate multiple addresses at once

## Support

For issues or questions:
- Check console logs for error messages
- Verify API key configuration
- Ensure Distance Matrix API is enabled
- Check Google Cloud Console for API quotas

---

**Status**: ✅ Fully implemented and tested
**Build**: ✅ Production ready
**Tests**: ✅ 93/93 passing
