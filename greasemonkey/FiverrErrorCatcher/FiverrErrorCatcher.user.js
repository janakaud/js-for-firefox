// ==UserScript==
// @name        FiverrRTCPeerConnectionFixer
// @namespace   com.tuna
// @description suppresses RTCPeerConnection failures at Fiverr offline page load
// @include     https://www.fiverr.com/*
// @version     1
// @grant       none
// @run-at      document-start
// ==/UserScript==
oldRTCPeerConnection = window.RTCPeerConnection;
window.mozRTCPeerConnection = window.RTCPeerConnection = function(arg1, arg2) {
	try { 
		return new oldRTCPeerConnection(arg1, arg2);
	} catch(e) {
		console.log(e);
	}
}