/**
 * Server start
 * Methods file
 */

Meteor.startup(function(){

    // Need this to be able to return async
    Future = Npm.require('fibers/future');

    // Get keys from file
    var AppKeys = {
        keys: JSON.parse(Assets.getText("tokens.json")),
        getKey: function(param){
            return this.keys[param].apikey
        }
    };

    //console.log(AppKeys.keys.Twitter);
    return Meteor.methods({

        /**
         * Youtube add-to-favourite logic
         * @param fav - the item to be added
         * @returns {boolean}
         */
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
        // Call Auto complete API
        externalCall: function(query){
            // Could include dynamic call parameters
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
        // Calls the Youtube API
        getYtList: function(query){
            if(AppUtil.gAuth() === true) {
                if (query) {
                    try {
                        var result = HTTP.call(
                            'GET',
                            'https://www.googleapis.com/youtube/v3/search',
                            {
                                proxy: process.env.QUOTAGUARDSTATIC_URL,
                                params: {
                                    'part': 'snippet',
                                    'q': query,
                                    'key': AppKeys.getKey('Youtube')
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

        /**
         * Github API call and add to "Recent" collection
         * @param query - github username or group to look for
         * @returns {*}
         */
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
                            // TODO Implement db cleanup here
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

        /**
         * BBC RSS Feed metgos
         * @param flag - The topic to be pulled
         * @param clear - boolen to indicate if collection clear is needed
         * @param collection - collection to be cleared
         * @returns {*}
         */
        getRssFeed: function(flag, clear, collection){
            if(flag){
                if(flag !== 'default'){
                    var url = '';
                    if(flag === 'top_stories'){
                        url = 'http://feeds.bbci.co.uk/news/rss.xml';
                    } else {
                        url = 'http://feeds.bbci.co.uk/news/'+ flag +'/rss.xml';
                    }
                    if(clear === true){
                        Meteor.call('clearTempCollection', collection);
                    }
                    try {
                        var result = HTTP.call('GET', url);
                        if(result.statusCode == 200 && result.content){
                            var parser = new xml2js.Parser();
                            parser.parseString(result.content, function(err, res){
                                var items = res.rss.channel[0].item, length = items.length, i = null, insert = true;
                                for(i = 0; i < length; i++){

                                    var current = items[i],
                                    execute = RssFeed.insert({
                                        title: current.title[0],
                                        description: current.description[0],
                                        link: current.link[0],
                                        pubDate: current.pubDate[0],
                                        thumb: current['media:thumbnail'][1]['$'].url
                                    });
                                    if(!execute){
                                        insert = false;
                                    }
                                }
                                if(insert){
                                    console.log(flag);
                                    LastRss.insert({
                                        lastTopic: flag,
                                        created: Date.now()
                                    });
                                    return true;
                                }
                            });

                            //return result.content;
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

        /**
         * Utility Clear Collection method
         * @param collection - the collection to be cleared
         * @returns {boolean}
         */
        clearTempCollection: function(collection){
            if(global[collection].find().count() > 0){
                if(global[collection].remove({})){
                    return true;
                }
            } else {
                return false;
            }
        },

        /**
         * Twitter API calls and temp collection handling
         * @param query - the string param for the call
         * @param clear - if true erase temp collection first
         * @param collection - name of the temp collection
         * @returns {*} - return async
         */
        twSearchApi: function(query, clear, collection){

            if(clear === true){
                Meteor.call('clearTempCollection', collection);
            }

            var future = new Future();
            //TODO return keys with method
            var twitterSearch = new Twitter.SearchClient(
                AppKeys.keys.Twitter.consumer_key,
                AppKeys.keys.Twitter.consumer_secret,
                AppKeys.keys.Twitter.access_token_key,
                AppKeys.keys.Twitter.access_token_secret
            );
            var twitterStreamClient = new Twitter.StreamClient(
                AppKeys.keys.Twitter.consumer_key,
                AppKeys.keys.Twitter.consumer_secret,
                AppKeys.keys.Twitter.access_token_key,
                AppKeys.keys.Twitter.access_token_secret
            );
            if(query){

                twitterSearch.search({'q': query}, function(err, res){
                    console.log(res);
                    future['return'](res);
                });

                return future.wait();
            } else {
                return false;
            }
        },
        // Maybe merge with the method above
        addTweets: function(tweets){
            if(tweets && tweets.length){
                var tweetsAmount = tweets.length;
                for(var i = 0; i < tweetsAmount; i++) {
                    TweetsTemp.insert({
                        tweetId: tweets[i].tweetId,
                        userId: tweets[i].userId,
                        text: tweets[i].text,
                        user: tweets[i].user,
                        created: tweets[i].created
                    });
                }
                return TweetsTemp.find().fetch();
            } else {
                return false;
            }
        }
    });
});