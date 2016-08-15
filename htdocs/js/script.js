$(function() {

  $('.menu-trigger').click(function(){

    $('.menu-trigger').toggleClass('active');
    $(".main-navi").slideToggle();
    return false;

  });

  $(window).resize(function(){
  var win = $(window).width();
  var p = 1080;
  if(win > p){
    $(".nav-toggle").hide();
    $(".main-navi").show();
    $('.menu-trigger').removeClass('active');
  } else {
    $(".nav-toggle").show();
    $(".main-navi").hide();
  }
});


});
