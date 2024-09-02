function getYouTubeChannelDetails(channelName) {
  var apiKey = 'AIzaSyDA6u57zYGuqvoqK6VQ_m8inLVT4tSYVso';
  var baseUrl = 'https://www.googleapis.com/youtube/v3';
  
  // Get channel ID and other details based on the channel name
  var channelSearchUrl = `${baseUrl}/search?part=snippet&type=channel&q=${encodeURIComponent(channelName)}&key=${apiKey}`;
  var channelSearchResponse = UrlFetchApp.fetch(channelSearchUrl);
  var channelSearchResult = JSON.parse(channelSearchResponse.getContentText());
  var channelId = channelSearchResult.items[0].snippet.channelId;

  // Get channel handle, subscriber count, view count, video count, country, and latest video in a single request
  var channelDetailUrl = `${baseUrl}/channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${apiKey}`;
  var channelDetailResponse = UrlFetchApp.fetch(channelDetailUrl);
  var channelDetailResult = JSON.parse(channelDetailResponse.getContentText());
  
  var channelHandle = channelDetailResult.items[0].snippet.customUrl;
  var subscriberCount = channelDetailResult.items[0].statistics.subscriberCount;
  var viewCount = channelDetailResult.items[0].statistics.viewCount;
  var videoCount = channelDetailResult.items[0].statistics.videoCount;
  var country = channelDetailResult.items[0].snippet.country || "N/A";
  
  // Get the upload playlist ID to retrieve the latest video
  var uploadsPlaylistId = channelDetailResult.items[0].contentDetails.relatedPlaylists.uploads;
  var playlistItemsUrl = `${baseUrl}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1&key=${apiKey}`;
  var playlistItemsResponse = UrlFetchApp.fetch(playlistItemsUrl);
  var playlistItemsResult = JSON.parse(playlistItemsResponse.getContentText());
  
  var videoTitle = playlistItemsResult.items[0].snippet.title;
  var videoDescription = playlistItemsResult.items[0].snippet.description.toLowerCase(); // 转换为小写

  // Extract emails and social media links using regex
  var emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  var twitterRegex = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)/g;
  var instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9_.]+)/g;
  var facebookRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([A-Za-z0-9_.]+)/g;
  var tiktokRegex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/(@[A-Za-z0-9_.]+)/g;
  var discordRegex = /(?:https?:\/\/)?(?:www\.)?discord\.gg\/([A-Za-z0-9_.]+)/g;

  var email = (videoDescription.match(emailRegex) || []).join(', ');
  var twitter = (videoDescription.match(twitterRegex) || []).join(', ');
  var instagram = (videoDescription.match(instagramRegex) || []).join(', ');
  var facebook = (videoDescription.match(facebookRegex) || []).join(', ');
  var tiktok = (videoDescription.match(tiktokRegex) || []).join(', ');
  var discord = (videoDescription.match(discordRegex) || []).join(', ');

  // Check for keywords in the latest video description (case-insensitive)
  var margex = videoDescription.includes("margex".toLowerCase()) ? "X" : "";
  var coinw = videoDescription.includes("coinw".toLowerCase()) ? "X" : "";
  var zoomex = videoDescription.includes("zoomex".toLowerCase()) ? "X" : "";
  var bitget = videoDescription.includes("bitget".toLowerCase()) ? "X" : "";
  var bybit = videoDescription.includes("bybit".toLowerCase()) ? "X" : "";
  var bydFi = videoDescription.includes("bydfi".toLowerCase()) ? "X" : "";

  // Return the results as a single row array
  return [[channelHandle, subscriberCount, viewCount, videoCount, country, videoTitle, email, twitter, instagram, facebook, tiktok, discord, margex, coinw, zoomex, bitget, bybit, bydFi]];
}
