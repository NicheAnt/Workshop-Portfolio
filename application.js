var grid_view=true;
var mobile_view=true;
var project_view=false;
var menu_view=false;

//loading sequence for home-page: after everything loads
window.onload = function() {
  $('#grid').fadeIn(1000);
  $('.loader').fadeOut(1000);
  //refresh layout
  $('#grid').masonry('reloadItems');
  $('#grid').masonry('layout');
};

$(document).ready(function() {//enabling js after page loads

//masonry grid
  $(function(){
    $('#grid').masonry({
    // options
      itemSelector : '.item',
      columnWidth : '.grid-sizer',
      percentPosition: true
    });
  });

  //querying for aspect ratio
  var hhr = 100*parseInt($("header").height())/parseInt($(window).height());
  if(hhr>16) { mobile_view=false; }

//menu
  //open menu on click
  $('header').on('click', '.menu_icon', function() {
    menu_view=true;
    $('.menu_open').fadeIn(300);//tint
    $('.menu_icon').fadeOut(500);
    $('.menu_container').fadeIn(1000);//content
    //replace logo with white one in foreground
    //fade in menu items
  });
  //exit menu; 1.escape key is pressed
  $(document).keydown(function(event) {
    if (menu_view==true){
      if(event.which==27){
        menu_view=false;
        $('.menu_container').fadeOut(300);
        $('.menu_open').fadeOut(500);
        $('.menu_icon').fadeIn(1000);
      }
    }
  });
  //2.exit icon is clicked
  $('.menu_container').on('click', '.exit_icon', function() {
    if (menu_view==true){
      menu_view=false;
      $('.menu_container').fadeOut(300);
      $('.menu_open').fadeOut(500);
      $('.menu_icon').fadeIn(1000);
    }
  });

//hover-tags (only when in grid-view)
  $(".item").hover(function(){
    if(grid_view){
      $(this).find('.item_hidden').css("opacity", "1");
      $(this).find('.item_visible').css('filter','contrast(100%)');
    }
    }, function(){
    if(grid_view){
      $(this).find('.item_hidden').css("opacity", "0");
      $(this).find('.item_visible').css('filter','contrast(50%)');
    }
  });

//project page
  //initialize global variables of chosen project
  var chosen_project = 'proj1';
  var chosen_project_category = 'arch';
  var chosen_project_subcategory = 'interior';
  //on item click; expand navigation, remove grid, load project
  $('#grid').on('click', '.item', function() {
    grid_view=false;
    //remove hover content immediately
    $(this).find('.item_hidden').css("opacity", "0");
    $(this).find('.item_visible').css('filter','contrast(100%)');
    //pull down header
    if(mobile_view){
      $('header').animate({height: '21vh'});
      $('#grid').animate({top: '25vh'});
      $('#grid').css('left','8vw');
    }
    else {
      $('header').animate({height: '28vh'});
      $('#grid').animate({top: '40vh'});
      $('#grid').css('left','8vw');
    }
    //record the tags of chosen project (split index might get confused when classes are added & removed)
    chosen_project = $(this).attr('class').split(" ")[0];
    chosen_project_category = $(this).attr('class').split(" ")[1];
    chosen_project_subcategory = $(this).attr('class').split(" ")[2];
    //remove grid elements except chosen one
    $(this).siblings().hide();
    $(this).siblings().removeClass('item');
    //refresh layout
    $('#grid').masonry('reloadItems');
    $('#grid').masonry('layout');
    //show correct subsubmenu
    $('.subsubmenu .'+chosen_project_category).css('display','inline-block');
    //remove, then add, highlights
    $('.horizmenu a').css('color','grey');
    $('.submenu .'+chosen_project_category).css('color','black');
    $('.subsubmenu .'+chosen_project_subcategory).css('color','black');
    //remove grid
    $('#grid').fadeOut(2000);
    //project: load external html
    $('#project-page').fadeIn(2000);
    //loading external html
    $.ajax({ url: 'projects/'+chosen_project+'.html',
            success: function(result) {
              $('#project-page').html(result);
              project_view=true;
            },
            error: function(request, errorType, errorMessage){
              alert('Error: '+errorType+', with message:'+errorMessage);
            }
    });//ajax
  });

//shuffling with submenu
  $('.submenu').on('click', 'a', function() {
    //remove all items from grid
    $('.item').hide();
    $('#grid div').removeClass('item');
    //show grid, remove project
    $('#project-page').fadeOut(500);
    $('#grid').fadeIn(500);
    grid_view=true;

    //pull down header
    if(mobile_view){
      $('header').animate({height: '21vh'});
      $('#grid').animate({top: '23vh'});
      $('#grid').css('left','5vw');
    }
    else {
      $('header').animate({height: '28vh'});
      $('#grid').animate({top: '35vh'});
      $('#grid').css('left','5vw');
    }
    $('.item_hidden').css("opacity", "0");
    $('.item_visible').css('filter','contrast(50%)');
    chosen_project_category = $(this).attr('class');
    //hide all, then show correct subsubmenu
    $('.subsubmenu').children().css('display','none');
    $('.subsubmenu .'+chosen_project_category).css('display','inline-block');
    //remove, then add, highlights
    $('.horizmenu a').css('color','grey');
    $('.submenu .'+chosen_project_category).css('color','black');
    $('.subsubmenu .all').css('color','black');
    //add back items of chosen category
    $('#grid .'+chosen_project_category).addClass('item');
    $('#grid .'+chosen_project_category).show();
    //refresh layout
    $('#grid').masonry('reloadItems');
    $('#grid').masonry('layout');
  });

//shuffling with subsubmenu
  $('.subsubmenu').on('click', 'a', function() {
    //remove all items from grid
    $('.item').hide();
    $('#grid div').removeClass('item');
    //show grid, remove project
    $('#project-page').fadeOut(500);
    $('#grid').fadeIn(500);
    grid_view=true;

    //pull down header
    if(mobile_view){
      $('header').animate({height: '21vh'});
      $('#grid').animate({top: '23vh'});
      $('#grid').css('left','5vw');
    }
    else {
      $('header').animate({height: '28vh'});
      $('#grid').animate({top: '35vh'});
      $('#grid').css('left','5vw');
    }
    $('.item_hidden').css("opacity", "0");
    $('.item_visible').css('filter','contrast(50%)');
    chosen_project_subcategory = $(this).attr('class');
    //remove, then add, highlights
    $('.subsubmenu a').css('color','grey');//#EDCB64 for yellow
    $('.subsubmenu .'+chosen_project_subcategory).css('color','black');
    //add back items of chosen category
    if(chosen_project_subcategory=='all'){
      $('#grid .'+chosen_project_category).addClass('item');
      $('#grid .'+chosen_project_category).show();
    }
    else{
      $('#grid .'+chosen_project_subcategory).addClass('item');
      $('#grid .'+chosen_project_subcategory).show();
    }
    //refresh layout
    $('#grid').masonry('reloadItems');
    $('#grid').masonry('layout');
  });

});//full code
