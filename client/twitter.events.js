Template.twitter.events({
     'click #get-tw-feed': function(e, t){
         var trigger = $(e.currentTarget),
             query = t.find('.tw-search').value, tweets = [];
         // Validate
         if(query && query.length){
             // Call server
             Meteor.call('twSearchApi', query, function(err, res){
                if (err){
                    // If error display error message
                    FlashMessages.sendError('Error: '+ err.error);
                } else {
                    // Else handle the result
                    $.each(res.statuses, function(k, v){
                        // Display the API object for each tweet
                        // console.log(this);
                        var _this = this,
                            twData = {
                                text: _this.text,
                                user: _this.user,
                                created: _this.created_at
                            };
                        tweets.push(twData);
                    });
                    // Object with the info we need
                    console.log(tweets);
                }
             });
         }
     }
});