var a = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
var s = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
var e = 'http-on-modify-request';
if (!window.styleObs) {
	window.styleObs = {
		observe: function(aSubject, aTopic, aData) {
			var channel = aSubject.QueryInterface(Ci.nsIHttpChannel);
			if(channel.URI.spec.match(/\b(css|woff|ttf|gif|mp3|ico|translate\.google\.com|google-analytics\.com)\b/)) {
				channel.cancel(Components.results.NS_BINDING_ABORTED);
			}
		}
	};
	window.styleDown = false;
}
if (window.styleDown) {
	s.removeObserver(window.styleObs, e, false);
	window.styleDown = false;
	a.showAlertNotification("chrome://mozapps/skin/extensions/alerticon-info-negative.png", "Blocker Disabled", "CSS, fonts etc will load normally.", false, "", null, "");
} else {
	s.addObserver(window.styleObs, e, false);
	window.styleDown = true;
	a.showAlertNotification("chrome://mozapps/skin/extensions/alerticon-info-positive.png", "Blocker Enabled", "CSS, fonts etc will be blocked.", false, "", null, "");
}
