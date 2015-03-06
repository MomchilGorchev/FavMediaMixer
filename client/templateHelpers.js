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

Template.profile.helpers({
    userInfo: function(){
        return [Meteor.user().profile.name, Meteor.user()._id];
    }
});

Template.github.helpers({
    recentQueries: function() {
        return GithubRecent.find({}, {sort: {created: -1}, limit: 5});
    }
    //recentCount: function(){
    //    return GithubRecent.find().count();
    //}
});