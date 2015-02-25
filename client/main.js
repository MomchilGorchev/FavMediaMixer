var handleFeed;
Meteor.startup(function(){
    handleFeed = function(res){

        var resultBox = document.getElementById('result-box'), resultList, buffer = [];

        for(var i = 0; i < res.length; i++){
            var current = '<li>'+ res[i] +'</li>';
            buffer.push(current);
        }
        resultList = document.createElement('ul');
        resultList.innerHTML = buffer;

        resultBox.appendChild(resultList);

        console.log(res);
    };
});


Template.home.events({
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
            searchField = template.find('#autocomp-field');

        Meteor.call('getYtList', dataSource, function(err, res){
            if(!err){
                searchField.value = searchedTitle;
                res = $.parseJSON(res);
                var items = res.items;
                for (var i = 0; i < items.length; i++){

                    //TODO implement response display
                    console.log(items[i]);

                    var snippet = items[i].snippet,
                        current =
                            '<li class="video-wrapper" data-playing="false" data-videoId="'+ items[i].id.videoId +'"><img class="video-thumb" src="'+ snippet.thumbnails.default.url +'">' +
                                '<a href="https://www.youtube.com/watch?v='+ items[i].id.videoId +'" class="title-link" target="_blank">'+ snippet.title +'</a>'+
                                '<p class="description">'+ snippet.description +'</p>'+
                                '<ul class="video-actions">' +
                                    '<li class="favourite" data-action="add"><i class="fa fa-plus"></i></li>' +
                                    '<li class="favourite" data-action="play"><i class="fa fa-play"></i></li>' +
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
        var _this = event.currentTarget,
            dataAction = _this.getAttribute('data-action'),
            parent = $(_this).closest('.video-wrapper'),
            videoId = parent.attr('data-videoId'),
            dataState = parent.attr('data-playing'),
            overlay = template.find('.overlay');

        if(dataAction === 'play'){
            if(dataState === 'false'){
                var src = 'https://www.youtube.com/embed/'+ videoId,
                    iframe = document.createElement('iframe');
                iframe.setAttribute('src', src);
                $(overlay).addClass('open').find('.content').append([
                        parent.find('.title-link').clone().detach(),
                        parent.find('.description').clone().detach(),
                        iframe
                    ]
                );
            }
        }
    },

    'click .overlay-close': function(event, template){
        $('.overlay').removeClass('open').find('.content').empty();
    }

});