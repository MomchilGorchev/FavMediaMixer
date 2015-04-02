Template.twitter.events({
    /**
     *
     * @param e - event
     * @param t - template
     *
     * Main submit event, handles click and enter key
     */
     'click #get-tw-feed, keyup .tw-search': function(e, t){
         // Cash vars
         var query = null,  trigger = $(e.currentTarget),
             wrapper = t.find('#tweets-wrapper'), tweets = [];
         // Trigger on click and enter only
         if(e.keyCode === 13 || e.type === 'click'){
             // If Enter reasign trigger to the btn
             if(trigger.hasClass('tw-search')){
                 trigger = t.find('#get-tw-feed');
             }
             // Get the value in the fiels
             query = t.find('.tw-search').value;
             // Validate
             if(query && query.length){
                 // Show spinner
                 $(trigger).attr('disabled', true).html('<i class="fa fa-spinner fa-spin"></i>');
                 // Call server
                 Meteor.call('twSearchApi', query, true, 'TweetsTemp', function(err, res){
                     if (err){
                         // If error display error message
                         FlashMessages.sendError(err);
                         // Hide spinner
                         $(trigger).removeAttr('disabled').html('<i class="fa fa-cloud-download"></i> Get Feed');
                     } else {
                         // Else handle the result
                         $.each(res.statuses, function(k, v){
                             // DEBUG: Display the API object for each tweet
                             // console.log(this);
                             var _this = this,
                                 // Get the necessary data and
                                 twData = {
                                     tweetId: _this.id,
                                     userId: Meteor.user()._id,
                                     text: _this.text,
                                     user: _this.user,
                                     created: _this.created_at
                                 };
                             // Stash the data
                             tweets.push(twData);
                         });
                         // Add to temp collection
                         Meteor.call('addTweets', tweets, function(err, res){
                             if(err){
                                 // Error
                                 FlashMessages.sendError('<i class="fa fa-warning"></i> Error occurred while proccessing your request. <br />Please try again');
                             } else {
                                 // Else all done, remove icon
                                 $(trigger).removeAttr('disabled').html('<i class="fa fa-cloud-download"></i> Get Feed');
                             }
                         });
                     }
                 });
             }
         }
     }
});