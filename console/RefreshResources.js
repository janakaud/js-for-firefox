head = document.getElementsByTagName('head')[0];
scripts = document.getElementsByTagName('script');
var l = scripts.length;
for(i = 0; i < l; i++) {
	script = scripts[i];
	if(script.src) {
		s = document.createElement('script');
		s.type = "text/javascript";
		p = script.src.indexOf('?');
		s.src = p > 0 ? script.src.substring(0, p) : script.src;
		console.log(s.src);
		head.appendChild(s);
	}
}

head = document.getElementsByTagName('head')[0];
links = document.getElementsByTagName('link');
var l = links.length;
for(i = 0; i < l; i++) {
	link = links[i];
	if(link.rel == "stylesheet") {
		s = document.createElement('link');
		s.rel = "stylesheet";
		p = link.href.indexOf('?');
		s.href = p > 0 ? link.href.substring(0, p) : link.href;
		head.appendChild(s);
	}
}
