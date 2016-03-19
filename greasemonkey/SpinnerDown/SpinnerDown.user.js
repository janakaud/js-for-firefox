// ==UserScript==
// @name        SpinnerDown
// @namespace   com.tuna
// @description stops the spinner on Confluence pages, consuming CPU
// @include     https://cwiki.apache.org/confluence/display/STRATOS/*
// @version     1
// @grant       none
// ==/UserScript==
setTimeout(function(e) {
	document.getElementsByClassName("spinner")[0].remove();
}, 500);