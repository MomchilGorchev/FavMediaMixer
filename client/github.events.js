/**
 * Created by momchillgorchev on 03/03/15.
 */
Template.github.events({
    'click #get-github-feed': function(e, t){
        var trigger = e.currentTarget,
            container = t.find('.container'),
            user = t.find('.github-user').value, buffer = [];
        console.log(user);

        if(user){
            Meteor.call('getGithubFeed', user, function(err, res){
                if(err) console.log(err);

                res = $.parseJSON(res);

                $.each(res, function(){
                    var curr = this;
                    buffer.push('<p>'+curr.actor.login+' - '+ curr.type +' - '+ curr.repo.name +'</p>');
                });
                $(container).html(buffer);
            });
        }

    }
});