# Google Sheets Integration Setup Guide

Your dashboard now automatically fetches data from Google Sheets! Follow these steps to complete the setup.

## Current Status

✅ **Fallback Working**: Dashboard currently uses static JSON files (fallback mode)
⏳ **Google Sheets**: Needs API key to fetch live data from your Google Sheet

## Quick Setup (5 minutes)

### Step 1: Get a Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key (looks like: `AIzaSyD...`)
5. (Optional) Restrict the API key:
   - Click on your new API key
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Sheets API" only
   - Under "Application restrictions", you can restrict by HTTP referrer for production

### Step 2: Add API Key to Your Project

1. Open `.env.local` in your project root
2. Add your API key:
   ```env
   GOOGLE_API_KEY=AIzaSyD...your_actual_key_here
   ```
3. Your `.env.local` should now look like:
   ```env
   GOOGLE_SHEET_ID=1JWMb-udkmtbgPWJM43O76_Hl6P_JlMxV0GT1qbaKP24
   GOOGLE_API_KEY=AIzaSyD...your_actual_key_here
   BENCHMARK_SHEET_NAME=raw_results
   STATIC_METRICS_SHEET_NAME=static_metrics
   ```

### Step 3: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## How to Verify It's Working

### Check Browser Console
Open your dashboard in the browser and check the console:

**✅ Success (Google Sheets):**
```
Benchmark data source: google-sheets
Static metrics source: google-sheets
```

**⚠️ Fallback (Using JSON):**
```
Benchmark data source: fallback-json
⚠️ Using fallback benchmark data: Using cached data due to Google Sheets API error
```

### Check Server Logs
Look at your terminal where `npm run dev` is running:

**✅ Success:**
```
Successfully fetched 56637 records from Google Sheets
Successfully fetched 512 records from Google Sheets
```

**⚠️ Fallback:**
```
Google Sheets fetch failed, falling back to local JSON
Successfully loaded 56637 records from fallback JSON
```

## How It Works

### Data Flow

```
Dashboard loads
    ↓
Try: Fetch from Google Sheets (with API key)
    ↓
Success? → Display live data from sheets ✅
    ↓
Failed? → Display static JSON data (fallback) 🔄
    ↓
Dashboard always works!
```

### Updating Data

**With Google Sheets (Recommended):**
1. Edit your Google Sheet: [Your Sheet](https://docs.google.com/spreadsheets/d/1JWMb-udkmtbgPWJM43O76_Hl6P_JlMxV0GT1qbaKP24/edit)
2. Save changes
3. Refresh your dashboard
4. New data appears automatically! ✨

**Without API Key (Fallback):**
1. Export Google Sheet to Excel
2. Convert sheets to JSON files
3. Replace `public/benchmark_data.json` and `public/static_metrics.json`
4. Dashboard uses updated static files

## Troubleshooting

### Issue: Still seeing "fallback-json" after adding API key

**Solution:**
1. Make sure API key is in `.env.local` (not `.env.example`)
2. Restart the dev server completely
3. Check that Google Sheets API is enabled in your Google Cloud project
4. Verify your API key has no restrictions preventing Sheets API access

### Issue: "403 Forbidden" error

**Causes:**
- API key not set or invalid
- Google Sheets API not enabled
- API key restricted and doesn't allow Sheets API
- Rate limit exceeded

**Solution:**
1. Double-check your API key is correct
2. Verify Google Sheets API is enabled
3. Check API key restrictions in Google Cloud Console

### Issue: Dashboard shows no data

**This should never happen!** The fallback mechanism ensures you always have data.

**If it does happen:**
1. Check that `public/benchmark_data.json` exists
2. Check that `public/static_metrics.json` exists
3. Check browser console for errors
4. Check server logs for errors

## Production Deployment

### Environment Variables

When deploying to production (Vercel, Netlify, etc.), set these environment variables:

```
GOOGLE_SHEET_ID=1JWMb-udkmtbgPWJM43O76_Hl6P_JlMxV0GT1qbaKP24
GOOGLE_API_KEY=your_api_key_here
BENCHMARK_SHEET_NAME=raw_results
STATIC_METRICS_SHEET_NAME=static_metrics
```

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Settings > Environment Variables
3. Add each variable above
4. Redeploy your project

### Keep JSON Files

**Important:** Do NOT delete the JSON files from `public/` folder:
- `benchmark_data.json` - Fallback for performance data
- `static_metrics.json` - Fallback for variation data

These files ensure your dashboard works even if:
- Google Sheets API is down
- API rate limits are hit
- Network issues occur
- API key expires

## API Rate Limits

**Google Sheets API Free Tier:**
- 300 requests per minute per project
- 60 requests per minute per user

**Your Dashboard:**
- Makes 2 API calls per page load (benchmark data + static metrics)
- Should be well within limits for normal usage

**If you hit rate limits:**
- Dashboard automatically falls back to JSON files
- Consider implementing caching (optional enhancement)

## Optional: Add Caching

To reduce API calls, you can add caching to your API routes. This is optional but recommended for production.

See the API route files for implementation examples:
- `app/api/benchmark-data/route.ts`
- `app/api/static-metrics/route.ts`

## Security Notes

### API Key Security

✅ **Safe:**
- API key is stored in `.env.local` (git ignored)
- API key is used server-side only (Next.js API routes)
- Not exposed to browser/client

⚠️ **Important:**
- Never commit `.env.local` to git
- Restrict API key to Google Sheets API only
- Consider IP/domain restrictions for production

### Google Sheet Security

Your sheet is public (view-only):
- ✅ Anyone can view (needed for your use case)
- ❌ Nobody can edit (except you)
- API key required to access via API

## Need Help?

Common issues and solutions:
1. **Not fetching from sheets**: Check API key and restart server
2. **Dashboard broken**: Check that JSON fallback files exist
3. **403 errors**: Enable Google Sheets API in Cloud Console
4. **Rate limits**: Dashboard automatically falls back to JSON

---

## Summary

🎉 **What You Get:**
- Automatic data updates from Google Sheets
- Zero manual JSON conversion
- Bulletproof fallback to static files
- Same great dashboard experience

📝 **Next Steps:**
1. Get Google API key (5 minutes)
2. Add to `.env.local`
3. Restart dev server
4. Verify it's working in console
5. Update your Google Sheet and see changes live!
