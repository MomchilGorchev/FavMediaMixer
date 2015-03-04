Template.favourites.helpers({
    favs: function(){
       return Favourites.find({userId: Meteor.user()._id});
    },

    favsCount: function(){
        return Favourites.find({userId: Meteor.user()._id}).count();
    }
});

Template.header.helpers({
    favsCount: function(){
        return Favourites.find({userId: Meteor.user()._id}).count();
    }
});

Template.rss.helpers({
    rssItems: function(){
       return RssFeed.find();
    },

    headlinesCount: function(){
        return RssFeed.find().count();
    }
});