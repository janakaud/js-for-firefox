// ==UserScript==
// @name        DisableTabRedirect
// @namespace   com.tuna
// @description Disables redirects on tab clicks in TC product pages
// @include     https://www.tripleclicks.com/detail.php?item=*
// @version     1
// @grant       none
// ==/UserScript==
$('#pLayoutTablist a').each(function(k, v) {
    v.href = "";
});