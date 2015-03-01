

Meteor.startup(function(){

    return Meteor.methods({
        addToFavourite: function(fav){
            if(fav){
                var result = Favourites.insert({
                    title: fav.title,
                    description: fav.description,
                    videoId: fav.videoId,
                    thumb: fav.thumbnail,
                    user: fav.user
                });
                console.log(result);
                return true;
            }
        },

        externalCall: function(query){
            if(query){
                try{
                    var result = HTTP.call(
                        'GET',
                        'http://suggestqueries.google.com/complete/search',
                        {
                            params: {
                                'client': 'firefox',
                                'ds': 'yt',
                                'q': query
                            }
                        }
                    );
                }
                catch(e){
                    console.log(e);
                    return false;
                }
                if(result.statusCode === 200 && result.content !== ''){
                    return result.content;
                }
            }
        },

        // This call requires authentication

        getYtList: function(query){
            if(AppUtil.gAuth() === true) {
                if (query) {
                    try {
                        var result = HTTP.call(
                            'GET',
                            'https://www.googleapis.com/youtube/v3/search',
                            {
                                params: {
                                    'part': 'snippet',
                                    'q': query,
                                    'key': 'AIzaSyARwdpTVqwlj4DZtYyymfqntrfqJL9DN-U'
                                }
                            }
                        );
                    }
                    catch (e) {
                        console.log(e);
                        return false;
                    }
                    if (result.statusCode === 200 && result.content !== '') {
                        return result.content;
                    }
                }
            }
        },

        // DRIVE
        getDriveContents: function(){
            try {
                // Accessing endpoints REST api
                var url = 'https://www.googleapis.com/drive/v2/files';
                var result = HTTPJWT.get(url);

                if(result){
                    return result.data; // Access your data
                }
            }
            catch (e) {
                console.log(e);
                return false;
            }
            //if (result.statusCode === 200 && result.content !== '') {
            //    return result.content;
            //}
        }

    });
});