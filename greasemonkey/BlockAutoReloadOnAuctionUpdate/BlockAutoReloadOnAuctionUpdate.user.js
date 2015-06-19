// ==UserScript==
// @name		BlockAutoReloadOnAuctionUpdate
// @namespace	com.tuna
// @description	Cancel tripleclicks.com footer load (with Google Translate) and periodic auction updates
// @include		https://www.tripleclicks.com/*
// @include		http://www.tripleclicks.com/*
// @version		1
// @grant		none
// ==/UserScript==

setTimeout(function() {
	console.log('start');
	document.getElementById('footer2012').innerHTML = '';
}, 500);

setTimeout(function() {
	for(var i = 0; i < 100; i++)
		clearInterval(i);
	console.log('finish');
}, 3000);