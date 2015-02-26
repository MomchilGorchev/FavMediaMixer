/**
 * Created by momchillgorchev on 24/02/15.
 */

Favourites = new Meteor.Collection('favourites');

if(Meteor.isServer){
    Meteor.publish('favourites', function(){
        return Favourites.find();
    });
}
