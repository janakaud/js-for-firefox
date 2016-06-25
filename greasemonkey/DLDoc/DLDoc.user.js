// ==UserScript==
// @name        DLDoc
// @namespace   com.tuna
// @description Download Confluence doc content as HTML, excluding menu & sidebar
// @include     http://docs.adroitlogic.org/display/*
// @version     1
// @grant       none
// ==/UserScript==

setTimeout(function() {
  document.getElementById('comments-section').remove();
  var text = document.getElementById('title-text').outerHTML + document.getElementsByClassName('wiki-content')[0].innerHTML;
  var link = document.createElement('a');
  link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  var file = document.location.href;
  link.setAttribute('download', file.substring(file.indexOf('/display') + 9).replace(/\//g, '---') + '.html');
  document.body.appendChild(link);
  link.click();
}, 1000);