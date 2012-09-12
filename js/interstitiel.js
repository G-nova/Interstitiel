/**
 * Object init
 */
Drupal.settings.interstitiel = Drupal.settings.interstitiel || {}
Drupal.interstitiel = Drupal.interstitiel || {}

Drupal.interstitiel.block_interstitiel = function(element) {
  element
    .addClass('block-interstitiel-processed')
	var path = window.location.pathname;
	var hostname = window.location.hostname;
	
	if(path.charAt(0) == "/") {
		path = path.substring(1);
	}
	if(path == "") {
		path = '<front>';
	}
  jQuery.ajax({
	    type: 'GET',
	    url: '/ajax/interstitiel/' + encodeURIComponent(path),
	    dataType: 'json',
	    success: function (data) {
	      if(data.display != ""){
	      	var cookie = $.cookie(hostname + "-interstitiel-" + data.ad);
	      	var display = true;

	      	if(cookie == null) {
	      		cookie = data.display;
	      	}
	      	else {
	      		if(cookie == '') { // Ad not exist yet
	      		  display = true;
	      		}
	      		else if(cookie != data.display) { // Display change
	      		  display = true;
	      		}
	      		else if( data.display == 'first') { // First display only. Doesn't display it
	      		  display = false;
	      		}
	      		else if (data.display == 'all') {
	      			display = true;
	      		}
	      		
	      		cookie = data.display;
	      		
	      	}
	      	
	      	if(display) {
		      	$.cookie(hostname + "-interstitiel-" + data.ad, cookie, { expires: 1, path: '/' });
		        $("#interstitiel_fenetre").append(data.html).closest("#block_interstitiel").fadeIn().delay(5000).fadeOut(500, function(){
				  $("html").css({
		          	'overflow':'visible'
		          });
				  	});
		        $("html").css({
		        	'overflow':'hidden'
		        });
		      }
	      }
	    },
	    error: function (xmlhttp) {}
	});

  $("#block_interstitiel").find('.close').live('click', function(){
  	$("#block_interstitiel").dequeue().stop().fadeOut(function(){
  		$("html").css({
      	'overflow':'visible'
      });
  	});
  });
  
  $("#block_interstitiel").find('.node').mouseleave(function(){
  	$("#block_interstitiel").click(function(){
	  	$("#block_interstitiel").dequeue().stop().fadeOut(function(){
	  		$("html").css({
        	'overflow':'visible'
        });
	  	});
	  });
  });
$('#iframefake').load('/');
} // Drupal.interstitiel.block_interstitiel

Drupal.behaviors.interstitiel = function(context) {
  $('#block_interstitiel:not(.block-interstitiel-processed)', context).each(function(){
    Drupal.interstitiel.block_interstitiel($(this));
  });
}