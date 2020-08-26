"use strict";

jQuery(document).ready(function ($) {
  // GLOBAL VARS //
  var adminHeader = $('#wpadminbar');
  var stickyHeader = $('header.site-header-sticky');
  var cssAnchorOffset = 0;
  var headerHeight = 0;

  if (adminHeader.length && stickyHeader.length) {
    headerHeight = stickyHeader[0].offsetHeight + adminHeader[0].offsetHeight + cssAnchorOffset;
  } else if (stickyHeader.length) {
    headerHeight = stickyHeader[0].offsetHeight + cssAnchorOffset;
  } // GLOBAL FUNCTIONS //
  // Super footer columns match height


  var superFooterHeight = {};
  superFooterHeight.columns = $('.super-footer .super-footer__menu__nav');
  superFooterHeight.column4 = $('.super-footer .super-footer__4');

  superFooterHeight.init = function () {
    var maxHeight = -1; // find tallest column

    superFooterHeight.columns.each(function () {
      maxHeight = maxHeight > $(this).outerHeight() ? maxHeight : $(this).outerHeight();
    }); // apply tallest height to super footer col 4

    superFooterHeight.column4.css('min-height', maxHeight);
  };

  var wooBanner = {};
  wooBanner.headerHeight = $('#site-header')[0].offsetHeight;
  wooBanner.bannerDiv = $('.woocommerce-page .banner');

  wooBanner.init = function () {
    wooBanner.bannerDiv.css('min-height', wooBanner.headerHeight);
  }; // Smooth scroll to anchor on page load


  var onLoadScroll = {};
  onLoadScroll.hash = $(location).attr('hash');
  onLoadScroll.html = $('html, body');
  setTimeout(onLoadScroll.init = function () {
    if (onLoadScroll.hash.length) {
      onLoadScroll.name = onLoadScroll.hash.split('#').pop();
      onLoadScroll.anchor = $('a[name="' + onLoadScroll.name + '"]');

      if (onLoadScroll.anchor.length) {
        onLoadScroll.html.animate({
          scrollTop: onLoadScroll.anchor.offset().top - headerHeight
        }, 1000);
      }

      return false;
    }
  }, 1000); // Append VC gallery images as bg for responsive scaling

  var vcGallery = {};
  vcGallery.ul = $('.wpb_image_grid_ul');

  vcGallery.init = function () {
    if (vcGallery.ul.length) {
      vcGallery.li = vcGallery.ul[0].childNodes;
      $.each(vcGallery.li, function (index, value) {
        value.style.backgroundImage = 'url("' + value.childNodes[0].href + '")';
      });
    }
  }; // Init functions


  var init = function init() {
    superFooterHeight.init();
    wooBanner.init();
    vcGallery.init(); //onLoadScroll.init()
  };

  init(); // EVENT LISTENER FUNCTIONS //
  // Listing Page Gallery thumbnail image trigger

  $('.carousel-thumbs').on('click', '.button', function () {
    var $flick = $('.carousel').flickity();
    var index = $(this).index();
    $flick.flickity('select', index, false, true);
  }); // On modal close, prevent video from playing in background

  $('.modal').on('hidden.bs.modal', function () {
    // Reset the iframe (youtube) src
    $(this).find('iframe').attr('src', $(this).find('iframe').attr('src'));
  }); // Woocommerce Mobile Shop Menu - Product Filters

  var $mShopMenu = {};
  $mShopMenu.btn = $('#mobileShopBtn');
  $mShopMenu.bg = $('#mobileShopBg');
  $mShopMenu.btn.on('click mousedown focus', function () {
    $('body').toggleClass('mobileShopMenu-open');
  });
  $mShopMenu.bg.on('click mousedown focus', function () {
    $('body').toggleClass('mobileShopMenu-open');
  });
});

//# sourceMappingURL=custom-elmwoodspa-min.js.map
