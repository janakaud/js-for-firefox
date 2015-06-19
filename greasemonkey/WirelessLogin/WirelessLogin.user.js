// ==UserScript==
// @name		StopWirelessLoginRedirect
// @namespace	com.tuna
// @description	Disable redirect to UoM website after log-in to UoM_Wireless network
// @include		https://1.1.1.1/login.html*
// @version		1
// @grant		none
// ==/UserScript==

if (document.body.innerHTML.indexOf("Login Successful") > 0) {
	document.location.href = "about:blank";
}