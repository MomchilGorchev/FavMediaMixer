Template.drive.events({
    'click #get-contents': function(event, template){
        event.preventDefault();
        Meteor.call('getDriveContents', function(err, res){
            if(err){
                console.log(err);
            } else {
                console.log(res);
                for(var i = 0; i < res.items.length; i++ ){
                    var curr = res.items[i];
                    var file = document.createElement('div');
                    file.innerHTML = curr.originalFilename;
                    file.style.background = '#f3f3f3 url('+ curr.iconLink +') no-repeat center center';
                    document.body.appendChild(file);
                }

            }


        });
    }
});