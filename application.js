//function for parsing url for parameters (taken from http://jennamolby.com/how-to-display-dynamic-content-on-a-page-using-url-parameters/)
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//global variables
var grid_view=true;
var mobile_view=false;
var menu_view=false;
var animation_on = false;
var current_image;
var dynamic_project = getParameterByName('project');//decide content of page based on url
var dynamic_filter = getParameterByName('filter');

//loading sequence for home-page: after everything loads
window.onload = function() {
  $('.logo').fadeIn(1000);
  $('.loading').fadeOut(500);
  //refresh layout
  $('#grid').masonry('reloadItems');
  $('#grid').masonry('layout');
};

//enabling js after page loads
$(document).ready(function() {
  //object for hammer
  var lbox = document.getElementsByClassName("lightbox");

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
	//loading sequence: show images after they load
	var gridObj = document.getElementById("grid");
	var imgArray = gridObj.getElementsByTagName("img");
	for (var j=0; j<imgArray.length; j++) {
		if(imgArray[j].complete) {//check if it's already in cache
			$(imgArray[j]).fadeIn(500);
			//refresh layout
		  $('#grid').masonry('layout');
		}
		else {//do same on load
			$(imgArray[j]).on('load', function(){
				$(this).fadeIn(500);
				//refresh layout
			  $('#grid').masonry('layout');
			});
		}
	}

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
    if($(this).find('.item_hidden').css("opacity")==0 && dynamic_project==null){
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
    //update url
    window.history.pushState('','','?project='+chosen_project);
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
              //loading sequenc: as each image loads
              var imgDefer = document.getElementsByClassName('lightboximg');
              var imgsloaded =0;
              if(imgDefer.length>0){//loading animation instead of logo
                $('.logo').fadeOut(500);
                $('.loading').fadeIn(500);
              }
              for (var i=0; i<imgDefer.length; i++) {
                if(imgDefer[i].complete) {//check if it's already in cache
                  $(imgDefer[i]).closest('figure').addClass('lightboxfig_active');
                  $(imgDefer[i]).fadeIn(500);
                  imgsloaded++;
									//alert('cached image number: '+i);
                  if(imgsloaded==imgDefer.length){
                    $('.logo').fadeIn(500);
                    $('.loading').fadeOut(500);
                  }
                }
                else {//do same on load
                  $(imgDefer[i]).on('load', function(){
                    $(this).closest('figure').addClass('lightboxfig_active');
                    $(this).fadeIn(500);
                    imgsloaded++;
										//alert('just loaded image number: '+i);
                    if(imgsloaded==imgDefer.length){
                      $('.logo').fadeIn(500);
                      $('.loading').fadeOut(500);
                    }
                  });
                }
              }
							//in case image loading goes takes > 30s
            	setTimeout(function(){$('.logo').fadeIn(500); $('.loading').fadeOut(500); $('.colp2').find('figure').addClass('lightboxfig_active');}, 30000);
              //shuffling with tags
              $('#project-page').on('click', '.tag', function(event) {
                event.preventDefault();
                var tag = $(this).attr('class').split(" ")[1];
                $('header').find('.'+tag).trigger("click");
              });
            //activate light box for images
              $('#project-page').on('click', '.lightboximg', function(event) {
                event.preventDefault();
                current_image = $(this);
                menu_view=true;
                $('.lightbox').fadeIn(500);//tint
                $('.menu_icon').fadeOut(500);
                $('.lightbox-target').find('img').attr('src', $(current_image).attr('src'));
                //exit icon is clicked
                $('.lightbox').on('click', '.exit', function(event) {
                  event.preventDefault();
                  $('.lightbox').fadeOut(500);
                  $('.menu_icon').fadeIn(500);
                  menu_view=false;
                });
                //insert content in counter & caption
                $('.counter').text($(".lightboximg").index($(this))+1+'/'+$(".lightboximg").length);
                $('.lightbox-target').find('figcaption').text($(current_image).closest('figure').find('figcaption').text());
                //left-arrow is clicked
                $('.lightbox').on('click', '.left-arrow', function(event) {
                  if(!animation_on){
                    animation_on=true;
                    event.preventDefault();
                    //alert('current index is: '+$(".lightboximg").index($(current_image)));
                    if($(current_image).closest('figure').prev('.lightboxfig_active').length>0){
                      current_image=$(current_image).closest('figure').prev('.lightboxfig_active').find('img');
                      $('.counter').text($(".lightboximg").index($(current_image))+1+'/'+$(".lightboximg").length);
                    }
                    else {
                      current_image=$(".colp2").find('.lightboxfig_active:last').find('img');
                      $('.counter').text($(".lightboximg").length+'/'+$(".lightboximg").length);
                    }
                    $(".lightbox-target").animate({left: '90vw'}, 'slow', function() {
                      $('.lightbox-target').find('img').attr('src', $(current_image).attr('src'));
                      $('.lightbox-target').find('figcaption').text($(current_image).closest('figure').find('figcaption').text());
                      $(".lightbox-target").css('left','-90vw');
                    });
                    $(".lightbox-target").animate({left: '10vw'}, 'slow', function() {
                      animation_on=false;
                    });
                  }
                });
                //right-arrow is clicked
                $('.lightbox').on('click', '.right-arrow', function(event) {
                  if(!animation_on){
                    animation_on=true;
                    event.preventDefault();
                    //alert('index is: '+$(".lightboximg").index($(current_image)));
                    if($(current_image).closest('figure').next('.lightboxfig_active').length>0){
                      current_image=$(current_image).closest('figure').next('.lightboxfig_active').find('img');
                      $('.counter').text($(".lightboximg").index($(current_image))+1+'/'+$(".lightboximg").length);
                    }
                    else {
                      current_image=$(".colp2").find('.lightboxfig_active:first').find('img');
                      //alert('current image is at: '+$(current_image).attr('src'));
                      $('.counter').text('1/'+$(".lightboximg").length);
                    }
                    $(".lightbox-target").animate({left: '-90vw'}, 'slow', function() {
                      $('.lightbox-target').find('img').attr('src', $(current_image).attr('src'));
                      $('.lightbox-target').find('figcaption').text($(current_image).closest('figure').find('figcaption').text());
                      $(".lightbox-target").css('left','90vw');
                    });
                    $(".lightbox-target").animate({left: '10vw'}, 'slow', function() {
                      animation_on=false;
                    });
                  }
                });
                //arrow keys
                $(document).keydown(function(event) {
                  if(event.which==37){
                    $('.lightbox').find('.left-arrow').trigger("click");
                  }
                  else if(event.which==39){
                    $('.lightbox').find('.right-arrow').trigger("click");
                  }
                });
                //swipe events for touchscreen
                Hammer(lbox[0]).on("swipeleft", function() {
                  $('.lightbox').find('.right-arrow').trigger("click")
                });
                Hammer(lbox[0]).on("swiperight", function() {
                  $('.lightbox').find('.left-arrow').trigger("click")
                });
              });
            //that's all with ajax for now
            },
            error: function(request, errorType, errorMessage){
              alert('Error: '+errorType+', with message:'+errorMessage);
            }
    });//ajax
  });
  //check for extended url, and open projects/filters
  if(dynamic_project != null) {
    $('#grid').find('.'+dynamic_project).trigger("mousedown");
  }

//shuffling with submenu
  $('.submenu').on('click', 'a', function(event) {
    event.preventDefault();
		$('#project-page').html('');
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
		//update url.
    window.history.pushState('','','index.html?filter='+chosen_project_category);
    $('.logo').fadeIn(500);
    $('.loading').fadeOut(500);
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
		$('#project-page').html('');
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
		//update url
		window.history.pushState('','','index.html?filter='+chosen_project_category+chosen_project_subcategory);
		$('.logo').fadeIn(500);
		$('.loading').fadeOut(500);
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

	//check for extended url, and activate filter
	if(dynamic_filter != null) {
		var dynamic_subcat;
		if(dynamic_filter.indexOf('arch')>=0){
			$('.submenu').find('.arch').trigger('click');
			dynamic_subcat=dynamic_filter.substring(4);
		}
		else if(dynamic_filter.indexOf('design')>=0){
			$('.submenu').find('.design').trigger('click');
			dynamic_subcat=dynamic_filter.substring(6);
		}
		else {
			$('.submenu').find('.film').trigger('click');
			dynamic_subcat=dynamic_filter.substring(4);
		}
		$('.subsubmenu').find('.'+dynamic_subcat).trigger('click');
  }

});//full dom code
