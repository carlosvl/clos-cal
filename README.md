# Google Calendar Viewer

A Google Workspace web application that allows users to authenticate with their Google account and view their calendar events using FullCalendar. The app features a modern navigation menu, persistent calendar preferences, and a clean multi-page interface. Built with Google Apps Script and managed with Git.

## Prerequisites

- Node.js (v12 or higher)
- npm or yarn
- Google account with access to Google Apps Script

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install clasp globally (optional but recommended):**
   ```bash
   npm install -g @google/clasp
   ```

3. **Login to clasp:**
   ```bash
   clasp login
   ```

4. **Create a new Apps Script project or link to an existing one:**
   
   For a new project:
   ```bash
   clasp create --title "Google Calendar Viewer" --type standalone
   ```
   
   This will create a `.clasp.json` file with your script ID.

   For an existing project:
   - Copy `.clasp.json.template` to `.clasp.json`
   - Replace `YOUR_SCRIPT_ID_HERE` with your Apps Script project ID
   - You can find the script ID in the Apps Script editor URL: 
     `https://script.google.com/home/projects/YOUR_SCRIPT_ID/edit`

5. **Push your code to Apps Script:**
   ```bash
   npm run push
   # or
   clasp push
   ```

6. **Deploy as a Web App:**
   - Open the project in the Apps Script editor: `npm run open` or visit `https://script.google.com`
   - Click "Deploy" → "New deployment"
   - Click the gear icon ⚙️ next to "Select type" and choose "Web app"
   - Set the following:
     - Description: "Google Calendar Viewer"
     - Execute as: "Me" (your account)
     - Who has access: "Only myself" (or change as needed)
   - Click "Deploy"
   - Copy the Web app URL and use it to access your calendar viewer
   - **Important:** When you make changes and push new code, you'll need to create a new deployment version or update the existing one

## Available Scripts

- `npm run push` - Push local code to Google Apps Script
- `npm run pull` - Pull code from Google Apps Script to local
- `npm run open` - Open the project in the Apps Script editor
- `npm run deploy` - Deploy the script as a web app
- `npm run logs` - View execution logs

## Project Structure

```
.
├── Code.gs              # Server-side Apps Script code (doGet, calendar functions, preferences)
├── home.html            # Home/landing page with navigation menu
├── calendar.html        # Calendar page with FullCalendar integration
├── pictures.html        # Pictures page (placeholder)
├── settings.html        # Settings page for calendar selection
├── appsscript.json      # Apps Script manifest with OAuth scopes
├── .clasp.json          # Clasp configuration (git-ignored)
├── clasp.json.template  # Template for .clasp.json
├── package.json         # Node.js dependencies
└── README.md           # This file
```

## Features

- **Google Authentication:** Automatically authenticates users via Google Apps Script OAuth
- **Navigation Menu:** Slide-in menu overlay for easy navigation between pages
- **Multi-page Interface:**
  - **Home:** Landing page with welcome message
  - **Calendar:** Full-featured calendar viewer with FullCalendar
  - **Pictures:** Placeholder page (coming soon)
  - **Settings:** Calendar selection and preferences management
- **Persistent Settings:** Calendar preferences are saved using `PropertiesService.getUserProperties()`
  - Preferences persist across browser sessions
  - Settings sync across all devices (same Google account)
  - No database required - fully managed by Google Apps Script
- **FullCalendar Integration:** Beautiful calendar interface with multiple view options:
  - Month view
  - Week view (default)
  - Day view
  - List/Agenda view
- **Real-time Updates:** Calendar events are fetched dynamically as users navigate dates
- **Color-coded Events:** Different calendars are displayed with distinct colors

## Usage

1. Deploy the web app following step 6 in the Setup section
2. Access the web app URL
3. Authorize the app to access your Google Calendar (first time only)
4. Use the hamburger menu (☰) in the top right to navigate between pages:
   - **Calendar:** View your calendar events
   - **Settings:** Select which calendars to display
   - **Pictures:** Placeholder page
5. In Settings, select which calendars you want to view and click "Save"
6. Your preferences are saved and will persist across sessions and devices
7. Navigate to Calendar page to view events in week, month, day, or list view

## Development Workflow

1. Make changes to your local files (e.g., `Code.gs`, `home.html`, `calendar.html`, `settings.html`)
2. Push changes to Apps Script: `npm run push`
3. **Update deployment:** After pushing code changes, update your deployment:
   - Open the Apps Script editor: `npm run open`
   - Go to "Deploy" → "Manage deployments"
   - Click the pencil icon (edit) next to your deployment
   - Select "New version" under Version
   - Click "Deploy"
4. Test the web app at your deployment URL
5. Commit your changes: `git add . && git commit -m "Your message"`

## OAuth Scopes

The app currently requests the following OAuth scope:
- `https://www.googleapis.com/auth/calendar.readonly` - Read-only access to user's calendars

To allow users to edit events, change the scope in `appsscript.json` to:
- `https://www.googleapis.com/auth/calendar` - Full calendar access (read and write)

## Architecture

The app uses Google Apps Script's HTML Service to serve a multi-page client-side web interface:

- **Server-side (`Code.gs`):**
  - `doGet(e)`: Routes requests to appropriate HTML pages based on query parameters
  - `getCalendars()`: Fetches list of user's calendars
  - `loadCalendarPreferences()`: Loads saved calendar preferences from PropertiesService
  - `saveCalendarPreferences()`: Saves calendar preferences to PropertiesService (cloud storage)
  - `getCalendarEvents()`: Fetches events from selected calendars

- **Client-side Pages:**
  - `home.html`: Landing page with navigation menu
  - `calendar.html`: FullCalendar interface for viewing events
  - `settings.html`: Calendar selection and preferences management
  - `pictures.html`: Placeholder page for future features

- **Navigation:** Query parameter-based routing (`?page=calendar`, `?page=settings`, etc.)

- **Data Persistence:** Uses `PropertiesService.getUserProperties()` for cross-device, cross-session storage
  - Each user's preferences are stored in Google's cloud
  - Data is tied to the user's Google account
  - Works across all devices and browsers where the user is logged in

- **Communication:** Uses `google.script.run` for client-server communication

## Troubleshooting

- **Authorization Required:** If you see authorization errors, make sure you've authorized the script to access your calendar. Run the script once in the editor to trigger the OAuth flow.
- **Events Not Showing:** 
  - Make sure you've selected calendars in the Settings page and clicked "Save"
  - Check that the selected calendars have events in the current date range
  - Verify your calendar preferences are saved (check browser console for debug logs)
- **Settings Not Persisting:**
  - Settings are stored using `PropertiesService.getUserProperties()` which works across devices
  - Each user's preferences are saved per Google account
  - Check browser console for any errors when saving preferences
- **Navigation Not Working:**
  - Make sure you've updated your deployment after pushing code changes
  - Check that the URL includes the `?page=` parameter when navigating
- **Deployment Issues:** When updating code, remember to create a new deployment version or update the existing deployment for changes to take effect.

## Additional Resources

- [FullCalendar Documentation](https://fullcalendar.io/docs)
- [Clasp Documentation](https://github.com/google/clasp)
- [Apps Script HTML Service](https://developers.google.com/apps-script/guides/html)
- [Apps Script CalendarApp](https://developers.google.com/apps-script/reference/calendar/calendar-app)
- [Google Workspace APIs](https://developers.google.com/workspace)

