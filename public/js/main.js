// sticky header

$(window).scroll(function() {
if ($(this).scrollTop() > 300){  
    $('header').addClass("sticky");
  }
  else{
    $('header').removeClass("sticky");
  }
});