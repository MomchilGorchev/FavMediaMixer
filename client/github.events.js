/**
 * Created by momchillgorchev on 03/03/15.
 */
Template.github.events({
    'click #get-github-feed, keyup .github-user': function(e, t){
        // Handle Enter key press and click on submit
        if(e.keyCode === 13 || e.type === 'click'){
            var trigger = t.find('#get-github-feed'),
                container = t.find('#github-result'),
                containerBody = $(container).find('tbody'),
                noInfo = t.find('.no-info'),
                query = t.find('.github-user').value, buffer = [];
            //console.log(user);

            if(query){
                $(trigger).attr('disabled', true).html('<i class="fa fa-spinner fa-spin"></i>');
                Meteor.call('getGithubFeed', query, function(err, res){
                    if(err) console.log(err);

                    res = $.parseJSON(res);

                    //console.log(res);
                    if(res.length){
                        $.each(res, function(){
                            var curr = this;
                            buffer.push(
                                '<tr>' +
                                '<td><a href="https://github.com/'+
                                curr.actor.login +'">' +
                                '<img src="https://avatars.githubusercontent.com/u/'+
                                curr.actor.id +'" class="user-avatar" />'+ curr.actor.login +'</a>' +
                                '</td>' +
                                '<td>'+ curr.type +'</td>' +
                                '<td><a href="https://github.com/'+ curr.repo.name +'">'+ curr.repo.name +'</a></td>' +
                                '<td>'+ curr.created_at +'</td>'+
                                '</tr>'
                            );
                        });
                        $(noInfo).addClass('hidden');
                        $(containerBody).html(buffer);
                        $(container).removeClass('hidden');
                        $(trigger).removeAttr('disabled').html('<i class="fa fa-cloud-download"></i> Get Feed');
                    } else {
                        $(container).addClass('hidden');
                        $(noInfo).removeClass('hidden');
                        $(trigger).removeAttr('disabled').html('<i class="fa fa-cloud-download"></i> Get Feed');
                    }

                });
            }
        }
    },

    'click .recent-query': function(e, t){
        var value = e.currentTarget.text();

        console.log(value);
    }
});