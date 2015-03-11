

Meteor.startup(function(){

    Future = Npm.require('fibers/future');

    return Meteor.methods({
        addToFavourite: function(fav){
            if(fav){
                var result = Favourites.insert({
                    title: fav.title,
                    description: fav.description,
                    videoId: fav.videoId,
                    thumb: fav.thumbnail,
                    userId: fav.userId,
                    userInfo: fav.user
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
                                    'key': 'AIzaSyDdat-_my7hM7zsB5I3CcHcvBLsTHgreSc'
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

        // DRIVE - SUPPORT NOT READY FOR SERVER JS APPS
        //getDriveContents: function(){
        //    try {
        //        // Accessing endpoints REST api
        //        var url = 'https://www.googleapis.com/drive/v2/files?maxResults=100';
        //        var result = HTTPJWT.get(url);
        //
        //        if(result){
        //            //console.log(result);
        //            return result.content; // Access your data
        //        }
        //    }
        //    catch (e) {
        //        console.log(e);
        //        return false;
        //    }
        //    //if (result.statusCode === 200 && result.content !== '') {
        //    //    return result.content;
        //    //}
        //},

        // GITHUB
        getGithubFeed: function(query){
            if(query){
                try{
                    var result = HTTP.call(
                        'GET',
                        'https://api.github.com/users/'+ query +'/events',
                        {
                            headers:{ 'User-Agent': 'FMM' }
                        }
                    );
                    if(result){
                        // Get the last 5 items
                        var lastItems = GithubRecent.find({}, {sort: {created: -1}, limit:5}).fetch(),
                            existing = false,
                            docs = lastItems.length;
                        // Iterate to check if the query exist
                        for(var i = 0; i < docs; i++){
                            if(lastItems[i].query === query){
                                // Set flag
                                existing = true;
                            }
                        }
                        // If not add the new entry
                        if(existing === false){
                            GithubRecent.insert({
                                query: query,
                                created: Date.now()
                            });
                        }
                        else{
                            // Implement db cleanup here
                            console.log('Already exist');
                        }
                        return result.content;
                    }
                }
                catch(e){
                    console.log(e);
                    return false;
                }
            }
        },

        getRssFeed: function(flag){
            if(flag){
                if(flag !== 'default'){
                    var url = '';
                    if(flag === 'top_stories'){
                        url = 'http://feeds.bbci.co.uk/news/rss.xml';
                    } else {
                        url = 'http://feeds.bbci.co.uk/news/'+ flag +'/rss.xml';
                    }
                    try {
                        var result = HTTP.call('GET', url);
                        if(result.statusCode == 200 && result.content){
                            return result.content;
                        } else {
                            return 'Error response: ' + result.statusCode;
                        }
                    }
                    catch(e){
                        console.log(e);
                        return false;
                    }
                } else {
                    return 'Please choose topic';
                }
            } else {
                return 'Parameters required!'
            }
        },

        addToTempCollection: function(item){
            if(item){
                var result = RssFeed.insert({
                    title: item.title,
                    description: item.description,
                    link: item.link,
                    pubDate: item.pubDate,
                    thumb: item.thumb
                });
                if(result){
                    return true;
                }
            }
        },

        clearTempCollection: function(collection){
            if(global[collection].find().count() > 0){
                if(global[collection].remove({})){
                    return true;
                }
            }
        },

        twSearchApi: function(query){
            var future = new Future();
            var twitterSearch = new Twitter.SearchClient(
                'ZMRm7HceWg9P1uIazWXitIOAI',
                'POkwfpjmRMiiWEMsECVCAqX7R2SoCh26hrrK91nRAZOj3QZDa7',
                '2301354211-72SHpOki6TffW0AnslYnQoVqK4DW1e1SHJS6I0W',
                'xAIjyT7zZPZ7gf6DxcxbkxawOnwHiRcPGpp7Z99UZs8t0'
            );
            var twitterStreamClient = new Twitter.StreamClient(
                'ZMRm7HceWg9P1uIazWXitIOAI',
                'POkwfpjmRMiiWEMsECVCAqX7R2SoCh26hrrK91nRAZOj3QZDa7',
                '2301354211-72SHpOki6TffW0AnslYnQoVqK4DW1e1SHJS6I0W',
                'xAIjyT7zZPZ7gf6DxcxbkxawOnwHiRcPGpp7Z99UZs8t0'
            );
            if(query){

                twitterSearch.search({'q': query}, function(err, res){
                    console.log(res);
                    future['return'](res);
                });

                return future.wait();
            }
        }
    });
});