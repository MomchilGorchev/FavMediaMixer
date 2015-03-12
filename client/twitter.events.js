Template.twitter.events({
     'click #get-tw-feed, keyup .tw-search': function(e, t){

         var query = null,  trigger = $(e.currentTarget),
             wrapper = t.find('#tweets-wrapper'), tweets = [];
         if(e.keyCode === 13 || e.type === 'click'){
             if(trigger.hasClass('tw-search')){
                 trigger = t.find('#get-tw-feed');
             }
             query = t.find('.tw-search').value;
             // Validate
             if(query && query.length){
                 $(trigger).attr('disabled', true).html('<i class="fa fa-spinner fa-spin"></i>');
                 // Call server
                 Meteor.call('clearTempCollection', 'TweetsTemp', function(err, res){
                     if(err){
                         console.log(err);
                     }
                 });
                 Meteor.call('twSearchApi', query, function(err, res){
                     if (err){
                         // If error display error message
                         FlashMessages.sendError('Error: '+ err.error);
                         $(trigger).removeAttr('disabled').html('<i class="fa fa-cloud-download"></i> Get Feed');
                     } else {
                         console.log(res.statuses[1]);
                         // Else handle the result
                         $.each(res.statuses, function(k, v){
                             // Display the API object for each tweet
                             // console.log(this);
                             var _this = this,
                                 twData = {
                                     tweetId: _this.id,
                                     userId: Meteor.user()._id,
                                     text: _this.text,
                                     user: _this.user,
                                     created: _this.created_at
                                 };
                             tweets.push(twData);
                         });
                         Meteor.call('addTweets', tweets, function(err, res){
                             if(err){
                                 FlashMessages.sendError('<i class="fa fa-warning"></i> Error occurred while proccessing your request. <br />Please try again');
                             } else {
                                 $(trigger).removeAttr('disabled').html('<i class="fa fa-cloud-download"></i> Get Feed');
                             }
                         });
                     }
                 });
             }
         }
     }
});