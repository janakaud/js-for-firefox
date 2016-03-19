// ==UserScript==
// @name		GoogleSearchDirect
// @namespace	com.tuna
// @include		https://www.google.lk/search*
// @description Convert Google Search redirect URLs to direct URLs by DOM manipulation
// @version		1
// @grant		none
// ==/UserScript==

setTimeout(function(e) {
	var elems = document.getElementsByClassName("web_result");
	for (var i = 0; i < elems.length; i++) {
		var a = elems[i].children[0].children[0];
		var url = a.href;
		var start = url.indexOf('q=');
		if (start > 0) {
			var end = url.indexOf('&sa=');
			url = decodeURIComponent(url.substring(start + 2, end));
			start = url.indexOf('u=');
			if (start > 0) {
				end = url.indexOf('&source=');
				url = decodeURIComponent(url.substring(start + 2, end));
			} else {
				start = url.indexOf('lite_url=');
				if (start > 0) {
					end = url.indexOf('&ei=');
					url = decodeURIComponent(url.substring(start + 9, end));
				}
			}
			url = url.replace(/\/en.wikipedia.org\//, '/en.m.wikipedia.org/')
			a.href = url;
		}
	}
}, 500);