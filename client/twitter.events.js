Template.twitter.events({
     'click #get-tw-feed': function(e, t){
         var trigger = $(e.currentTarget),
             wrapper = t.find('#tweets-wrapper'),
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
                        var twHtml =
                            '<div class="tweet">' +
                                '<img class="user-img" src="'+ twData.user.profile_image_url +'" />'+
                                '<div class="user-info">' +
                                    '<span class="user-name">'+ twData.user.name +'</span><br />'+
                                    '<span class="user-screen-name">@'+ twData.user.screen_name +'</span>'+
                                '</div>'+
                                '<p class="tweet-text">'+ twData.text +'</p>'+
                                '<span class="tweet-created">'+ twData.created +'</span>'+
                            '</div>';

                        tweets.push(twHtml);
                    });
                    // Object with the info we need
                    //console.log(tweets);
                    $(wrapper).html(tweets);
                }
             });
         }
     }
});