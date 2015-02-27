Template._loginButtonsLoggedOutDropdown.rendered = function(){
    var loginDD = document.getElementById('login-dropdown-list'),
        ddLink = loginDD.querySelector('.dropdown-toggle'),
        linkText = ddLink.text;
    ddLink.innerHTML = '<i class="fa fa-user fa-2x"></i><span class="link-text">'+ linkText +'</span>';
};

Template._loginButtonsLoggedInDropdown.rendered = function(){
    var loginDD = document.getElementById('login-dropdown-list'),
        ddLink = loginDD.querySelector('.dropdown-toggle'),
        linkText = ddLink.text;
    ddLink.innerHTML = '<i class="fa fa-user fa-2x"></i><span class="link-text">'+ linkText +'</span>';
};