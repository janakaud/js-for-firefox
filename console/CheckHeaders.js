countObs = function() {
	l = obss.enumerateObservers(e);
	i = 0;
	while (l.hasMoreElements()) {
		l.getNext();
		i++;
	}
	console.log(i);
};

url = "https://assetsv2.fiverrcdn.com/assets/dist/translations.en-7e7fa45f4758ab1c6c1d437c9b834089.js",
obss = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService),
e = "http-on-modify-request",
o = {
	observe: function(aSubject, aTopic, aData) {
		var channel = aSubject.QueryInterface(Ci.nsIHttpChannel);
		if (channel.URI.spec == url) try {
			alert(channel.getRequestHeader("If-Modified-Since"));
		} catch (e) { alert(e) }
	}
};

countObs();
obss.addObserver(o, e, false);

x = new XMLHttpRequest();
x.open("GET", url, false);
x.onload = function() {
	//alert(this.responseText);
}
x.onerror = function() {
	alert(this);
}
try {
	x.send(null);
} catch (e) {
	alert(e);
}

obss.removeObserver(o, e, false);
countObs();

/*
l = obss.enumerateObservers(e);
while (l.hasMoreElements()) {
obss.removeObserver(l.getNext(), e, false);
}
*/
