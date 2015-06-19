var a = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
var s = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
var e = 'http-on-modify-request';
if (!window.obs) {
	window.obs = {
		id: 'observecss',
		observe: function(aSubject, aTopic, aData) {
			var channel = aSubject.QueryInterface(Ci.nsIHttpChannel);
			if(channel.URI.spec.match(/\b(css|woff|ttf|gif|mp3|js)\b/)) {
				channel.cancel(Components.results.NS_BINDING_ABORTED);
			}
		}
	};
	window.cssdown = false;
}
if (window.cssdown) {
	s.removeObserver(window.obs, e, false);
	window.cssdown = false;
	a.showAlertNotification("chrome://mozapps/skin/extensions/alerticon-info-negative.png", "Blocker Disabled", "CSS, JS etc will load normally.", false, "", null, "");
} else {
	s.addObserver(window.obs, e, false);
	window.cssdown = true;
	a.showAlertNotification("chrome://mozapps/skin/extensions/alerticon-info-positive.png", "Blocker Enabled", "CSS, JS etc will be blocked.", false, "", null, "");
}


s = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
l = s.enumerateObservers('http-on-modify-request');
while (l.hasMoreElements()) {
	x = l.getNext();
	if (x.id == window.obs.id) {
		alert('removed');
		s.removeObserver(x, 'http-on-modify-request', false);
	}
}
