// notification generator
window.__notifyElem = window.__notifyElem || Cc["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService).showAlertNotification;
window.notify = window.notify || function(enabled, title, body) {
	__notifyElem("chrome://mozapps/skin/extensions/alerticon-info-" + (enabled ? "positive" : "negative") + ".svg", title, body, false, "", null, "");
};

// provides toggle functions and status maintenance
window.toggleService = window.toggleService || {
	a: window.__notifyElem,
	s: Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService),
	e: ["http-on-modify-request", "http-on-examine-response"],
	init: function(name, processFunc) {
		try {
			flagName = name + "Down";
			if(window[flagName] == undefined) {
				window[name + "Obs"] = {
					observe: function(aSubject, aTopic, aData) {
						var channel = aSubject.QueryInterface(Ci.nsIHttpChannel);
						processFunc(channel);
					}
				};
				window[flagName] = false;
			}
		} catch(e) {
			alert(e.message);
		}
	},
	toggle: function(name, processFunc, alertOn, alertOff) {
		this.toggleHandler(name, "http-on-modify-request", processFunc, alertOn, alertOff);
	},
	toggleResponse: function(name, processFunc, alertOn, alertOff) {
		this.toggleHandler(name, "http-on-examine-response", processFunc, alertOn, alertOff);
	},
	toggleHandler: function(name, event, processFunc, alertOn, alertOff) {
		try {
			this.init(name, processFunc);
			flagName = name + "Down";
			obsName = name + "Obs";
			if(window[flagName]) {
				this.s.removeObserver(window[obsName], event, false);
				window[flagName] = false;
				notify(false, alertOff.title, alertOff.body);
			} else {
				this.s.addObserver(window[obsName], event, false);
				window[flagName] = true;
				notify(true, alertOn.title, alertOn.body);
			}
		} catch(e) {
			alert(e.message);
		}
	},
	destroy: function() {
		try {
			k = Object.keys(window);
			for(i in k) {
				p = k[i].indexOf("Down");
				if(p > 0 && k[i].length == p + 4) {
					name = k[i].substring(0, p);
					if(window[k[i]]) {
						alert(name + " enabled, please disable it");
						return;
					}
					delete window[k[i]];
					delete window[name + "Obs"];
				}
			}
			l = ["JS", "CSS", "RW", "Media", "Social", "Chat", "RWOverwrite", "SameOrigin", "NoExpiry", "Service"];
			for(i in l) {
				delete window["toggle" + l[i]];
			}
		} catch(e) {
			alert(e.message);
		}
	},
	removeAll: function() {
		for (i in this.e) {
			iter = this.s.enumerateObservers(this.e[i]);
			while(iter.hasMoreElements()) {
				try {
					this.s.removeObserver(iter.getNext(), this.e[i], false);
				} catch(e) {
					alert(e.message);
				}
			}
		}
	}
};
window._toggleIgnore = window._toggleIgnore || /^https?:\/\/(127\.0\.0\.1|192\.168\.|localhost)/;

// init and enable toggles at first call
if(!window.toggleJS) {
	// JS, CSS, rewrite, media, social, chat, rewrite-overwrite, no-expiry
	alt = [true, false, true, true, false, true, true, true];
	ctrl = [true, true, false, true, true, true, false, true];
	shft = [false, true, true, true, false, true, true, true];
	chr = [32, 32, 32, 32, 32, 111, 111, 112];
	for(i = 0; i < chr.length; i++) {
		e = document.createEvent("KeyboardEvent");
		e.initKeyEvent("keypress", true, true, window, ctrl[i], alt[i], shft[i], false, 0, chr[i])
		document.dispatchEvent(e);
	}
}

// disable reconnection attempts on Slack
window._regexSlack = window._regexSlack || /slack\.com\/api\/api\.test/;
window.toggleSlack = window.toggleSlack || function() {
	toggleService.toggle('slack', function(channel) {
		if(channel.URI.spec.match(_regexSlack))
			channel.cancel(Components.results.NS_BINDING_ABORTED);
	}, {
		title: "Slack Blocked",
		body: "Reconnection tries of Slack will be blocked."
	}, {
		title: "Slack Unblocked",
		body: "Slack reconnection restored."
	});
};

window.toggleOffline = window.toggleOffline || function() {
	BrowserOffline.toggleOfflineStatus();
	isOffline = BrowserOffline._uiElement.getAttribute("checked") == "true";
	setTimeout(function() {
		notify(isOffline, isOffline ? "Offline" : "Online", "Network access is " + (isOffline ? "blocked." : "restored."));
	}, 500);

	if (isOffline == window.slackDown) {
		return;
	}
	toggleSlack();
	if (!isOffline && (chatDown || slackDown)) {
		setTimeout(function() {
			notify(false, "Chat Disabled", "Chats are still offline.");
		}, 2000);
	}
};
toggleOffline();
