var list = document.getElementsByClassName('pl-video yt-uix-tile ');
for(var i = 0; i < list.length; i++) {
	var x = list[i].innerHTML;
	var y = x.indexOf('/watch');
	console.log('http://www.youtube.com' + x.substring(y, x.indexOf('&', y)));
}


/*run on Playlist page*/

var list = document.getElementsByClassName('pl-video yt-uix-tile ');
var array = [];
for(var i = 0; i < list.length; i++) {
	var x = list[i].innerHTML;
	var y = x.indexOf('/watch');
	array[i] = 'http://www.youtube.com' + x.substring(y, x.indexOf('&', y));
}
console.log("Triple-click and copy contents");
alert(JSON.stringify(array));


/*run on downvids.net page*/

var array = JSON.parse(prompt("Enter data from YouTube Playlist page"));
var i = 0, busy = 0;
var oldurl = '';
var link;
var timer = setInterval(function() {
	if(busy == 0) {
		document.getElementById('home_search_q').value = array[i];
		document.getElementById('home_search_submit').click();
		busy = 1;
	}
	else if(busy == 1 && (link = document.getElementById('search_more')) != null && link.href != oldurl) {
		var ifrm = document.createElement('iframe');
		document.body.appendChild(ifrm);
		ifrm.src = oldurl = document.getElementById('search_more').href;
		console.log('downloading ' + (i + 1));
		i++;
		busy = 0;
	}
	if(i == array.length)
		clearInterval(timer);
}, 1000);
