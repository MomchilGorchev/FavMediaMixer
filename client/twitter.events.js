Template.twitter.events({
     'click #get-tw-feed': function(e, t){
         var trigger = $(e.currentTarget),
             query = t.find('.tw-search').value;

         if(query){
             Meteor.call('twSearchApi', query, function(err, res){
                if (err){
                    console.log('Err: '+ err.error);
                }
                 console.log('Res: '+ res);
             });
         }
     }
});