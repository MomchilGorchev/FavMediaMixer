/**
 * Created by momchillgorchev on 24/02/15.
 */
console.log('FMM: Preparing Database...');
// Define Collections
Favourites = new Meteor.Collection('favourites');
RssFeed = new Meteor.Collection('rssfeed');
GithubRecent = new Meteor.Collection('githubrecent', {
    capped: true,
    size: 500000, // 500kb size
    max: 5        // Max amount of documents
});
TweetsTemp = new Meteor.Collection('tweets')

console.log('FMM: Database -- OK');
console.log('FMM: Starting server');

if(Meteor.isServer){
    // Publish all collections
    Meteor.publish('favourites', function(){
        return Favourites.find();
    });
    Meteor.publish('rssfeed', function(){
        return RssFeed.find();
    });
    Meteor.publish('githubrecent', function(){
        return GithubRecent.find();
    });
    Meteor.publish('tweets', function(){
        return TweetsTemp.find();
    });
}
