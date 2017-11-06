var grid_view=true;

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

  //on item click; expand navigation, remove grid, load project
  $('header').on('click', '.menu_icon', function() {

  });

  //show tags on hover (only when in grid-view)
  $(".item").hover(function(){
    if(grid_view){
      $(this).find('.item_hidden').css("opacity", "1");
      $(this).find('.item_visible').css('filter','contrast(100%)');
    }
    }, function(){
    if(grid_view){
      $(this).find('.item_hidden').css("opacity", "0");
      $(this).find('.item_visible').css('filter','contrast(20%)');
    }
  });

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
    $('header').animate({height: '25vh'});
    $('#grid').animate({top: '25vh'});
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
    //show submenus
    $('.submenu').css('display','inline-block');
    $('.subsubmenu .'+chosen_project_category).css('display','inline-block');
    //remove, then add, highlights
    $('.horizmenu a').css('color','grey');
    $('.submenu .'+chosen_project_category).css('color','black');
    $('.subsubmenu .'+chosen_project_subcategory).css('color','black');

    //load project content

  });

  //selection in submenu
  $('.submenu').on('click', 'a', function() {
    grid_view=true;
    $('.item_hidden').css("opacity", "0");
    $('.item_visible').css('filter','contrast(20%)');
    chosen_project_category = $(this).attr('class');
    //hide all, then show correct subsubmenu
    $('.subsubmenu').children().css('display','none');
    $('.subsubmenu .'+chosen_project_category).css('display','inline-block');
    //remove, then add, highlights
    $('.horizmenu a').css('color','grey');
    $('.submenu .'+chosen_project_category).css('color','black');
    $('.subsubmenu .all').css('color','black');
    //remove all items from grid
    $('.item').hide();
    $('#grid div').removeClass('item');
    //add back items of chosen category
    $('#grid .'+chosen_project_category).addClass('item');
    $('#grid .'+chosen_project_category).show();
    //refresh layout
    $('#grid').masonry('reloadItems');
    $('#grid').masonry('layout');
  });

  //selection in subsubmenu
  $('.subsubmenu').on('click', 'a', function() {
    grid_view=true;
    $('.item_hidden').css("opacity", "0");
    $('.item_visible').css('filter','contrast(20%)');
    chosen_project_subcategory = $(this).attr('class');
    //remove, then add, highlights
    $('.subsubmenu a').css('color','grey');//#EDCB64 for yellow
    $('.subsubmenu .'+chosen_project_subcategory).css('color','black');
    //remove all items from grid
    $('.item').hide();
    $('#grid div').removeClass('item');
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
