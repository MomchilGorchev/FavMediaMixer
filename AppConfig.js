/**
 * Created by momchillgorchev on 24/02/15.
 */
console.log('FMM: Preparing Database...');
// Define Collections
Favourites = new Meteor.Collection('favourites');
//Favsongs = new Meteor.Pagination(Favourites, {
//    itemTemplate: 'favItem',
//    perPage: 5,
//    sort: {created: -1}
//});

RssFeed = new Meteor.Collection('rssfeed');
LastRss = new Meteor.Collection('lastrss');
RssNews = new Meteor.Pagination(RssFeed, {
    itemTemplate: 'rssItem',
    perPage: 5,
    router: 'item-router',
    templateName: 'rss'

});

GithubRecent = new Meteor.Collection('githubrecent', {
    capped: true,
    size: 500000, // 500kb size
    max: 5        // Max amount of documents
});
TweetsTemp = new Meteor.Collection('tweets');

console.log('FMM: Database -- OK');
console.log('FMM: Starting server');

if(Meteor.isServer){
    // Publish all collections
    Meteor.publish('favourites', function(){
        return Favourites.find();
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
