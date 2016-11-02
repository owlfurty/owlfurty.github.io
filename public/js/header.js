// Responsive Header

$(document).ready(function($){
  //move nav element position according to window width
  moveNavigation();
  $(window).on('resize', function(){
    (!window.requestAnimationFrame) ? setTimeout(moveNavigation, 300) : window.requestAnimationFrame(moveNavigation);
  });

  //mobile version - open/close navigation
  $('.pt-nav-trigger').on('click', function(event){
    event.preventDefault();
    if($('header').hasClass('nav-is-visible')) $('.moves-out').removeClass('moves-out');
    
    $('header').toggleClass('nav-is-visible');
    $('.pt-main-nav').toggleClass('nav-is-visible');
    $('.pt-main-content').toggleClass('nav-is-visible');
  });

  //mobile version - go back to main navigation
  $('.go-back').on('click', function(event){
    event.preventDefault();
    $('.pt-main-nav').removeClass('moves-out');
  });

  //open sub-navigation
  $('.pt-subnav-trigger').on('click', function(event){
    event.preventDefault();
    $('.pt-main-nav').toggleClass('moves-out');
  });

  function moveNavigation(){
    var navigation = $('.pt-main-nav-wrapper');
      var screenSize = checkWindowWidth();
        if ( screenSize ) {
          //desktop screen - insert navigation inside header element
      navigation.detach();
      navigation.insertBefore('.pt-nav-trigger');
    } else {
      //mobile screen - insert navigation after .pt-main-content element
      navigation.detach();
      navigation.insertAfter('.pt-main-content');
    }
  }

  function checkWindowWidth() {
    var mq = window.getComputedStyle(document.querySelector('header'), '::before').getPropertyValue('content').replace(/"/g, '').replace(/'/g, "");
    return ( mq == 'mobile' ) ? false : true;
  }
});