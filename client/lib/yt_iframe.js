
Template.favourites.rendered = function(){

    // Load async the iFrame API script
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // When Ready set initial vars and initiate player
    window.onYouTubeIframeAPIReady = function(){
        console.log('Youtube API Loaded...');
        Session.set('video-playing', false);
        initiateYTPlayer();
    };

    window.initiateYTPlayer = function(){
        // Relatively watch for change in the video url
        Tracker.autorun(function(){
            if(Session.get('video-playing') === true){
                // First 'Play' click initiate the player
                var ytPlayer = new YT.Player('ytPlayer', {
                    videoId: Session.get('currently-playing'),
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange
                    }
                });

                // When ready play the video
                function onPlayerReady(event) {
                    event.target.playVideo();
                }

                // When state changed
                function onPlayerStateChange(event) {
                    // Handles only the ENDED state
                    if(event.data == YT.PlayerState.ENDED){
                        // Cache some vars
                        // Implement 'nextVideo()' so the following code block can be reusable
                        var mediaPlayer = $('#player'),
                            detailsBlock = mediaPlayer.find('.video-details'),
                            videoIndex = favouriteVideos.indexOf(Session.get('currently-playing')),
                            nextVideoIndex = videoIndex + 1;

                        if(nextVideoIndex >= favouriteVideos.length - 1 || nextVideoIndex === -1){
                            nextVideoIndex = 0;
                        }
                        var nextVideoID = favouriteVideos[nextVideoIndex],
                            nextVideoContainer = $('*[data-videoid="'+ nextVideoID +'"]'),
                            nextVideoTitle = nextVideoContainer.find('.title-link').clone().detach(),
                            nextVideoDescription = nextVideoContainer.find('.description').clone().detach();

                        // Insert the next video details
                        detailsBlock.empty().append(
                            nextVideoTitle,
                            nextVideoDescription
                        );

                        // Update the session variable and the video src
                        Session.set('currently-playing', nextVideoID);
                        $('#ytPlayer').attr('src', 'https://www.youtube.com/embed/'+ nextVideoID +'?enablejsapi=1&origin=http%3A%2F%2Flocalhost%3A3000');
                    }
                }

                // Stop video control
                function stopVideo() {
                    ytPlayer.stopVideo();
                }

                // Show the iFrame
                $('#ytPlayer').addClass('opened');
            }
        });
    };
};
