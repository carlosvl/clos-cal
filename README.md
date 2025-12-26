# Google Workspace App

A Google Workspace application built with Google Apps Script and managed with Git.

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
   clasp create --title "My Google Workspace App" --type standalone
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

## Available Scripts

- `npm run push` - Push local code to Google Apps Script
- `npm run pull` - Pull code from Google Apps Script to local
- `npm run open` - Open the project in the Apps Script editor
- `npm run deploy` - Deploy the script as a web app
- `npm run logs` - View execution logs

## Project Structure

```
.
├── Code.gs              # Main Apps Script code
├── appsscript.json      # Apps Script manifest
├── .clasp.json          # Clasp configuration (git-ignored)
├── clasp.json.template  # Template for .clasp.json
├── package.json         # Node.js dependencies
└── README.md           # This file
```

## Development Workflow

1. Make changes to your local files (e.g., `Code.gs`)
2. Push changes to Apps Script: `npm run push`
3. Test in the Apps Script editor: `npm run open`
4. Commit your changes: `git add . && git commit -m "Your message"`

## OAuth Scopes

The app currently requests the following OAuth scopes:
- `https://www.googleapis.com/auth/calendar` - Calendar access
- `https://www.googleapis.com/auth/script.external_request` - External API requests

You can modify these in `appsscript.json` based on your app's needs.

## Additional Resources

- [Clasp Documentation](https://github.com/google/clasp)
- [Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Workspace APIs](https://developers.google.com/workspace)

