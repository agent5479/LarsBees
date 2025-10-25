# 📅 BeeMarshall Calendar Feed System

## Overview

The BeeMarshall calendar feed system provides automatic calendar synchronization for scheduled tasks. Users can subscribe to their task calendar using a server-based ICS feed URL that updates automatically when tasks are scheduled.

## Features

- **Automatic Updates**: Calendar updates automatically when tasks are scheduled
- **Multiple Calendar Apps**: Compatible with Google Calendar, Apple Calendar, Outlook, and more
- **Server-Based Feed**: Uses a server-based ICS feed URL for subscription
- **Multi-Tenant Support**: Each tenant gets their own calendar feed URL

## How It Works

### Current Implementation (Client-Side Generation)

The current system generates ICS files client-side using JavaScript:

1. **ICS Generation**: `generateICSCalendarFeed()` creates ICS content from scheduled tasks
2. **Data URL**: ICS content is converted to a data URL for sharing
3. **Download**: Users can download the ICS file to import into their calendar

### Future Server-Based Implementation

For a true server-based calendar feed, you need to implement a backend service that:

1. **Serves ICS Files**: Provides a URL endpoint like `/calendar/{tenantId}.ics`
2. **Dynamic Generation**: Generates ICS content from the Firebase database
3. **Automatic Updates**: Updates when tasks change in Firebase

## Usage

### For Users

1. **Navigate to Scheduled Tasks**: Click "Schedule" in the main navigation
2. **Click "Subscribe to Calendar"**: Find this button in the Scheduled Tasks view
3. **Copy the Feed URL**: The modal will show your personal calendar feed URL
4. **Subscribe in Calendar App**: Follow the instructions for your calendar app

#### Google Calendar
1. Go to [Google Calendar](https://calendar.google.com)
2. Click the **"+"** next to "Other calendars"
3. Select **"From URL"**
4. Paste your feed URL and click **"Add calendar"**

#### Apple Calendar (macOS/iOS)
1. Open the **Calendar** app
2. Go to **File → New Calendar Subscription**
3. Paste your feed URL
4. Configure refresh interval (e.g., "Every 5 minutes")
5. Click **"OK"**

#### Outlook
1. Open Outlook and go to **Calendar**
2. Click **"Add calendar" → "Subscribe from web"**
3. Paste your feed URL
4. Give it a name and select a calendar color
5. Click **"Import"**

### For Developers

#### ICS Feed URL Format

```javascript
const feedUrl = `${baseUrl}/calendar/${tenantId}.ics`;
// Example: https://yourdomain.com/calendar/lars.ics
```

#### Generating ICS Content

```javascript
const icsContent = generateICSCalendarFeed();
// Returns: ICS file content as string
```

#### Calendar Feed Functions

- `generateServerCalendarFeed(tenantId)` - Generates the feed URL
- `copyServerCalendarFeedLink()` - Copies feed URL to clipboard
- `generateICSCalendarFeed()` - Generates ICS content from scheduled tasks
- `showCalendarSubscriptionInstructions()` - Shows subscription modal

## Implementation Options

### Option 1: GitHub Pages + Firebase Functions (Recommended)

Use Firebase Cloud Functions to serve ICS files:

1. **Create Firebase Function**: Deploy a function that reads from Firebase and serves ICS
2. **Function Endpoint**: `https://us-central1-beemarshall-a311e.cloudfunctions.net/calendarFeed/{tenantId}`
3. **Update Feed URL**: Point to the Firebase function URL

**Advantages:**
- ✅ Automatic updates when tasks change
- ✅ No server maintenance
- ✅ Scales automatically
- ✅ Free tier available

### Option 2: GitHub Pages + External Service

Use a third-party service like Zapier or IFTTT:

1. **Set up webhook**: Trigger when tasks change in Firebase
2. **Generate ICS**: Service generates and hosts the ICS file
3. **Share URL**: Users subscribe to the hosted ICS file

**Advantages:**
- ✅ Easy to set up
- ✅ No backend code needed
- ✅ Automatic updates

**Disadvantages:**
- ⚠️ Requires paid service for automatic updates
- ⚠️ Less control over the feed

### Option 3: Static ICS Files (Current)

Generate ICS files client-side and download:

1. **Generate ICS**: JavaScript generates ICS content in the browser
2. **Download**: User downloads the ICS file
3. **Manual Import**: User manually imports the file to their calendar

**Advantages:**
- ✅ No backend needed
- ✅ Works offline
- ✅ No server costs

**Disadvantages:**
- ⚠️ No automatic updates
- ⚠️ User must re-download when tasks change
- ⚠️ Not a true "calendar feed"

## Current Status

**Implementation**: Client-side ICS generation with data URL

**Limitations**:
- ICS files are not stored on a server
- Users must manually re-download when tasks change
- No automatic calendar synchronization

## Next Steps

### For Automatic Calendar Sync

1. **Deploy Firebase Cloud Function**:
   ```javascript
   // functions/index.js
   exports.calendarFeed = functions.https.onRequest((req, res) => {
     const tenantId = req.params.tenantId;
     // Read from Firebase
     // Generate ICS
     // Return ICS content
   });
   ```

2. **Update Feed URL**:
   ```javascript
   const feedUrl = `https://us-central1-beemarshall-a311e.cloudfunctions.net/calendarFeed/${tenantId}`;
   ```

3. **Test Subscription**:
   - Subscribe in Google Calendar
   - Schedule a new task
   - Verify calendar updates automatically

## Files

- `docs/js/calendar-feed.js` - Calendar feed system
- `docs/beemarshall-full.html` - Main application with calendar buttons

## Support

For issues or questions about the calendar feed system, please refer to the main BeeMarshall documentation or open an issue in the GitHub repository.
