head = document.getElementsByTagName('head')[0];
scripts = document.getElementsByTagName('script');
var l = scripts.length;
var newScripts = [];
for(var i = j = 0; i < l; i++) {
	script = scripts[i - j];
	if(script.src) {
		s = document.createElement('script');
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

head = document.getElementsByTagName('head')[0];
links = document.getElementsByTagName('link');
var l = links.length;
var newStyles = [];
for(var i = j = 0; i < l; i++) {
	link = links[i - j];
	if(link.rel == "stylesheet") {
		s = document.createElement('link');
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


//open in new tab
scripts = document.scripts;
var l = scripts.length;
var w = [];
for(i = 0; i < l; i++) {
	script = scripts[i];
	if(script.src) {
		w[i] = window.open(script.src);
		setInterval("w[" + i + "].close()", 10000);
	}
}
css = document.styleSheets;
var l = css.length;
var w = [];
for(i = 0; i < l; i++) {
	script = css[i];
	if(script.href) {
		w[i] = window.open(script.href);
		setInterval("w[" + i + "].close()", 10000);
	}
}

