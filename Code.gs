/**
 * Main entry point for the Google Workspace Calendar Web App
 */

/**
 * Serves the HTML page when the web app is accessed
 * @param {Object} e - Event object containing query parameters
 * @return {HtmlOutput} The HTML page to display
 */
function doGet(e) {
  const page = e.parameter.page || 'home';
  let htmlFile;
  
  switch(page) {
    case 'calendar':
      htmlFile = 'calendar';
      break;
    case 'pictures':
      htmlFile = 'pictures';
      break;
    case 'settings':
      htmlFile = 'settings';
      break;
    case 'home':
    default:
      htmlFile = 'home';
      break;
  }
  
  return HtmlService.createHtmlOutputFromFile(htmlFile)
    .setTitle('Google Calendar Viewer')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Gets the list of calendars accessible by the user
 * @return {Array<Object>} Array of calendar objects with id and name
 */
function getCalendars() {
  try {
    const calendars = CalendarApp.getAllCalendars();
    return calendars.map(calendar => ({
      id: calendar.getId(),
      name: calendar.getName()
    }));
  } catch (error) {
    Logger.log('Error getting calendars: ' + error.toString());
    throw new Error('Failed to fetch calendars: ' + error.toString());
  }
}

/**
 * Saves the selected calendar IDs to user properties
 * @param {Array<string>} calendarIds - Array of calendar IDs to save
 * @return {Object} Success status
 */
function saveCalendarPreferences(calendarIds) {
  try {
    // Validate input
    if (!calendarIds || !Array.isArray(calendarIds)) {
      Logger.log('Invalid calendarIds parameter:', calendarIds);
      throw new Error('calendarIds must be an array');
    }
    
    Logger.log('Saving calendar preferences. Count: ' + calendarIds.length);
    Logger.log('Calendar IDs to save: ' + JSON.stringify(calendarIds));
    
    var userProperties = PropertiesService.getUserProperties();
    var jsonData = JSON.stringify(calendarIds);
    
    // Check size (UserProperties has 9KB limit per property)
    if (jsonData.length > 9000) {
      Logger.log('Warning: Calendar preferences data size: ' + jsonData.length + ' bytes');
    }
    
    userProperties.setProperty('selectedCalendarIds', jsonData);
    
    // Verify it was saved by reading it back
    var saved = userProperties.getProperty('selectedCalendarIds');
    if (saved === jsonData) {
      Logger.log('Calendar preferences saved and verified successfully');
      return { success: true, count: calendarIds.length };
    } else {
      Logger.log('Warning: Saved data does not match original data');
      return { success: true, count: calendarIds.length };
    }
  } catch (error) {
    Logger.log('Error saving calendar preferences: ' + error.toString());
    throw new Error('Failed to save calendar preferences: ' + error.toString());
  }
}

/**
 * Loads the saved calendar IDs from user properties
 * @return {Array<string>} Array of calendar IDs, or default calendar if none saved
 */
function loadCalendarPreferences() {
  try {
    var userProperties = PropertiesService.getUserProperties();
    var savedIds = userProperties.getProperty('selectedCalendarIds');
    
    if (savedIds) {
      var parsedIds = JSON.parse(savedIds);
      Logger.log('Loaded calendar preferences. Count: ' + parsedIds.length);
      Logger.log('Loaded calendar IDs: ' + JSON.stringify(parsedIds));
      
      // Validate it's an array
      if (Array.isArray(parsedIds)) {
        return parsedIds;
      } else {
        Logger.log('Warning: Saved preferences is not an array, using default');
      }
    } else {
      Logger.log('No saved calendar preferences found, using default calendar');
    }
    
    // If no preferences saved or invalid data, return default calendar ID
    var defaultCalendarId = CalendarApp.getDefaultCalendar().getId();
    Logger.log('Using default calendar: ' + defaultCalendarId);
    return [defaultCalendarId];
  } catch (error) {
    Logger.log('Error loading calendar preferences: ' + error.toString());
    // Return default calendar if error occurs
    try {
      var defaultCalendarId = CalendarApp.getDefaultCalendar().getId();
      Logger.log('Error occurred, using default calendar: ' + defaultCalendarId);
      return [defaultCalendarId];
    } catch (defaultError) {
      Logger.log('Error getting default calendar: ' + defaultError.toString());
      return [];
    }
  }
}

/**
 * Gets calendar events for the specified calendars within the date range
 * @param {Array<string>} calendarIds - Array of calendar IDs to fetch events from
 * @param {string} startDate - Start date in ISO format (YYYY-MM-DD)
 * @param {string} endDate - End date in ISO format (YYYY-MM-DD)
 * @return {Array<Object>} Array of event objects formatted for FullCalendar
 */
function getCalendarEvents(calendarIds, startDate, endDate) {
  try {
    const events = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Fetch events from each selected calendar
    calendarIds.forEach(calendarId => {
      try {
        const calendar = CalendarApp.getCalendarById(calendarId);
        const calendarEvents = calendar.getEvents(start, end);
        
        calendarEvents.forEach(event => {
          events.push({
            id: event.getId(),
            title: event.getTitle(),
            start: event.getStartTime().toISOString(),
            end: event.getEndTime().toISOString(),
            allDay: event.isAllDayEvent(),
            calendarId: calendarId,
            calendarName: calendar.getName(),
            location: event.getLocation() || '',
            description: event.getDescription() || ''
          });
        });
      } catch (calendarError) {
        Logger.log('Error fetching events from calendar ' + calendarId + ': ' + calendarError.toString());
        // Continue with other calendars even if one fails
      }
    });
    
    return events;
  } catch (error) {
    Logger.log('Error getting calendar events: ' + error.toString());
    throw new Error('Failed to fetch calendar events: ' + error.toString());
  }
}

