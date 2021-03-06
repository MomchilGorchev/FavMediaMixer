/**
 * Created by momchillgorchev on 24/02/15.
 */
//console.log('FMM: Preparing Database...');
// Define Collections
Favourites = new Meteor.Collection('favourites');
RssFeed = new Meteor.Collection('rssfeed');
LastRss = new Meteor.Collection('lastrss');
RssNews = new Meteor.Pagination(RssFeed, {
    itemTemplate: 'rssItem',
    perPage: 10,
    router: 'item-router',
    templateName: 'rss'
});
Playlists = new Meteor.Collection('playlists');

GithubRecent = new Meteor.Collection('githubrecent', {
    capped: true,
    size: 500000, // 500kb size
    max: 5        // Max amount of documents
});
TweetsTemp = new Meteor.Collection('tweets');
ApiCalls = new Meteor.Collection('apicalls');

//console.log('FMM: Database -- OK');
//console.log('FMM: Starting server');

if(Meteor.isServer){
    // Publish all collections
    Meteor.publish('apicalls', function(){
        return ApiCalls.find();
    });
    Meteor.publish('favourites', function(){
        return Favourites.find();
    });
    Meteor.publish('playlists', function(){
        return Playlists.find();
    });
    //Meteor.publish('rssfeed', function(){
    //    return RssFeed.find();
    //});
    Meteor.publish('lastrss', function(){
        return LastRss.find();
    });
    Meteor.publish('githubrecent', function(){
        return GithubRecent.find();
    });
    Meteor.publish('tweets', function(){
        return TweetsTemp.find();
    });
}
