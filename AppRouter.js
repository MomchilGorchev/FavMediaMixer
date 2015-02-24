/**
 * Created by momchillgorchev on 19/02/15.
 */


Router.configure({
    layoutTemplate: "mainLayout"
    //loadingTemplate: "loading",
    //notFoundTemplate: "missing"
});

UserAccessController = RouteController.extend({
    //On before action hook to check if the user is logged in
    onBeforeAction: function(){
        //if (!(Meteor.loggingIn() || Meteor.user())) {
        //    this.render("login");
        //} else{
            // Subscriptions
            Meteor.subscribe('playlists');
            // After IR > 1.* you need to use this.next()
            // for better use of connection middleware
            this.next();
        }
    //}
});

Router.map(function () {

    this.route('home', {
        path: '/',
        controller: UserAccessController
    });

});


