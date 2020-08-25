jQuery(document).ready(function($){

	// Add a class for styles if is the wp activation page
	if ($('.wp-activate-container')[0]) {
		$('body').addClass('activation-page');
		//console.log('hi');
	}

	$(window).on('load', function(){
		var window_top_scroll = $(window).scrollTop();
		var siteHeader = $('#site-header:not(.sticky)');
		var siteHeaderHeight = siteHeader.outerHeight();
		var wpBarHeight = $('#wpadminbar').outerHeight();

		//sticky Header
		function setStickyHeader(scrollpos, ele) {
			if(scrollpos > ele){
				siteHeader.addClass('sticky');
			} else {
				siteHeader.removeClass('sticky');
			}
		}

		if($('#site-header').hasClass('site-header-sticky')){

			if($('#site-header').hasClass('site-header-sticky') && $('body').hasClass('admin-bar')){
				$('#site-header').css('top', wpBarHeight);
			}

			if($('#mobile-nav-btn').hasClass('mmenu-toggle')){
				$('#site-header').addClass('mm-fixed-top');
			}

			$('#site-header-placeholder').css('height', siteHeaderHeight);
			$('#site-header-placeholder').css('display', 'block');

			setStickyHeader(window_top_scroll, siteHeaderHeight);

			$(window).scroll(function() {
				window_top_scroll = $(window).scrollTop();
				setStickyHeader(window_top_scroll, siteHeaderHeight);
			});

			$(window).resize(function(){
				siteHeaderHeight = siteHeader.outerHeight();
				wpBarHeight = $('#wpadminbar').outerHeight();
				$('#site-header-placeholder').css('height', siteHeaderHeight);
				$('#site-header').css('top', wpBarHeight);
				setStickyHeader(window_top_scroll, siteHeaderHeight);
			});
		}

		//mmenu handling update
		if($('#mobile-nav-btn').hasClass('mmenu-toggle')) {
			$(function() {
				$('#mobile-menu').mmenu({
					classes: "mm-light"
				});
			});
			$("#mobile-nav-btn").click(function() {
				$("#mobile-menu").removeClass("hidden").trigger("open.mm");
				if($('body').hasClass('admin-bar')) {
					$('#mobile-menu').css('top', wpBarHeight);
				}
			});
		}

		if($('body').hasClass('admin-bar')) {
			$('#wpadminbar').css('position', 'fixed');
		}

		// Custom show / hide back to top button
		// Added by: DT
		if($('#back-to-top').hasClass('btn')){
			$(window).scroll(function() {
				var window_top_scroll = $(window).scrollTop();
				if(window_top_scroll > 150){
					$('#back-to-top').addClass('visible');
				} else {
					$('#back-to-top').removeClass('visible');
				}
			});
		}

		function checkTableWidth(table) {
			if (table.outerWidth() > table.parent().outerWidth()) {
				table.data('scrollWrapper').addClass('has-scroll');
			} else if(table.data('scrollWrapper')) {
				table.data('scrollWrapper').removeClass('has-scroll');
			}
		}

		// responsive tables
		function responsiveTables() {
			$('table').each(function() {
				var element = $(this).filter(':visible');
				if(element.css('display') !== 'none' || typeof element.css('display') !== undefined) {
					// Create the wrapper element
					var scrollWrapper = $('<div />', {
						'class': 'scrollable',
						'html': '<div />' // The inner div is needed for styling
					}).insertBefore(element);

					// Store a reference to the wrapper element
					element.data('scrollWrapper', scrollWrapper);

					// Move the scrollable element inside the wrapper element
					element.appendTo(scrollWrapper.find('div'));

					// Check if the element is wider than its parent and thus needs to be scrollable
					checkTableWidth(element);

					// When the viewport size is changed, check again if the element needs to be scrollable
					$(window).on('resize orientationchange', function() {
						checkTableWidth(element);
					});
				}
			});
		}
		responsiveTables();
		// run responsive tables after accordion is displayed
		$(document).on("afterShow.vc.accordion", responsiveTables);

	});

	// site search modal global popup
	$('.site-nav-search').click(function(){
		$('#searchModal').modal('show');
	});

	// tooltip
	$('[data-toggle="tooltip"]').tooltip();


	function focus_input(current_modal) {
		if (current_modal) {
			$(current_modal).find('input').focus();
		} else {
			$('#searchModal').find('input').focus();
		}
	}

	$('form[role="search"]').on('submit', function(e){
		var site_search_text = $(this).find('input#s').val().trim();
		// console.log(site_search_text);
		// debugger;
		if(!site_search_text) {
			e.preventDefault();
			$(this).find('.site-no-value-error').css('display', 'block');
		} else {
			$(this).find('.site-no-value-error').css('display', 'none');
		}
	});

	$('#searchModal').on('shown.bs.modal', function() {
		focus_input(this);
	});

	// dropdown-toggle click event handle to enable href redirect if href attr is valid
	$('a.dropdown-toggle').click(function(e){
		e.preventDefault();
		if( e.originalEvent !== undefined ) {
			// get url
			var link_url = $(this).attr('href');
			if (typeof link_url !== undefined && link_url !== false) {
				location.href = link_url;
			}
		}
	});

	var shiftPressed = false;
	// check focusout event from li link under class navbar-nav
	$('.navbar-nav li a').focusout(function(){

		// force to display submenu
		if($(this).siblings('ul').hasClass('dropdown-menu') && shiftPressed === false) {
			$(this).siblings('ul').css('display', 'block');
		}
		// hide dropdown-menu
		if($(this).parent('li').parent('ul').hasClass('dropdown-menu') && $(this).parent('li').is('li:last-child') && shiftPressed === false ) {

			if(!$(this).siblings().hasClass('dropdown-menu')) {
				$(this).parent('li').parent('ul').removeAttr('style');

				if( $(this).parent('li').parent('ul').parent('li').parent('ul').hasClass('dropdown-menu') && $(this).parent('li').parent('ul').parent('li').is('li:last-child') ){
					$(this).parent('li').parent('ul').parent('li').parent('ul').removeAttr('style');
				}
			}
		}

		if($(this).siblings('ul').hasClass('dropdown-menu') && shiftPressed === true) {
			$(this).siblings('ul').removeAttr('style');
		}
	});

	$('.navbar-nav li a').on('keyup, keydown',function(e){
		shiftPressed = e.shiftKey;
	});

	// show modal on enter keypress
	$('#nav-search[data-target="#searchModal"]').on('keyup, keydown',function(e){
		var key = e.which || e.keyCode;
		if (key === 13) {
			$('#searchModal').modal('show');
		}
	});

	// get rid of extra dropdown-menu style if clicking outside of .navbar-nav
	$(document).mouseup(function(e){
	    var menuItem = $('.navbar-nav');

	    // if the target of the click isn't the container nor a descendant of the container
	    if (!menuItem.is(e.target) && menuItem.has(e.target).length === 0){
	        $('.navbar-nav').siblings('ul').removeAttr('style');
	    }
	});	

});