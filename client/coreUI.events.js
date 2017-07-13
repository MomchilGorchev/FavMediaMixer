<<<<<<< HEAD
Template.footer.events({
    'click .open-mediaplayer': function(e, t){
        var trigger = $(e.currentTarget),
            player = $('#player');
        player.addClass('open');
    }
});
=======
//Template.footer.events({
//    'click .open-mediaplayer': function(e, t){
//        var trigger = $(e.currentTarget),
//            player = $('#player');
//        player.addClass('open');
//    }
//});
>>>>>>> 41ef65e1c0b86d88db8d956082c066cac80c4bba

Template.header.events({
    'click .open-mediaplayer': function(e, t){
        var trigger = $(e.currentTarget),
            player = $('#player');
        player.addClass('open');
    }
});

Template.mainLayout.events({
    'click .overlay-close': function(e, t){
        var trigger = $(e.currentTarget),
            player = trigger.closest('#player');
        player.removeClass('open');
    }
});