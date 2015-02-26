Template.header.rendered = function(){
    var loginDD = $('#login-dropdown-list'),
        ddLink = loginDD.find('.dropdown-toggle'),
        linkText = ddLink.text(),
        newText = '<i class="fa fa-user fa-2x"></i><span class="link-text">'+ linkText +'</span>';
    ddLink.html(newText);
};