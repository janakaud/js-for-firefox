// ==UserScript==
// @name        MarkdownURLFixer
// @namespace   com.tuna
// @description fixes Markdown URLs viewed over file://
// @include     file:///media/janaka/Stuff/kubernetes/*
// @include     file:///home/janaka/Documents/js-for-firefox/*
// @version     1
// @grant       none
// ==/UserScript==
l = document.getElementsByTagName("a");
for (i = 0; i < l.length; i++) {
  url = l[i].getAttribute("data-original-href");
  if (!url.startsWith("http")) {
    l[i].href = "file:" + url;
  } else {
    l[i].style.color = "red";
  }
}