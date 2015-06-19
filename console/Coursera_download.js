var list = $('a[Title=\"Video (MP4)\"]');
var i = 0;
var j = setInterval(function() {
	var win = window.open(list[i]);
	setTimeout(function() { win.close() }, 15000);
	i++;
	if(i > list.length)
		clearInterval(j);
}, 500);
