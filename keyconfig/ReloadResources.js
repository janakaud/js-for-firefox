doc = content.document;
head = doc.getElementsByTagName('head')[0];

scripts = doc.getElementsByTagName('script');
var l = scripts.length;
var newScripts = [];
for(var i = j = 0; i < l; i++) {
	script = scripts[i - j];
	if(script.src) {
		s = doc.createElement('script');
		s.type = "text/javascript";
		s.src = script.src;
		newScripts.push(s);
		script.parentElement.removeChild(script);
		j++;
	}
}
for(i = 0; i < newScripts.length; i++) {
	head.appendChild(newScripts[i]);
}

links = doc.getElementsByTagName('link');
var l = links.length;
var newStyles = [];
for(var i = j = 0; i < l; i++) {
	link = links[i - j];
	if(link.rel == "stylesheet") {
		s = doc.createElement('link');
		s.rel = "stylesheet";
		s.href = link.href;
		newStyles.push(s);
		link.parentElement.removeChild(link);
		j++;
	}
}
for(i = 0; i < newStyles.length; i++) {
	head.appendChild(newStyles[i]);
}
