Template.twitter.events({
     'click #get-tw-feed': function(e, t){
         var trigger = $(e.currentTarget),
             query = t.find('.tw-search').value;
         // Validate
         if(query && query.length){
             // Call server
             Meteor.call('twSearchApi', query, function(err, res){
                if (err){
                    // If error display error message
                    FlashMessages.sendError('Error: '+ err.error);
                } else {
                    // Else handle the result
                    //console.log('Response: '+ res);
                    $.each(res.statuses, function(k, v){
                        console.log(this);
                    })
                }
             });
         }
     }
});