/**
 * Created by momchillgorchev on 24/02/15.
 */
Playlists = new Meteor.Collection('playlists');

if(Meteor.isServer){
    Meteor.publish('playlists', function(){
        return Playlists.find();
    });
}
