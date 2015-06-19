var a = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
var s = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
var e = 'http-on-modify-request';
if (!window.jsObs) {
	window.jsObs = {
		observe: function(aSubject, aTopic, aData) {
			var channel = aSubject.QueryInterface(Ci.nsIHttpChannel);
			if(channel.URI.spec.match(/\b(\.js|_Incapsula_Resource)\b/)) {
				channel.cancel(Components.results.NS_BINDING_ABORTED);
			}
		}
	};
	window.jsDown = false;
}
if (window.jsDown) {
	s.removeObserver(window.jsObs, e, false);
	window.jsDown = false;
	a.showAlertNotification("chrome://mozapps/skin/extensions/alerticon-info-negative.png", "JS Unblicked", "External JS will load normally.", false, "", null, "");
} else {
	s.addObserver(window.jsObs, e, false);
	window.jsDown = true;
	a.showAlertNotification("chrome://mozapps/skin/extensions/alerticon-info-positive.png", "JS Blocked", "External JS will be blocked.", false, "", null, "");
}
