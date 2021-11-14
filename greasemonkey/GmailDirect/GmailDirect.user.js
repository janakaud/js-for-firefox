// ==UserScript==
// @name        GmailDirect
// @namespace   com.tuna
// @description Disables redirection on Gmail pages
// @include     https://mail.google.com/mail/u/*
// @version     1
// @grant       none
// ==/UserScript==

setTimeout(function(e) {
	for (var i = 0; i < document.links.length; i++) {
		var url = document.links[i].href;
		var start = url.indexOf('url?q=');
		if (start > 0) {
			var end = url.indexOf('&');
			url = decodeURIComponent(url.substring(start + 6, end));
			start = url.indexOf('url=');
			if (start > 0) {
				end = url.indexOf('&');
				url = decodeURIComponent(url.substring(start + 4, end));
			}
			document.links[i].href = url;
		}
	}
}, 500);