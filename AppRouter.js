/**
 * Created by momchillgorchev on 19/02/15.
 */


Router.configure({
    layoutTemplate: "mainLayout"
    //loadingTemplate: "loading",
    //notFoundTemplate: "missing"
});

Router.route('/', function () {
    this.render('home');
});