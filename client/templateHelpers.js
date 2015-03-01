Template.favourites.helpers({
    favs: function(){
       return Favourites.find({user: Meteor.user().emails[0].address});
    },

    favsCount: function(){
        return Favourites.find({user: Meteor.user().emails[0].address}).count();
    }
});

Template.header.helpers({
    favsCount: function(){
        return Favourites.find({user: Meteor.user().emails[0].address}).count();
    }
});