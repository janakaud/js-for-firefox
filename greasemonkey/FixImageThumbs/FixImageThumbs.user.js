// ==UserScript==
// @name        FixImageThumbs
// @namespace   com.tuna
// @description rewrite image URLs as thumbnail URLs on TC product pages
// @include     https://www.tripleclicks.com/detail*
// @version     1
// @grant       none
// ==/UserScript==
setTimeout(function() {
  l = document.querySelectorAll('img[data-caption=""]');
  for (i = 0; i < l.length; i++) {
    l[i].src = "https://www.tripleclicks.com/images/sku/" + document.location.href.match(/\d{3,}/)[0] + "_s" + (i + 1) + "_thumb.jpg";
  }
}, 500);