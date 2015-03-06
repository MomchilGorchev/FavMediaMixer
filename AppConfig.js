/**
 * Created by momchillgorchev on 24/02/15.
 */

Favourites = new Meteor.Collection('favourites');
RssFeed = new Meteor.Collection('rssfeed');
GithubRecent = new Meteor.Collection('githubrecent', {
    capped: true,
    size: 500000, // 500kb size
    max: 5        // Max amount of documents
});

if(Meteor.isServer){
    Meteor.publish('favourites', function(){
        return Favourites.find();
    });
    Meteor.publish('rssfeed', function(){
        return RssFeed.find();
    });
    Meteor.publish('githubrecent', function(){
        return GithubRecent.find();
    });
}
