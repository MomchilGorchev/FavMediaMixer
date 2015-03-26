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

/*
*   Gooey footer menu
*/
Template.footer.rendered = function(){

    var menuItems = $(".menu-item"),
        trigger = $(".menu-toggle-button"),
        toggleIcon = $(".menu-toggle-icon"),
        menuItemNum = menuItems.length,
        angle = 120,
        distance = 90,
        startingAngle = 180 + (-angle / 2),
        slice = angle / (menuItemNum - 1);
    TweenMax.globalTimeScale(0.8);

    menuItems.each(function(i){
        var _this = $(this),
            angle = startingAngle + (slice * i);
        _this.css({
            transform:"rotate("+ (angle) +"deg)"
        });
        _this.find(".menu-item-icon").css({
            transform:"rotate("+ (-angle) +"deg)"
        });
    });
    var on = false;

    trigger.mousedown(function(){
        TweenMax.to(toggleIcon, 0.1, {
            scale:0.65
        });
    });
    $(document).mouseup(function(){
        TweenMax.to(toggleIcon, 0.1, {
            scale:1
        })
    });
    $(document).on("touchend", function(){
        $(document).trigger("mouseup");
    });
    trigger.on("mousedown", pressHandler);
    trigger.on("touchstart", function(event){
        $(this).trigger("mousedown");
        event.preventDefault();
        event.stopPropagation();
    });

    function pressHandler(event){
        on= !on;
        TweenMax.to($(this).children('.menu-toggle-icon'),0.4,{
            rotation:on?45:0,
            ease:Quint.easeInOut,
            force3D:true
        });
        on ? openMenu() : closeMenu();

    }
    function openMenu(){
        menuItems.each(function(i){
            var delay= i * 0.08,
                _this = $(this),
                $bounce = _this.children(".menu-item-bounce");

            TweenMax.fromTo($bounce, 0.2, {
                transformOrigin:"50% 50%"
            }, {
                delay:delay,
                scaleX:0.8,
                scaleY:1.2,
                force3D:true,
                ease:Quad.easeInOut,
                onComplete:function(){
                    TweenMax.to($bounce, 0.15, {
                        //scaleX: 1.2,
                        scaleY: 0.7,
                        force3D: true,
                        ease: Quad.easeInOut,
                        onComplete: function(){
                            TweenMax.to($bounce, 3, {
                                //scaleX: 1,
                                scaleY: 0.8,
                                force3D: true,
                                ease: Elastic.easeOut,
                                easeParams: [1.1, 0.12]
                            });
                        }
                    });
                }
            });

            TweenMax.to(_this.children(".menu-item-button"), 0.5, {
                delay: delay,
                y: distance,
                force3D: true,
                ease: Quint.easeInOut
            });
        });
    }

    function closeMenu() {
        menuItems.each(function (i) {
            var delay = i * 0.08,
                _this = $(this),
                $bounce = _this.children(".menu-item-bounce");

            TweenMax.fromTo($bounce, 0.2, {
                transformOrigin: "50% 50%"
            }, {
                delay: delay,
                scaleX: 1,
                scaleY: 0.8,
                force3D: true,
                ease: Quad.easeInOut,
                onComplete: function () {
                    TweenMax.to($bounce, 0.15, {
                        //scaleX:1.2,
                        scaleY: 1.2,
                        force3D: true,
                        ease: Quad.easeInOut,
                        onComplete: function () {
                            TweenMax.to($bounce, 3, {
                                //scaleX:1,
                                scaleY: 1,
                                force3D: true,
                                ease: Elastic.easeOut,
                                easeParams: [1.1, 0.12]
                            });
                        }
                    });
                }
            });


            TweenMax.to(_this.children(".menu-item-button"), 0.3, {
                delay: delay,
                y: 0,
                force3D: true,
                ease: Quint.easeIn
            });
        });
    }
};

Template.favItem.rendered = function(){
    window.favouriteVideos = [];
    var videoIDs = $('.video-wrapper');
        $.each(videoIDs, function(key, item){
        var _this = $(this),
            videoId = _this.attr('data-videoid');
        favouriteVideos.push(videoId);
    });
};