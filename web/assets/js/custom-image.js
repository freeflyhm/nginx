/*=============================================================
    Authour URI: www.binarytheme.com
    License: Commons Attribution 3.0

    http://creativecommons.org/licenses/by/3.0/

    100% To use For Personal And Commercial Use.
    IN EXCHANGE JUST GIVE US CREDITS AND TELL YOUR FRIENDS ABOUT US
   
    ========================================================  */

(function ($) {
    "use strict";
    var mainApp = {


        plusMain: function () {

            //FUNCTION TO SCROLL BETWEEN LEFT MENU LINKS
            $(function () {
                $('nav a').bind('click', function (event) {
                    var $anchor = $(this);

                    $('html, body').stop().animate({
                        scrollTop: $($anchor.attr('href')).offset().top
                    }, 1000, 'easeInOutExpo');
                    /*
                    if you don't want to use the easing effects:
                    $('html, body').stop().animate({
                        scrollTop: $($anchor.attr('href')).offset().top
                    }, 1000);
                    */
                    event.preventDefault();
                });
            });


            // MAIN FUNTION FOR TRIGGER LEFT MENU


            $('.Icon-trigger span').click(function () {
                if (
            $('.left-panel').css('left') == '-160px') {
                    $('.left-panel').animate({ left: '0px' });
                }
                else
                    $('.left-panel').animate({ left: '-160px' });
            });

            /** VEGAS BACKGROUND  IMAGE  **/
            $(function () {
                $.vegas('slideshow', {
                    backgrounds: [
                      { src: 'assets/img/4.jpg' }
                      //CHANGE THIS IMAGE WITH YOUR ORIGINAL IMAGE
                        //THIS IMAGE ARE FOR DEMO PURPOSE ONLY, YOU CAN NOT USE THEM WITHOUT AUTHORS PERMISSION
                         //SEE DOCUMENTATION FOR ORIGINAL URLs/LINKs OF IMAGE                         
                    ]
                })('overlay', {
                    /** SLIDESHOW OVERLAY IMAGE **/
                    src: 'assets/plugins/vegas/overlays/01.png' // THERE ARE TOTAL 01 TO 15 .png IMAGES AT THE PATH GIVEN, WHICH YOU CAN USE HERE
                });


            });

            /*
            YOU CAN WRITE 
            YOUR SCRIPTS HERE
            
            */



        },

        initialization: function () {
            mainApp.plusMain();

        }


    }
    // INITIALIZING ///

    $(document).ready(function () {
        var service;

        mainApp.plusMain();

        // get 本地储存
        if (window.localStorage && window.localStorage.service) {
            service = JSON.parse(window.localStorage.service);
            if (moment().add(-1, 'd').format('YYYY-MM-DD') === service.date) {
                //console.log('localStorage');
                $('#what-day').text(service.date);
                $('#day-number').text(service.companys);
                $('#minute-number').text(service.sms);
                $('#second-number').text(service.peoples);

                // #loading fadeOut
                $('#loading').fadeOut();
                // #counter-default show
                $('#counter-default').removeClass('hiddenbk');

                // 检查服务器
                // 算了，这里还是有漏洞

                return;
            }
        }

        // 向服务器秒速请求数据 getbigsum
        //$.get('http://47.88.100.75:8080/getbigsum', function(obj){
        $.get('http://192.168.99.100:8080/getbigsum', function(obj){
        //$.get('http://120.24.48.192:8080/getbigsum', function(obj){
            $('#what-day').text(obj.date);
            $('#day-number').text(obj.companys);
            $('#minute-number').text(obj.sms);
            $('#second-number').text(obj.peoples);

            // set 本地储存
            // {"date":"2016-05-28","companys":173,"sms":16310,"peoples":282733}
            if (window.localStorage) {
                localStorage.setItem('service', JSON.stringify(obj));
            }

            // #loading fadeOut
            $('#loading').fadeOut();
            // #counter-default show
            $('#counter-default').removeClass('hiddenbk');
        });
        
    });


}(jQuery));


