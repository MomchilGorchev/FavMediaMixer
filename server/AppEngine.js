/**
 * Created by momchillgorchev on 20/02/15.
 */



Meteor.startup(function(){

    return Meteor.methods({
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
            if(query){
                try{
                    var result = HTTP.call(
                        'GET',
                        'https://www.googleapis.com/youtube/v3/search',
                        {
                            params: {
                                'part': 'snippet',
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
        }
    });
});