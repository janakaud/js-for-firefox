// ==UserScript==
// @name        RemoveBloggerOverlay
// @namespace   com.tuna
// @description Removes '<div class="cap-top">' overlay blocking top portion of page on Blogger Mobile
// @include     http://*.blogspot.com*
// @version     1
// @grant       none
// ==/UserScript==

document.querySelector('div.cap-top').remove()