Template.footer.events({
    'click .open-mediaplayer': function(e, t){
        var trigger = $(e.currentTarget),
            player = $('#player');
        player.addClass('open');
    }
});

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
