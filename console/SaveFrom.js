// savefrom.net

// get links

var list = document.getElementsByClassName("link-box");
for(i = 0; i < list.length; i++) {
	var link = list[i].getElementsByClassName("link")[0];
	link.children[0].click();
}

// click links

var list = document.getElementsByClassName("link-box");
for(i = 0; i < list.length; i++) {
	var links = list[i].getElementsByClassName("link-group");
	for(j = 0; j < links.length; j++) {
		if(links[j].className == "link-group") {
			window.open(links[j].children[0].children[1].href.replace('http:', 'https:'));
		}
	}
}