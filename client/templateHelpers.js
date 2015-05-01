Template.favourites.helpers({
    favs: function(){
       return Favourites.find({userId: Meteor.user()._id}, {sort: {created: -1}});
    },

    favsCount: function(){
        return Favourites.find({userId: Meteor.user()._id}).count();
    }
});



Template.header.helpers({
    favsCount: function(){
        return Favourites.find({userId: Meteor.user()._id}).count();
    },
    iconSwitch: function(){
        if(Session.get('video-playing') === true){
            return true;
        }
    }
});

Template.rss.helpers({
    headlinesCount: function(){
        return RssFeed.find().count();
    },

    lastRssTopic: function(){
        return LastRss.find({}, {sort: {created:-1}, limit: 1});
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
});

Template.twitter.helpers({
    tweetsObj: function(){
        return TweetsTemp.find();
    }
});

Template.tweet.helpers({
    urlify: function(text) {
        var urlRegex = /(https?:\/\/[^\s]+)/g,
            hashTagRegex = /(#[a-z0-9][a-z0-9\-_]*)/ig,
            usernameRegex = /(@[a-z0-9][a-z0-9\-_]*)/ig;

        return text
            .replace(urlRegex, function(url) {
                return '<a href="' + url + '">' + url + '</a>';
            })
            .replace(hashTagRegex, function(url) {
                return '<a href="https://twitter.com/hashtag/'+ url.slice(1, url.length) +'">' + url + '</a>';
            })
            .replace(usernameRegex, function(url) {
                return '<a href="https://twitter.com/'+ url.slice(1, url.length) +'">' + url + '</a>';
            });
    }
});