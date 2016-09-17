'use strict';

(function() {
  window.jQuery = window.$ = require('jquery');
  window.Velocity = $.Velocity = require('velocity-animate');

  function initializeStickyHeader() {
    function getScroll () {
      var b = document.body;
      var e = document.documentElement;
      return {
        left: parseFloat(window.pageXOffset || b.scrollLeft || e.scrollLeft),
        top: parseFloat(window.pageYOffset || b.scrollTop || e.scrollTop)
      };
    }

    var header = $('header.header');
    header.data('position', header.position());

    $(window).scroll(function() {
      var position = header.data('position'),
          scroll = getScroll();

      if (position.top < scroll.top) {
        header.addClass('fixed');
      } else {
        header.removeClass('fixed');
      }
    });
  }

  function initializeHeroAnimation() {
    var backLayer = $('.back-layer'),
        frontLayer = $('.front-layer');

    backLayer.velocity({ opacity: [1, 0] }, { display: 'block', duration: 2000 });
    frontLayer.velocity({ opacity: [1, 0] }, { display: 'block', duration: 2000 });
    backLayer.velocity({ scale: [1.1, 1.2], translateZ: 0, translateX: [0, 20] }, { easing: 'easeOutQuart', duration: 6000, queue: false });
    frontLayer.velocity({ scale: [1.1, 1], translateZ: 0, translateX: [0, -40] }, { easing: 'easeOutQuart', duration: 6000, queue: false });
  }

  $(function() {
    // initializeStickyHeader();
    // $(window).load(function() {
    //   initializeHeroAnimation();
    // });
  });
})();
