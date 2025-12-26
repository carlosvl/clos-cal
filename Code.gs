/**
 * Main entry point for the Google Workspace App
 */

/**
 * Runs when the app is opened or installed
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Custom Menu')
    .addItem('Run Function', 'main')
    .addToUi();
}

/**
 * Main function
 */
function main() {
  Logger.log('App is running!');
  
  try {
    // Add your app logic here
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.getRange(1, 1).setValue('Hello, Google Workspace!');
    
    SpreadsheetApp.getUi().alert('App executed successfully!');
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error: ' + error.toString());
  }
}

