$(document).ready(function() {
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