/**
 * Created by momchillgorchev on 03/03/15.
 */
Template.github.events({
    'click #get-github-feed': function(e, t){
        var trigger = e.currentTarget,
            container = t.find('#github-result'),
            containerBody = $(container).find('tbody');
            user = t.find('.github-user').value, buffer = [];
        console.log(user);

        if(user){
            Meteor.call('getGithubFeed', user, function(err, res){
                if(err) console.log(err);

                res = $.parseJSON(res);

                console.log(res);

                $.each(res, function(){
                    var curr = this;
                    buffer.push(
                        '<tr>' +
                            '<td><a href="https://github.com/'+ curr.actor.login +'">' +
                                '<img src="https://avatars.githubusercontent.com/u/'+
                                curr.actor.id +'" class="user-avatar" />'+ curr.actor.login +'</a></td>' +
                            '<td>'+ curr.type +'</td>' +
                            '<td>'+ curr.repo.name +'</td>' +
                        '</tr>'
                    );
                });
                $(containerBody).html(buffer);
                $(container).removeClass('hidden');
            });
        }

    }
});