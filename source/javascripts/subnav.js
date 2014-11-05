$(document).ready(function() {

    $('a.scroll').click(function(event){
    event.preventDefault();
    var target = $(this).attr('href');
    if ( $(target).length ) {
      $('html, body').animate({
        scrollTop: $( target ).offset().top
      }, 1000);
    };
  });

  $('#mainsubnav a').click(function(event){
    event.preventDefault();
    var target = $(this).attr('href');
    var target_position = 0;

    if ( $(target).length ) {

      if ($('#mainsubnav').hasClass('subNavfixed')) {
        target_position = $( target ).offset().top - 60;
      } else {
        target_position = $( target ).offset().top - 120;
      }

      $('html, body').animate({
        scrollTop: target_position
      }, 1000);
    };
  });

  var navpos = $('#mainsubnav').offset();
  console.log(navpos.top);
    $(window).bind('scroll', function() {
      if ($(window).scrollTop() > navpos.top) {
        $('#mainsubnav').addClass('subNavfixed');
       }
       else {
        $('#mainsubnav').removeClass('subNavfixed');
        $("#mainsubnav a").removeClass("active");
       }
    });

    $("#mainsubnav a").click(function(){
      $("#mainsubnav a").removeClass("active");
      $(this).addClass("active");
    });
});