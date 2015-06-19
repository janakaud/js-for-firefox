// ==UserScript==
// @name        FacebookAJAXMessaging
// @namespace   com.tuna
// @description Asynchronous message sending for Facebook Mobile (doesn't update replies)
// @include     http*://*.facebook.com/messages/*
// @version     1
// @grant       none
// ==/UserScript==

var form = document.getElementById('composer_form');
var done = false;
form.onsubmit = function() {
	done = false;
	var text = form.innerHTML;
	var pos = text.indexOf('ids[') + 4;
	var id = text.substring(pos, text.indexOf(']', pos));
	var str = 'fb_dtsg=' + form.fb_dtsg.value + '&charset_test=%E2%82%AC%2C%C2%B4%2C%E2%82%AC%2C%C2%B4%2C%E6%B0%B4%2C%D0%94%2C%D0%84&body=' + encodeURI(form.composerInput.value).replace(/%20/g, '+') + '&send=Reply&tids=' + form.tids.value + '&wwwupp=V3&ids' + encodeURI('[' + id + ']') + '=' + id + '&csid=' + form.csid.value

	var x = new XMLHttpRequest();
	x.open('POST', form.action, true);
	x.onreadystatechange = function() {
		this.abort();
		if(done)
			return;
		var form = document.getElementById('composer_form');
		var label = document.createTextNode(form.composerInput.value);
		form.composerInput.value = '';
		form.composerInput.focus();
		var parent = document.getElementsByClassName('acw apl abt')[0].parentNode;
		parent.appendChild(label);
		parent.appendChild(document.createElement('br'));
		var time = document.createElement('abbr');
		var date = new Date();
		var hours = date.getHours() + '';
		if(hours.length < 2)
			hours = '0' + hours;
		var minutes = date.getMinutes() + '';
		if(minutes.length < 2)
			minutes = '0' + minutes;
		var timestr = hours + ':' + minutes;
		time.innerHTML = timestr;
		time.setAttribute('class', 'actions mfss fcg');
		parent.appendChild(time);
		parent.appendChild(document.createElement('br'));
		done = true;
	};
	x.send(str);
	return false;
};