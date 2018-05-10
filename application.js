//global variables
var grid_view=true;
var mobile_view=false;
var menu_view=false;

//loading sequence for home-page: after everything loads
window.onload = function() {
  $('#grid').fadeIn(1000);
  $('.loading').fadeOut(500);
  //refresh layout
  $('#grid').masonry('reloadItems');
  $('#grid').masonry('layout');
};

//enabling js after page loads
$(document).ready(function() {

//querying for aspect ratio based on css sizing of header
  var hw = 100*parseInt($("header").width())/parseInt($(window).width());
  //alert('header width is: '+hw+'%');
  if(hw>81) { mobile_view=true;}

//masonry grid
  $(function(){
    $('#grid').masonry({
    // options
      itemSelector : '.item',
      columnWidth : '.grid-sizer',
      percentPosition: true
    });
  });

//menu
  //open menu on click
  $('header').on('click', '.menu_icon', function() {
    menu_view=true;
    $('.menu_open').fadeIn(300);//tint
    $('.menu_icon').fadeOut(500);
    $('.menu_container').fadeIn(1000);//content
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
        $('.lightbox').fadeOut(500);
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
  $('#grid').on('mousedown', '.item', function(event) {
    event.preventDefault();
    //for touchscreens...
    if($(this).find('.item_hidden').css("opacity")==0){
      $('.item_hidden').css("opacity", "0");
      $('.item_visible').css('filter','contrast(50%)');
      $(this).find('.item_hidden').css("opacity", "1");
      $(this).find('.item_visible').css('filter','contrast(100%)');
      return false;
    }
    //adjust positions for mobile_view
    if(mobile_view){
      $("header").animate({height: "29vh"});
      $("#grid").animate({top: "29vh"});
      $("#project-page").animate({top: "29vh"});
    }
    //remove hover content immediately
    grid_view=false;
    $(this).find('.item_hidden').css("opacity", "0");
    $(this).find('.item_visible').css('filter','contrast(50%)');
    $(window).scrollTop(0);
    //record the tags of chosen project (split index might get confused when classes are added & removed)
    var cat = $(this).attr('class');
    chosen_project = cat.split(" ")[0];
    chosen_project_category = cat.split(" ")[1];
    chosen_project_subcategory = cat.split(" ")[2];
    //remove grid elements except chosen one
    $(this).siblings().hide();
    $(this).siblings().removeClass('item');
    //refresh layout
    $('#grid').masonry('reloadItems');
    $('#grid').masonry('layout');
    //show correct subsubmenu
    $('.subsubmenu .'+chosen_project_category).css('display','inline-block');
    //remove, then add, highlights (including additional categories)
    $('.horizmenu a').css('color','grey');
    for (i=1; cat.split(" ")[i] != 'item'; i++) {
      $('.horizmenu .'+cat.split(" ")[i]).css('color','black');
    }
  //remove grid
    setTimeout(function(){ $('#grid').fadeOut(1000); }, 1000);
  //project: load external html
    setTimeout(function(){ $('#project-page').fadeIn(1000); }, 1000);
  //loading external html
    $.ajax({ url: 'projects/'+chosen_project+'.html',
            success: function(result) {
              $('#project-page').html(result);
              //shuffling with tags
              $('#project-page').on('click', '.tag', function(event) {
                event.preventDefault();
                var tag = $(this).attr('class').split(" ")[1];
                $('header').find('.'+tag).trigger("click");
              });
              //activate light boxes for images
              $('#project-page').on('click', '.lightboximg', function(event) {
                event.preventDefault();
                menu_view=true;
                $('.lightbox').fadeIn(500);//tint
                $('.menu_icon').fadeOut(500);
                //alert('image url is '+ $(this).attr('src') );
                $('.lightbox-target').find('img').attr('src', $(this).attr('src'));
                //exit icon is clicked
                $('.lightbox').on('click', '.exit', function(event) {
                  event.preventDefault();
                  $('.lightbox').fadeOut(500);
                  $('.menu_icon').fadeIn(500);
                  menu_view=false;
                });
                //that's all for now
              });
              //fade in images after each loads
              $(".lightboximg").load(function() {
                  alert('image loaded!');
                  //$(this).closest('figure').fadeIn(1000);
                  //$('.loading').fadeOut(500);
              });
            },
            error: function(request, errorType, errorMessage){
              alert('Error: '+errorType+', with message:'+errorMessage);
            }
    });//ajax
  });

//shuffling with submenu
  $('.submenu').on('click', 'a', function(event) {
    event.preventDefault();
    $(window).scrollTop(0);
    //remove all items from grid
    $('.item').hide();
    $('#grid div').removeClass('item');
    //show grid, remove project
    $('#project-page').fadeOut(500);
    $('#grid').fadeIn(1000);
    //adjust positions for mobile_view
    if(mobile_view){
      $("header").animate({height: "29vh"});
      $("#grid").animate({top: "29vh"});
      $("#project-page").animate({top: "29vh"});
      if(!grid_view){
        //refresh layout
        $('#grid').masonry('reloadItems');
        $('#grid').masonry('layout');
      }
    }
    grid_view=true;
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
  $('.subsubmenu').on('click', 'a', function(event) {
    event.preventDefault();
    $(window).scrollTop(0);
    //remove all items from grid
    $('.item').hide();
    $('#grid div').removeClass('item');
    //show grid, remove project
    $('#project-page').fadeOut(500);
    $('#grid').fadeIn(500);
    //adjust positions for mobile_view
    if(mobile_view){
      $("header").animate({height: "29vh"});
      $("#grid").animate({top: "29vh"});
      $("#project-page").animate({top: "29vh"});
      if(!grid_view){
        //refresh layout
        $('#grid').masonry('reloadItems');
        $('#grid').masonry('layout');
      }
    }
    grid_view=true;
    $('.item_hidden').css("opacity", "0");
    $('.item_visible').css('filter','contrast(50%)');
    chosen_project_subcategory = $(this).attr('class');
    //remove, then add, highlights
    $('.subsubmenu a').css('color','grey');//#EDCB64 for yellow
    $('.subsubmenu .'+chosen_project_subcategory).css('color','black');
    //add back items of chosen category
    if(chosen_project_subcategory=='all'){
      //alert('chosen project category is: '+chosen_project_category);
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
