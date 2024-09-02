function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('YouTube Channel')
      .addItem('Update 100', 'updateYouTubeChannelDetails')
      .addToUi();
}
