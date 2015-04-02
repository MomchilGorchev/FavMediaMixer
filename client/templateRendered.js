
Template.home.rendered = function(){
    Session.set('x', ['x', 900, 1200, 1500, 1800, 2100]);
    Session.set('data1', ['data1', 30, 200, 100, 400, 150]);
    Session.set('data2', ['data2', 20, 180, 240, 100, 190]);
    Session.set('System Health', 100);

    var usageChart = c3.generate({
        bindto: this.find('#usage-chart'),
        data: {
            xs: {
                'data1': 'x',
                'data2': 'x'
            },
            columns: [['x'],['data1'],['data2']]
        }
    });

    var healthChart = c3.generate({
        bindto: this.find('#health-chart'),
        data: {
            columns: [
                ['System Health', 100]
            ],
            type: 'gauge'
        },
        size: {
            height: 180
        }
    });

    this.autorun(function (tracker) {
        usageChart.load({columns: [
            Session.get('x'),
            Session.get('data1'),
            Session.get('data2'),
            []
        ]});
        healthChart.load({columns: [
            Session.get('System Health')
        ]});
    });
};

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
    var videos = Favourites.find().fetch(),
        videosCount = videos.length,
        i = null;
    for (i = 0; i < videosCount; i++){
        var _this = videos[i],
            videoId = _this.videoId;
        favouriteVideos.push(videoId);
    }
    favouriteVideos.reverse();
};