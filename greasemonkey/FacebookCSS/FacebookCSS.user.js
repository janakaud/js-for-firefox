// ==UserScript==
// @name        FacebookCSS
// @namespace   com.tuna
// @description Removes offensive CSS class that limits Facebook message pane width
// @include     https://x.facebook.com/messages*
// @version     1
// @grant       none
// ==/UserScript==
document.onscroll = function() {
	l = document.getElementsByClassName('_4g34');
	len = l.length;
	for(i = 0; i < len; i++)
		l[0].classList.remove('_4g34');
};