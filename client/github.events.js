/**
 * Created by momchillgorchev on 03/03/15.
 */
Template.github.events({
    'click #get-github-feed': function(e, t){
        var trigger = e.currentTarget,
            container = t.find('#github-result'),
            containerBody = $(container).find('tbody'),
            query = t.find('.github-user').value, buffer = [];
        //console.log(user);

        if(query){
            Meteor.call('getGithubFeed', query, function(err, res){
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
                            '<td><a href="https://github.com/'+ curr.repo.name +'">'+ curr.repo.name +'</a></td>' +
                            '<td>'+ curr.created_at +'</td>'+
                        '</tr>'
                    );
                });
                $(containerBody).html(buffer);
                $(container).removeClass('hidden');

            });
        }

    }
});