# YouTube Channel Details Updater

This Google Apps Script is designed to retrieve and update YouTube channel details for a list of channel names stored in a Google Sheet. The script fetches various details such as subscriber count, view count, latest video information, and more, and updates the sheet accordingly. Each time you run the script, it processes the next 100 channels in the list.

## Features

- **Batch Processing:** Process 100 channels at a time, starting from where you last left off.
- **API Integration:** Uses the YouTube Data API to fetch channel details.
- **Error Handling:** Graceful handling of API quota errors and other exceptions, with logging for troubleshooting.

## Setup

### Prerequisites

- A Google account with access to Google Sheets.
- A YouTube Data API key. You can obtain one from the [Google Cloud Console](https://console.cloud.google.com/).

### Installation

1. **Create a New Google Sheet:**
   - Open Google Sheets and create a new spreadsheet.
   - In column `A`, starting from row `3` (i.e., `A3`), list the YouTube channel names you want to fetch details for.

2. **Add the Script:**
   - In the Google Sheets menu, go to `Extensions > Apps Script`.
   - Delete any code in the script editor and paste the following functions:

```javascript
function getYouTubeChannelDetails(channelName) {
  var apiKey = 'YOUR_API_KEY_HERE';
  var baseUrl = 'https://www.googleapis.com/youtube/v3';
  
  var channelSearchUrl = `${baseUrl}/search?part=snippet&type=channel&q=${encodeURIComponent(channelName)}&key=${apiKey}`;
  var channelSearchResponse = UrlFetchApp.fetch(channelSearchUrl);
  var channelSearchResult = JSON.parse(channelSearchResponse.getContentText());
  var channelId = channelSearchResult.items[0].snippet.channelId;

  var channelDetailUrl = `${baseUrl}/channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${apiKey}`;
  var channelDetailResponse = UrlFetchApp.fetch(channelDetailUrl);
  var channelDetailResult = JSON.parse(channelDetailResponse.getContentText());
  
  var channelHandle = channelDetailResult.items[0].snippet.customUrl;
  var subscriberCount = channelDetailResult.items[0].statistics.subscriberCount;
  var viewCount = channelDetailResult.items[0].statistics.viewCount;
  var videoCount = channelDetailResult.items[0].statistics.videoCount;
  var country = channelDetailResult.items[0].snippet.country || "N/A";
  
  var uploadsPlaylistId = channelDetailResult.items[0].contentDetails.relatedPlaylists.uploads;
  var playlistItemsUrl = `${baseUrl}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1&key=${apiKey}`;
  var playlistItemsResponse = UrlFetchApp.fetch(playlistItemsUrl);
  var playlistItemsResult = JSON.parse(playlistItemsResponse.getContentText());
  
  var videoTitle = playlistItemsResult.items[0].snippet.title;
  var videoDescription = playlistItemsResult.items[0].snippet.description.toLowerCase();

  var margex = videoDescription.includes("margex".toLowerCase()) ? "X" : "";
  var coinw = videoDescription.includes("coinw".toLowerCase()) ? "X" : "";
  var zoomex = videoDescription.includes("zoomex".toLowerCase()) ? "X" : "";
  var bitget = videoDescription.includes("bitget".toLowerCase()) ? "X" : "";
  var bybit = videoDescription.includes("bybit".toLowerCase()) ? "X" : "";
  var bydFi = videoDescription.includes("bydfi".toLowerCase()) ? "X" : "";

  return [[channelHandle, subscriberCount, viewCount, videoCount, country, videoTitle, margex, coinw, zoomex, bitget, bybit, bydFi]];
}

function updateYouTubeChannelDetails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var startRowValue = sheet.getRange('Z1').getValue();
  var startRow = (typeof startRowValue === 'number' && startRowValue > 0) ? startRowValue : 3;
  var batchSize = 100;
  var endRow = Math.min(startRow + batchSize - 1, 999);
  var channelRange = sheet.getRange('A' + startRow + ':A' + endRow);
  var channelNames = channelRange.getValues();

  try {
    for (var i = 0; i < channelNames.length; i++) {
      var channelName = channelNames[i][0];
      if (channelName) {
        var details = getYouTubeChannelDetails(channelName);
        sheet.getRange(startRow + i, 2, 1, details[0].length).setValues(details);
      }
    }
    sheet.getRange('Z1').setValue(endRow + 1);
  } catch (e) {
    Logger.log('Error: ' + e.toString());
    sheet.getRange('Z1').setValue('Error');
  }
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('YouTube Channel')
      .addItem('Update', 'updateYouTubeChannelDetails')
      .addToUi();
}
