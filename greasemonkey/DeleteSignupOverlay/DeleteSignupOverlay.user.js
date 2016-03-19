// ==UserScript==
// @name        DeleteSignupOverlay
// @namespace   com.tuna
// @description Deletes signup overlay on Mali Developers
// @include     http://malideveloper.arm.com/*
// @version     1
// @grant       none
// ==/UserScript==
setTimeout(function() {
    document.getElementsByClassName('signup-form-modal_wrapper')[0].remove();
    document.getElementsByClassName('x-container')[2].remove();
}, 500);