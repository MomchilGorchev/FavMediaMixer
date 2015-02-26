Template.favourites.helpers({
   favs: function(){
       return Favourites.find({user: Meteor.user().emails[0].address});
   }
});