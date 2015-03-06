/**
 * Created by momchillgorchev on 03/03/15.
 */
Template.github.events({
    'click #get-github-feed, keyup .github-user, click .recent-query': function(e, t){
        var query = null, eventTarget = $(e.currentTarget);
        // Handle Enter key press and click on submit
        if(e.keyCode === 13 || e.type === 'click'){
            // If we click on the recent queries
            if(eventTarget.hasClass('recent-query')){
                query = eventTarget.text();
            } else {
                query = t.find('.github-user').value;
            }
            var trigger = t.find('#get-github-feed'),
                container = t.find('#github-result'),
                containerBody = $(container).find('tbody'),
                noInfo = t.find('.no-info'),
                buffer = [];
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
                                curr.actor.login +'" target="_blank">' +
                                '<img src="https://avatars.githubusercontent.com/u/'+
                                curr.actor.id +'" class="user-avatar" />'+ curr.actor.login +'</a>' +
                                '</td>' +
                                '<td>'+ curr.type +'</td>' +
                                '<td><a href="https://github.com/'+ curr.repo.name +'" target="_blank">'+ curr.repo.name +'</a></td>' +
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
    }


});