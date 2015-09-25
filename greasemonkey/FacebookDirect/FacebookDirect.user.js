// ==UserScript==
// @name		FacebookDirect
// @namespace	com.tuna
// @description	Convert via-Facebook URLs to direct URLs by DOM manipulation
// @include		https://*.facebook.com/*
// @version		1
// @grant		none
// ==/UserScript==

setTimeout(function() {
	for (var i = 0; i < document.links.length; i++) {
		var url = document.links[i].href;
		var start = url.indexOf('/l.php?u=');
		if (start > 0) {
			var end = url.lastIndexOf('&h=');
			document.links[i].href = decodeURIComponent(url.substring(start + 9, end));
		}
	}
}, 500);