Template.rss.events({
    'change #rss-title': function(e, t){
        var filter = e.currentTarget,
            newItem = {}, items = [];


        Meteor.call('getRssFeed', filter.value, function(err, res){
            if(err){
                console.log(err);
            } else {
                var xmlDoc = $.parseXML(res),
                    xml = $(xmlDoc);
                xml.find('item').each(function(){
                    var _this = $(this),
                        content = _this.context;

                    //console.log(a);

                    newItem = {
                        'title': $(content).find('title').text(),
                        'description': $(content).find('description').text(),
                        'link': $(content).find('link').text(),
                        'pubDate': $(content).find('pubDate').text(),
                        'thumb': $(content).find('thumbnail').attr('url')
                    };
                    items.push(newItem);
                });
                Meteor.call('addRss', items, true, 'RssFeed', function(err, res){
                    if(err){
                        FlassMessages('Error occurred while handling the response');
                    }
                });
            }
        });
    }
});