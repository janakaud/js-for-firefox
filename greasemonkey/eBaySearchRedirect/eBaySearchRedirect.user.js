// ==UserScript==
// @name        eBaySearchRedirect
// @namespace   com.tuna
// @description Replace m.ebay.com URLs with www.ebay.com URLs on eBay Mobile search
// @include     http://m.ebay.com.my/sch/i.html*
// @version     1
// @grant       none
// ==/UserScript==

setTimeout(function(e) {
    var l = document.getElementsByClassName('srchLnk');
    for (var i in l) {
        l[i].href = l[i].href.replace('http://m.', 'http://www.');
	}
}, 500);