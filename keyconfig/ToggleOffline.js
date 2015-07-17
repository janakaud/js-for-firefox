BrowserOffline.toggleOfflineStatus();
window.toggleService = window.toggleService || {
	a: Cc["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService).showAlertNotification,
	s: Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService),
	e: 'http-on-modify-request',
	init: function(name, processFunc) {
		flagName = name + 'Down';
		if (!window[flagName]) {
			window[name + 'Obs'] = {
				observe: function(aSubject, aTopic, aData) {
					var channel = aSubject.QueryInterface(Ci.nsIHttpChannel);
					processFunc(channel);
				}
			};
			window[flagName] = false;
		}
	},
	toggle: function(name, processFunc, alertOn, alertOff) {
		this.init(name, processFunc);
		flagName = name + 'Down';
		obsName = name + 'Obs';
		if (window[flagName]) {
			this.s.removeObserver(window[obsName], this.e, false);
			window[flagName] = false;
			this.a("chrome://mozapps/skin/extensions/alerticon-info-negative.png", alertOff.title, alertOff.body, false, "", null, "");
		} else {
			this.s.addObserver(window[obsName], this.e, false);
			window[flagName] = true;
			this.a("chrome://mozapps/skin/extensions/alerticon-info-positive.png", alertOn.title, alertOn.body, false, "", null, "");
		}
	}
};
