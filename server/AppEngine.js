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
                    userInfo: fav.user,
                    created: Date.now()
                });
                console.log(result);
                return true;
            }
        },

        removeFavourite: function(itemId){
            if(itemId){
                if(Favourites.remove({_id: itemId})){
                    return true;
                } else {
                    throw new Meteor.Error(500, 'Error occurred');
                }
            } else {
                throw new Meteor.Error(500, 'Error occurred');
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
         * BBC RSS Feed methods. Fetch from server and add iteratively to collection.
         * Clears the collection by default.
         * @param flag - The topic to be pulled
         * @param clear - boolen to indicate if collection clear is needed
         * @param collection - collection to be cleared
         * @returns {*}
         */
        getRssFeed: function(flag, clear, collection){
            // Check the input
            if(flag){
                if(flag !== 'default'){
                    var url = '';
                    // Different url based on the requested topic
                    if(flag === 'top_stories'){
                        url = 'http://feeds.bbci.co.uk/news/rss.xml';
                    } else {
                        url = 'http://feeds.bbci.co.uk/news/'+ flag +'/rss.xml';
                    }
                    // TRUE by default e.g. erase the collection
                    if(clear === true){
                        Meteor.call('clearTempCollection', collection);
                    }
                    // Make call
                    try {
                        var result = HTTP.call('GET', url);
                        // If call is successful
                        if(result.statusCode == 200 && result.content){
                            // Initiate parser
                            var parser = new xml2js.Parser();
                            // And parse the xml response into JS object
                            parser.parseString(result.content, function(err, res){
                                // Vars cache and buffers
                                var items = res.rss.channel[0].item, length = items.length,
                                    i = null, insert = true;
                                // Iterate over every item
                                for(i = 0; i < length; i++){
                                    // Cache the currently iterated item
                                    var current = items[i],
                                        // And the thumbnail
                                        thumb = current['media:thumbnail'][1]['$'].url || current['media:thumbnail'][0]['$'].url,
                                        // Insert into DB
                                        execute = RssFeed.insert({
                                            title: current.title[0],
                                            description: current.description[0],
                                            link: current.link[0],
                                            pubDate: current.pubDate[0],
                                            thumb: thumb
                                        });
                                    // Check operation
                                    if(!execute){
                                        insert = false;
                                    }
                                }
                                // If all good
                                if(insert){
                                    // Insert the topic into collection
                                    LastRss.insert({
                                        lastTopic: flag,
                                        created: Date.now()
                                    });
                                    // End
                                    return true;
                                }
                            });
                        // Not a successful call
                        } else {
                            return 'Error response: ' + result.statusCode;
                        }
                    }
                    // Not able to make HTTP call
                    catch(e){
                        throw new Meteor.Error(500, e.errorCode);
                    }
                // Not a topic specified
                } else {
                    throw new Meteor.Error(500, 'Please choose topic');
                }
            // Empty function call?!
            } else {
                throw new Meteor.Error(500, 'Parameters required!');
            }
        },

        /**
         * Utility Clear Collection method
         * @param collection - the collection to be cleared
         */
        clearTempCollection: function(collection){
            if(global[collection].find().count() > 0){
                if(global[collection].remove({})){
                    return true;
                }
            } else {
                throw new Meteor.Error(500, 'Cannot find collection [ %i ] - Aborting..', collection);
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