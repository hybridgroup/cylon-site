$(document).ready(function(){

    var allPanels = $('.accordion-docs > dd').hide();
    
  $('.accordion-docs > dt > a').click(function() {
    if($(this).parent().next().is(':visible')){
      return false;
    }
    allPanels.slideUp();
    $(this).parent().next().slideDown();
    $(".accordion-docs > dt > a > img").removeClass("rotate");
    $(this).next().children().addClass("rotate");
    $(this).children().addClass("rotate");
    return false;
  });

  $(".active-panel").slideDown();

});