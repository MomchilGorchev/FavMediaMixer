Template.rss.events({
    'change #rss-title': function(e, t){
        var filter = e.currentTarget;
        console.log(filter.value);
        Meteor.call('getRssFeed', filter.value, true, 'RssFeed', function(err, res){
            if(err){
                FlashMessages.sendError('<i class="fa fa-warning"></i> Error occurred: ' + err);
            } else {
                console.log('Done!');
            }
        });
    }
});