// Loads the IFrame Player API code asynchronously
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Creates an <iframe> and YouTube player after the API code downloads
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '_OBlgSz8sSM',
    events: {
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}

var ids = [];
var current = 0;

function onPlayerStateChange(event) {
  if (event.data === 0) {
    player.loadVideoById(ids[current]);
    current++;
  }
}

function onPlayerError(event) {
  player.loadVideoById(ids[current]);
  current++;
}

$(function() {
  $("#player").addClass("center");

  $("form#search").submit(function() {
    var entry = $("input#keywords").val();
    var keywords = $(this).serialize();
    ids = [];
    current = 0;

    $("span.history").prepend("<span value='" + keywords + "' class='past-search'>" + entry + "</span>");

    $.get("https://www.googleapis.com/youtube/v3/search?part=snippet&" + keywords + "&type=video&maxResults=50&key=AIzaSyCRqB5SXxKkA8RX-fjaj4anj3nfzGN84KY")
    .done(function(responseBody) {
      responseBody.items.forEach(function(video) {
        ids.push(video.id.videoId);
      });
      player.loadVideoById(ids[current])
      current++;
    });

    $("span.past-search").click(function() {
      var pastSearch = $(this).attr("value");
      $("input#keywords").val(pastSearch.slice(2));
      ids = [];
      current = 0;

      $.get("https://www.googleapis.com/youtube/v3/search?part=snippet&" + pastSearch + "&type=video&maxResults=50&key=AIzaSyCRqB5SXxKkA8RX-fjaj4anj3nfzGN84KY")
      .done(function(responseBody) {
        responseBody.items.forEach(function(video) {
          ids.push(video.id.videoId);
        });
        player.loadVideoById(ids[current])
        current++;
      });
      return false;
    });
    return false;
  });

  $("button#skip").click(function() {
    player.loadVideoById(ids[current]);
    current++;
    return false;
  });
  return false;
});
