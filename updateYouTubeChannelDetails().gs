function updateYouTubeChannelDetails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var startRow = sheet.getRange('Z1').getValue() || 3; // Get last processed row, default 3
  var batchSize = 100; // Process 100 rows each time
  var endRow = Math.min(startRow + batchSize - 1, 2000); // calculate end row, limit to 2000
  var channelRange = sheet.getRange('A' + startRow + ':A' + endRow);
  var channelNames = channelRange.getValues();

  for (var i = 0; i < channelNames.length; i++) {
    var channelName = channelNames[i][0];
    if (channelName) { // Check if channelname is empty
      var details = getYouTubeChannelDetails(channelName);
      sheet.getRange(startRow + i, 2, 1, details[0].length).setValues(details);
      // return result to respective row, start from col B
    }
  }

  // update last processed row to Z1
  sheet.getRange('Z1').setValue(endRow + 1);
}

