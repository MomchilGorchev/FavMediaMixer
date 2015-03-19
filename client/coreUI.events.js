Template.footer.events({
    'click #play-now': function(e, t){
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