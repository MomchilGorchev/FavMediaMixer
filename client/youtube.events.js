Template.youtube.events({
    'keyup #autocomp-field': function(event, template){

        var _this = event.currentTarget,
            query = _this.value;
        var resultBox = template.find('#resultBox'), resultList, buffer = [];

        if(query.length == 0){
            resultBox.innerHTML = '';
        } else {
            //console.log(_this.value);
            Meteor.call('externalCall', query, function(err, res){
                if(err){
                    console.log(err);
                }
                else{
                    //https://www.youtube.com/results?search_query=
                    res = $.parseJSON(res);
                    for(var i = 0;i < res[1].length; i++){
                        if(res[1][i] !== ',') {
                            var current =
                                '<li><a href="#" class="auto-target" data-source="'+ res[1][i] +'">' +
                                res[1][i] + '</a>' +
                                '</li>';
                            buffer.push(current);
                        }
                    }
                    resultList = document.createElement('ul');
                    resultList.innerHTML = buffer.join(' ');
                    resultBox.innerHTML = '';
                    resultBox.appendChild(resultList);
                }

            });
        }
    },

    'click .auto-target': function(event, template){
        var _this = event.currentTarget,
            dataSource = _this.getAttribute('data-source'),
            playlist = template.find('#playlist'), feed = [],
            resultBox = template.find('#resultBox'),
            searchedTitle = _this.text,
            searchField = template.find('#autocomp-field'), ytLink, ytType, correctId, mainAction;

        Meteor.call('getYtList', dataSource, function(err, res){
            if(!err){
                searchField.value = searchedTitle;
                res = $.parseJSON(res);
                var items = res.items;
                for (var i = 0; i < items.length; i++){

                    //TODO implement response display
                    //console.log(items[i]);
                    //
                    //console.log(items[i].id.videoId);

                    if(items[i].id.videoId !== undefined){
                        ytLink = 'https://www.youtube.com/watch?v=' + items[i].id.videoId;
                        correctId = items[i].id.videoId;
                        ytType = 'video';
                        mainAction = 'play'
                    } else {
                        ytLink = 'https://www.youtube.com/user/' + items[i].snippet.channelTitle;
                        correctId = items[i].id.channelId;
                        ytType = 'channel';
                        mainAction = 'globe'
                    }


                    var snippet = items[i].snippet,
                        current =
                            '<li class="video-wrapper" data-yttype="'+ ytType +'" data-videoid="'+ correctId +'"><img class="video-thumb" src="'+ snippet.thumbnails.default.url +'">' +
                                '<a href="'+ ytLink +'" class="title-link" target="_blank">'+ snippet.title +'</a>'+
                                '<p class="description">'+ snippet.description +'</p>'+
                                '<ul class="video-actions">' +
                                    '<li class="favourite" data-action="'+ mainAction +'"><i class="fa fa-'+ mainAction +'"></i></li>' +
                                    '<li class="favourite" data-action="add"><i class="fa fa-plus"></i></li>' +
                                    '<li class="favourite" data-action="share"><i class="fa fa-share"></i></li>' +
                                '</ul>'+
                            '</li>';

                    feed.push(current);
                }
                var resultList = document.createElement('ul');
                resultList.innerHTML = feed.join(' ');
                playlist.innerHTML = '';
                playlist.appendChild(resultList);
                resultBox.innerHTML = '';
            } else {
                console.log(err);
            }
        });
    },

    'click .favourite': function(event, template){
        event.preventDefault();
        var _this = event.currentTarget,
            dataAction = _this.getAttribute('data-action'),
            parent = $(_this).closest('.video-wrapper'),
            videoId = parent.attr('data-videoid') || Session.get('videoId'),
            ytType = parent.attr('data-yttype'),
            description = parent.find('.description'),
            title = parent.find('.title-link'),
            thumb = parent.find('.video-thumb').attr('src'),
            overlay = template.find('.overlay'),
            player = $(_this).closest('.player-inner');

        //console.log(title);
        //console.log(description);

        if(dataAction === 'play'){
            Session.set('videoId', videoId);
            var mediaPlayer = $('#player'),
                detailsBlock = mediaPlayer.find('.video-details');
            detailsBlock.empty().append(
                title.clone().detach(),
                description.clone().detach()
            );

            initiateYTPlayer();

        } else if(dataAction === 'add'){

            var addFavourite = {
                title: title.text(),
                description: description.text(),
                thumbnail: thumb,
                videoId: videoId,
                userId: Meteor.user()._id,
                user: Meteor.user().profile.name || Meteor.user().emails[0].address,
                type: ytType
            };

            Meteor.call('addToFavourite', addFavourite, function(err, res){
               if(!err){
                   FlashMessages.sendSuccess('<i class="fa fa-heart"></i> Added to Favourites!');
               } else {
                   FlashMessages.sendError('<i class="fa fa-warning"></i> Error occurred, please try again!');
               }
            });
        } else if(dataAction == 'globe'){
            window.open(parent.find('.title-link').attr('href'), '_blank');
        }
    }
});

Template.favourites.events({
    'click .remove-fav': function(e, t){
        e.preventDefault();
        var trigger = $(e.currentTarget),
            dbID = trigger.closest('.video-wrapper').attr('data-dbid');

        Meteor.call('removeFavourite', dbID, function(err, res){
           err ? FlashMessages.sendError('<i class="fa fa-warning"></i> Error occurred, please try again!')
               : FlashMessages.sendSuccess('<i class="fa fa-check"></i> Successfully removed!');
        });
    }
});