Template.rss.events({
    'change #rss-title': function(e, t){
        var filter = e.currentTarget;
        console.log(filter.value);
        Meteor.call('getRssFeed', filter.value, true, 'RssFeed', function(err, res){
            if(err){
                console.log(err);
            } else {
                console.log('Done!');
            }
        });
    }
});