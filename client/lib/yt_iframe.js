// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function(){
    console.log('Youtube API Loaded...');
};


window.initiateYTPlayer = function(){

    Tracker.autorun(function(){

        ytPlayer = new YT.Player('ytPlayer', {
            videoId: Session.get('videoId'),
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
            }
        });

        function onPlayerReady(event) {
            console.log('video played');
            event.target.playVideo();

            //favouriteVideos.forEach(function(item){
            //    ytPlayer.cueVideoById(item);
            //});

        }

        console.log(favouriteVideos);
        function onPlayerStateChange(event) {
            if(event.data == YT.PlayerState.ENDED){
                var mediaPlayer = $('#player'),
                    detailsBlock = mediaPlayer.find('.video-details');
                // Implement 'nextVideo()'
                console.log('Video Ended!');
                var videoIndex = favouriteVideos.indexOf(Session.get('videoId')),
                    nextVideoIndex = videoIndex + 1;

                if(nextVideoIndex === favouriteVideos.length - 1){
                    nextVideoIndex = 0;
                }

                var nextVideoID = favouriteVideos[nextVideoIndex];

                var nextVideoContainer = $('*[data-videoid="'+ nextVideoID +'"]'),
                    nextVideoTitle = nextVideoContainer.find('.title-link').clone().detach(),
                    nextVideoDescription = nextVideoContainer.find('.description').clone().detach();
                detailsBlock.empty().append(
                    nextVideoTitle,
                    nextVideoDescription
                );
                console.log(ytPlayer);
                Session.set('videoId', nextVideoID);
                ytPlayer.videoId = nextVideoID;
                ytPlayer.playVideo();



                console.log(videoIndex);
            }
        }
        function stopVideo() {
            ytPlayer.stopVideo();
        }

        $('#ytPlayer').addClass('opened');
    });
};