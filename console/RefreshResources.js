head = document.getElementsByTagName('head')[0];
scripts = head.getElementsByTagName('script');
for(i = 0; i < scripts.length; i++) {
	script = scripts[i];
	if(script.src) {
		head.removeChild(script);
		s = document.createElement('script');
		s.type = "text/javascript";
		p = script.src.indexOf('?');
		s.src = p > 0 ? script.src.substring(0, p) : script.src;
		console.log(s.src);
		head.appendChild(s);
	}
}

head = document.getElementsByTagName('head')[0];
links = head.getElementsByTagName('link');
for(i = 0; i < links.length; i++) {
	link = links[i];
	if(link.rel == "stylesheet") {
		head.removeChild(link);
		s = document.createElement('link');
		s.rel = "stylesheet";
		p = link.href.indexOf('?');
		s.href = p > 0 ? link.href.substring(0, p) : link.href;
		head.appendChild(s);
	}
}
