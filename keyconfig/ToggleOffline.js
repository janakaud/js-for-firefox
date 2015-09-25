BrowserOffline.toggleOfflineStatus();
window.toggleService = window.toggleService || {
	a: Cc["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService).showAlertNotification,
	s: Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService),
	e: 'http-on-modify-request',
	init: function(name, processFunc) {
		try {
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
		} catch(e) {
			alert(e.message);
		}
	},
	toggle: function(name, processFunc, alertOn, alertOff) {
		try {
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
		} catch(e) {
			alert(e.message);
		}
	},
	destroy: function() {
		try {
			k = Object.keys(window);
			for(i in k) {
				p = k[i].indexOf('Down');
				if(p > 0 && k[i].length == p + 4) {
					name = k[i].substring(0, p);
					if(window[k[i]]) {
						alert(name + ' enabled, please disable it');
						return;
					}
					delete window[k[i]];
					delete window[name + 'Obs'];
				}
			}
			delete window.toggleService;
		} catch(e) {
			alert(e.message);
		}
	},
	removeAll: function() {
		try {
			iter = this.s.enumerateObservers(this.e);
			while(iter.hasMoreElements()) {
				this.s.removeObserver(iter.getNext(), this.e, false);
			}
		} catch(e) {
			alert(e.message);
		}
	}
};
window.forcedCache = window.forcedCache || {
	f: {
		"fiverrcdn.com": [/\/conversations-\w{32}\.css/, /\/conversations-\w{32}\.js/, /\/jquery\.uploadifive-\w{32}\.js/, /\/application-head-\w{32}\.js/, /\/application-\w{32}\.js/, /\/application-\w{32}\.css/, /\/orders-\w{32}\.css/, /\/orders-\w{32}\.js/, /\/reconnecting\.websocket-\w{32}\.js/, /\/global-gig-listings-\w{32}\.js/, /\/global-gig-listings-\w{32}\.css/, /\/marketplace-\w{32}\.css/, /\/user-dashboard-\w{32}\.css/, /\/jquery\.inline-alert-\w{32}\.js/, /\/todos-\w{32}\.js/],
		"script.google.com/": [/\w{32}\.cache\.js/, /\w{32}\/1\.cache\.js/, /\w{32}\/3\.cache\.js/, /\w{32}\/5\.cache\.js/, /\w{32}\/6\.cache\.js/, /\d+-CallbackCss_ltr\.css/, /\d+-maestro_ide_shell_bin_i18n_maestro_ide_shell\.js/, /\d+-code_mirror_bin_code_mirror.js/, /\d+-MaestroIdeShellCss_ltr.css/],
		"groups.google.com/forum/m": [/\w{32}\.cache\.js/],
		"productforums.google.com/forum/m": [/\w{32}\.cache\.js/],
		"apis.google.com/_/scs/abc-static/_/js/k=gapi.gapi.en.": [/m=gapi_iframes,googleapis_client,plusone/, /m=iframes,googleapis_client/],
		"www.google.lk/xjs/_/js/k=xjs.s.en.": [/m=sx,c,sb,cdos,cr,elog,jsa,r,hsm,j,p,d,csi/],
		"s7.addthis.com/js/": [/addthis_widget\.js/],
		"www.gstatic.com/_/pantheon/_/js/k=pantheon.pantheon_module_set.": [/m=core/, /m=sy25,sy21,sy23,sy24,sy49,sy26,sy22,sy27,sy50,sy53,sy55,sy92,sy112,sy114,jsmod_projectlist/, / m=sy34,sy48,sy29,sy42,sy46,sy74,sy87,em8,em12,sy86,jsmod_devshell,jsmod_billingcommon,jsmod_activities/, / m=sy51,sy52,sy54,sy45,sy36,sy56,sy68,sy69,sy31,sy60,sy35,sy67,sy30,em9,sy58,em10,em11,sy78,jsmod_js_yaml,sy105,sy100,sy110,sy115,jsmod_projectdetail,jsmod_d3/, /m=jsmod_moment,sy41,sy43,sy44,sy57,sy59,sy61,jsmod_apiui/]
	},
	find: function(url) {
		try {
			for(i in this.f)
				if(url.indexOf(i) > 0) {
					list = this.f[i];
					for(j in list)
						if(url.match(list[j]))
							return this.r[i][j];
				}
		} catch(e) {
			alert(e.message);
		}
		return null;
	}
};
if(!window.forcedCache.r) {
	cacheService = Components.classes["@mozilla.org/netwerk/cache-storage-service;1"].getService(Components.interfaces.nsICacheStorageService);
	var {LoadContextInfo} = Components.utils.import("resource://gre/modules/LoadContextInfo.jsm",{});
	cache = cacheService.diskCacheStorage(LoadContextInfo.default, true);
	cache.asyncVisitStorage({
		f: window.forcedCache.f,
		r: {},
		onCacheEntryInfo: function(entryInfo) {
			try {
				url = entryInfo.key;
				for(i in this.f)
					if(url.indexOf(i) > 0) {
						list = this.f[i];
						for(j in list)
							if(entryInfo.key.match(list[j])) {
								if(!this.r[i])
									this.r[i] = {};
								this.r[i][j] = entryInfo.key;
								return;
							}
					}
			} catch(e) {
				alert(e.message);
			}
		},
		onCacheEntryVisitCompleted: function() {
			try {
				list = [];
				for(i in this.f)
					list[i] = this.r[i] ? this.r[i] : null;
				window.forcedCache.r = list;
				diff = this.f.length - Object.keys(this.r).length;
				if(diff > 0)
					alert('Warning: ' + diff + ' sites missing');
			} catch(e) {
				alert(e.message);
			}
		}
	}, true);
}
