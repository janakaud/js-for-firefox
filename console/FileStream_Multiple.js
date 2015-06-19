var list = document.getElementsByClassName('last_td');
for(i = 0; i < list.length; i++) {
	var url = list[i].getElementsByTagName('a')[0];
	if(url) {
		var link = url.getAttribute('onclick');
		var pos = link.indexOf('http');
		window.open(link.substring(pos, link.indexOf('\'', pos)).replace('http', 'https'));
	}
}