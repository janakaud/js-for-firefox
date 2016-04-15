// notification generator
window.__notifyElem = window.__notifyElem || Cc["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService).showAlertNotification;
window.notify = window.notify || function(enabled, title, body) {
	__notifyElem("chrome://mozapps/skin/extensions/alerticon-info-" + (enabled ? "positive" : "negative") + ".svg", title, body, false, "", null, "");
};

BrowserOffline.toggleOfflineStatus();
isOffline = BrowserOffline._uiElement.getAttribute("checked") == "true";
notify(isOffline, isOffline ? "Offline" : "Online", "Network access is " + (isOffline ? "blocked." : "restored."));

// provides toggle functions and status maintenance
window.toggleService = window.toggleService || {
	a: Cc["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService).showAlertNotification,
	s: Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService),
	e: "http-on-modify-request",
	init: function(name, processFunc) {
		try {
			flagName = name + "Down";
			if(!window[flagName]) {
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
		try {
			this.init(name, processFunc);
			flagName = name + "Down";
			obsName = name + "Obs";
			if(window[flagName]) {
				this.s.removeObserver(window[obsName], this.e, false);
				window[flagName] = false;
				notify(false, alertOff.title, alertOff.body);
			} else {
				this.s.addObserver(window[obsName], this.e, false);
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
			l = ["Service", "JS", "CSS", "RW", "Media"];
			for(i in l) {
				delete window["toggle" + l[i]];
			}
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

// init and enable toggles at first call
if(!window.toggleJS) {
	alt = [true, false, true, true];
	ctrl = [true, true, false, true];
	shft = [false, true, true, true];
	for(i = 0; i < 4; i++) {
		e = content.document.createEvent("KeyboardEvent");
		e.initKeyEvent("keypress", true, true, window, ctrl[i], alt[i], shft[i], false, 0, 32)
		content.document.dispatchEvent(e);
	}
}

// URL mapper cache
window.forcedCache = window.forcedCache || {
	f: {
		"cloudfront.net": [/\/codeshell-\w{32}\.js/, /\/base-\w{32}\.js/, /\/hackerrank-core-\w{32}\.css/, /\/external_libraries-\w{32}\.css/, /\/external-core-\w{32}\.css/, /\/jquery\.carousel-\w{32}\.js/, /\/jquery\.fitvids-\w{32}\.js/, /\/hackerrank-\w{32}\.css/, /\/external_libraries-\w{32}\.js/, /\/completer-\w{32}\.js/, /\/challenge-\w{32}\.js/, /\/challenge-views-\w{32}\.js/, /\/game-views-\w{32}\.js/, /\/code-compile-test-\w{32}\.js/, /\/countdowntimer-\w{32}\.js/, /\/extra-views-\w{32}\.js/, /\/navigation-message-\w{32}\.js/, /\/hackerrank_libraries-\w{32}\.js/, /\/challenge-request-\w{32}\.js/, /\/submission-success-\w{32}\.js/, /\/submission-stats-\w{32}\.js/, /\/submission-\w{32}\.js/, /\/submission-views-\w{32}\.js/, /\/codemirror_basic-\w{32}\.js/, /\/challenge-sidebar-\w{32}\.js/, /\/challenge-header-\w{32}\.js/, /\/apply-blob-\w{32}\.js/, /\/challenge-content-\w{32}\.js/, /\/challenges-contest-\w{32}\.js/, /\/optin-banner-\w{32}\.js/, /\/post-content-\w{32}\.js/, /\/dashboard-\w{32}\.js/, /\/set-manifest-\w{40}\.js/, /\/challenge-sidebar-\w{32}\.js/, /\/hackerrank_libraries-\w{32}\.css/, /\/dashboard-\w{32}\.css/, /\/auth-\w{32}\.js/,	// hackerrank
		/\/globalnav-\w{32}\.gz\.css/, /*/\/globalnav-\w{32}\.gz\.js/*/, /\/auth-\w{32}\.css/, /\/billingconsole_prod_\w{32}\.gz\.css/, /\/mezz-\w{32}\.gz\.js/, /\/require-\w{32}\.js/, /\/hackerrank-\w{32}\.js/, /\/countdowntimer_v2-\w{32}\.gz\.js/, /\/custsat-\w{32}\.gz\.css/, /\/custsat-\w{32}\.gz\.js/, /\/bread-crumbs-\w{32}\.js/, /\/challenges-list-\w{32}\.js/, /\/verify-account-\w{32}\.js/, /\/billingconsole_prod_\w{32}\.gz\.js/, /\/clike-\w{32}\.js/, /\/dashboard-\w{32}\.css/, 
		/ec2\/(deferredjs\/)?\w{32}\.cache\.js/, /ec2\/(deferredjs\/)?\w{32}\/1\.cache\.js/, /ec2\/(deferredjs\/)?\w{32}\/2\.cache\.js/, /ec2\/(deferredjs\/)?\w{32}\/3\.cache\.js/, /ec2\/(deferredjs\/)?\w{32}\/4\.cache\.js/, /ec2\/(deferredjs\/)?\w{32}\/5\.cache\.js/, /ec2\/(deferredjs\/)?\w{32}\/6\.cache\.js/, /ec2\/(deferredjs\/)?\w{32}\/7\.cache\.js/, /ec2\/(deferredjs\/)?\w{32}\/8\.cache\.js/, /ec2\/(deferredjs\/)?\w{32}\/13\.cache\.js/, 
		/rds\/(deferredjs\/)?\w{32}\.cache\.js/, /rds\/(deferredjs\/)?\w{32}\/1\.cache\.js/, /rds\/(deferredjs\/)?\w{32}\/2\.cache\.js/, /rds\/(deferredjs\/)?\w{32}\/3\.cache\.js/, /rds\/(deferredjs\/)?\w{32}\/4\.cache\.js/, /rds\/(deferredjs\/)?\w{32}\/5\.cache\.js/, /rds\/(deferredjs\/)?\w{32}\/6\.cache\.js/, /rds\/(deferredjs\/)?\w{32}\/7\.cache\.js/, /rds\/(deferredjs\/)?\w{32}\/8\.cache\.js/, /rds\/(deferredjs\/)?\w{32}\/13\.cache\.js/, 
		/ec2\/ec2\.nocache\.js/, /billingconsole_prod_v\w{40}\.gz\.js/, /globalnav-\w{40}\.gz\.js/, /globalnav-\w{40}\.gz\.css/, /libs-[0-9.]+\.min\.css/, /libs-[0-9.]+\.min\.js/, /hipchat-client-[0-9.]+\.css/, /preload-[0-9.]+\.js/, /app-[0-9.]+\.js/,
		/js\/iFrameV4\/iFrameV4-js\.cssx/],
		"c64.assets-yammer.com/assets/": [/\/yam-application-\w{32}\.css/, /\/yam-common-ui-\w{32}\.css/, /\/yam-feeds-\w{32}\.css/, /\/yam-pages-\w{32}\.css/, /\/yam-workfeed-app-\w{32}\.css/, /\/yam-yamkit-ng-\w{32}\.css/, /\/tr8n-\w{32}\.css/, /\/yam-bootstrap-\w{32}\.js/, /\/yam-dynamic-i18n-bootstrap-\w{32}\.js/, /\/yam-en-us-dict-\w{32}\.js/, /\/yam-requirejs-home-main-\w{32}\.css/, /\/yam-requirejs-home-main-\w{32}\.js/, /\/yam-requirejs-redirector-\w{32}\.js/, /\/yam-vendor-\w{32}\.js/],
		"fiverrcdn.com": [/\/conversations-\w{32}\.css/, /\/conversations-\w{32}\.js/, /\/jquery\.uploadifive-\w{32}\.js/, /\/application-head-\w{32}\.js/, /\/application-\w{32}\.js/, /\/application-\w{32}\.css/, /\/orders-\w{32}\.css/, /\/orders-\w{32}\.js/, /\/reconnecting\.websocket-\w{32}\.js/, /\/global-gig-listings-\w{32}\.js/, /\/global-gig-listings-\w{32}\.css/, /\/marketplace-\w{32}\.css/, /\/user-dashboard-\w{32}\.css/, /\/jquery\.inline-alert-\w{32}\.js/, /\/todos-\w{32}\.js/, /translations\.en-\w{32}\.js/],
		"script.google.com/": [/\w{32}\.cache\.js/, /\w{32}\/1\.cache\.js/, /\w{32}\/3\.cache\.js/, /\w{32}\/5\.cache\.js/, /\w{32}\/6\.cache\.js/, /\d+-CallbackCss_ltr\.css/, /\d+-maestro_ide_shell_bin_i18n_maestro_ide_shell\.js/, /\d+-code_mirror_bin_code_mirror\.js/, /\d+-callback_bin_i18n_callback\.js/, /\d+-MaestroIdeShellCss_ltr\.css/, /\d+-mae_html_css_ltr\.css/, /\d+-MaestroHtmlAppWrapperCss_ltr\.css/, /\d+-mae_html_driver_bin_i18n_mae_html_driver\.js/, /\d+-maestro_htmlapp_bin_maestro_htmlapp\.js/, /googleappsscripts\.nocache\.js/],
		"google.com/forum/m": [/\w{32}\.cache\.js/, /\w{32}\/1\.cache\.js/, /\w{32}\/9\.cache\.js/],
		"apis.google.com/_/scs/abc-static/_/js/k=gapi.gapi.en.": [/m=gapi_iframes,googleapis_client,plusone/, /m=iframes,googleapis_client/],
		"www.google.lk/xjs/_/js/k=xjs.s.en.": [/m=sx,c,sb,cdos,cr,elog,jsa,r,hsm,j,p,d,csi/],
		"s7.addthis.com/js/": [/addthis_widget\.js/],
		"www.gstatic.com/": [/m=core/, /m=sy25,sy21,sy23,sy24,sy49,sy26,sy22,sy27,sy50,sy53,sy55,sy92,sy112,sy114,jsmod_projectlist/, / m=sy34,sy48,sy29,sy42,sy46,sy74,sy87,em8,em12,sy86,jsmod_devshell,jsmod_billingcommon,jsmod_activities/, / m=sy51,sy52,sy54,sy45,sy36,sy56,sy68,sy69,sy31,sy60,sy35,sy67,sy30,em9,sy58,em10,em11,sy78,jsmod_js_yaml,sy105,sy100,sy110,sy115,jsmod_projectdetail,jsmod_d3/, /m=jsmod_moment,sy41,sy43,sy44,sy57,sy59,sy61,jsmod_apiui/, /m=ld,sy66,d,sy81,gl,is,id,nb,nw,sb,sd,st,awd,p,vd,lod,eld,ip,dp,cpd,bd/],
		".net/rsrc.php/v2/": [/\/yO\/r\/.{11}\.css/, /\/y3\/r\/.{11}\.css/, /\/yw\/r\/.{11}\.css/, /\/yf\/r\/.{11}\.css/, /\/yL\/r\/.{11}\.css/, /\/yC\/r\/.{11}\.css/, /\/yt\/r\/.{11}\.css/, /\/y5\/r\/.{11}\.css/, /\/yI\/r\/.{11}\.css/, /\/yW\/r\/.{11}\.css/, /\/yU\/r\/.{11}\.css/, /\/yh\/r\/.{11}\.css/, /\/yF\/r\/.{11}\.css/, /\/yg\/r\/.{11}\.css/, /\/y1\/r\/.{11}\.css/, /\/yQ\/r\/.{11}\.css/, /\/yV\/r\/.{11}\.css/, /\/yK\/r\/.{11}\.css/, /\/yq\/r\/.{11}\.css/, /\/yw\/r\/.{11}\.css/, /\/ya\/r\/.{11}\.css/, /\/y8\/r\/.{11}\.css/, /\/yb\/r\/.{11}\.css/, /\/yY\/r\/.{11}\.css/, /\/yu\/r\/.{11}\.css/, /\/yc\/r\/.{11}\.css/, /\/yN\/r\/.{11}\.css/, /\/ys\/r\/.{11}\.css/, /\/y0\/r\/.{11}\.css/, /\/yO\/r\/.{11}\.js/, /\/yr\/r\/.{11}\.js/, /\/y5\/r\/.{11}\.js/, /\/yv\/r\/.{11}\.js/, /\/yR\/r\/.{11}\.css/, /\/y4\/r\/.{11}\.js/, /\/yP\/r\/.{11}\.js/, /\/yG\/r\/.{11}\.js/, /\/yF\/r\/.{11}\.js/, /\/yt\/r\/.{11}\.js/, /\/yz\/r\/.{11}\.js/, /\/y7\/r\/.{11}\.js/, /\/yf\/r\/.{11}\.js/, /\/yr\/r\/.{11}\.js/, /\/yQ\/r\/.{11}\.js/, /\/y4\/r\/.{11}\.css/, /\/yP\/r\/.{11}\.css/, /\/y6\/r\/.{11}\.js/, /\/yg\/r\/.{11}\.js/, /\/ys\/r\/.{11}\.js/, /\/yU\/r\/.{11}\.js/, /\/y1\/r\/.{11}\.js/],
		"developers.google.com/_static/": [/devsite-orange\.css/, /devsite-deep-purple\.css/, /devsite-teal\.css/, /devsite-google-blue\.css/, /jquery_ui-bundle\.js/, /script_foot_closure\.js/, /script_foot\.js/],
/*		"docs.google.com/static/": [/\d+-viewer_css_ltr\.css/, /\d+-viewer_core\.js/, /\d+-ritz_waffle_i18n_core\.js/, /\d+-ritz_waffle_i18n_shell\.js/, /\d+-ritz_waffle_i18n_postshellbase\.js/, /\d+-ritz_waffle_i18n_filterbar\.js/, /\d+-ritz_waffle_i18n_autovis\.js/, /\d+-ritz_waffle_i18n_docos\.js/, /\d+-ritz_waffle_i18n_inputtools\.js/, /\d+-docos_binary_i18n\.js/, /\w{32}\.cache\.js/, /\d+-ritz_waffle_i18n_ritzmaestro\.js/, /\d+-ritz_waffle_i18n_impressions\.js/, /\d+-ritz_waffle_i18n_shareclient\.js/, /\d+-ritz_waffle_i18n_findreplace\.js/, /\d+-ritz_waffle_i18n_goto\.js/, /\d+-ritz_waffle_i18n_hats\.js/, /\d+-ritz_waffle_i18n_gvizcharts\.js/, /\d+-ritz_waffle_i18n_api\.js/, /\d+-ritz_waffle_i18n_copydialog\.js/, /\d+-ritz_waffle_i18n_dialogs\.js/, /\d+-ritz_waffle_i18n_charts\.js/, /\d+-ritz_waffle_i18n_tableannotator\.js/, /\d+-ritz_waffle_i18n_conditionalformat\.js/, /\d+-ritz_waffle_i18n_spellcheck\.js/, /\d+-ritz_waffle_i18n_ritzprotectionpane\.js/, /\d+-ritz_waffle_i18n_namedrangespane\.js/, /\d+-ritz_waffle_i18n_ritzfilter\.js/, /\d+-ritz_waffle_i18n_links\.js/, /\d+-ritz_waffle_i18n_screenreader\.js/, /\d+-ritz_waffle_i18n_rangeprotection\.js/, /\d+-ritz_waffle_i18n_ritzpivottables\.js/, /\d+-ritz_waffle_i18n_datepicker\.js/, /\d+-ritz_waffle_i18n_revisions\.js/, /\d+-ritz_waffle_i18n_onepick\.js/, /\d+-ritz_waffle_i18n_offline\.js/, /\d+-ritz_waffle_i18n_drawings\.js/, /\d+-ritz_waffle_i18n_images\.js/, /\d+-ritz_waffle_i18n_pickerbase\.js/, /\w{32}\/1\.cache\.js/, /\w{32}\.cache\.js/],*/
		"/console/themes/theme": [/script\.js/, /topology\.css/, /form\.js/, /application_group_editor\.css/, /login\.js/, /bootstrap-switch\.min\.css/, /application_editor\.css/, /jquery\.contextMenu\.css/, /open_sans\.css/, /custom\.js/, /style\.css/, /applications_deploy\.css/, /font-mfizz\.css/, /custom\.css/, /bootstrap-switch\.min\.js/, /rgbcolor\.js/, /applications-deploy\.js/, /jquery\.ui\.position\.js/, /applications_topology\.js/, /noty-[\d\.]+\.js/, /font-awesome\.min\.css/, /applications_group_editor\.js/, /applications-editor\.js/, /bootstrap\.min\.js/, /jquery\.contextMenu\.js/, /bootstrap\.min\.css/, /canvg\.js/, /dagre\.min\.js/, /jsoneditor-[\d\.]+\.js/, /dom\.jsPlumb-[\d\.]+-min\.js/, /d3\.v3\.min\.js/, /jquery-[\d\.]+\.js/],
		"www.peanutlabs.com": [/iFrameV4\/styles\/style\.cssx/],
/*		jquery: [/jquery(-[\d.]+)?\.min\.js/, /jquery(-[\d.]+)?\.js/, /jquery-ui(-[\d.]+)?\.min\.js/, /jquery-ui(-[\d.]+)?\.js/, /jquery\.tmpl\.fix\.js/, /jquery(-[\d.]+)?\.modal\.js/, /jquery(-[\d.]+)?\.easing\.min\.js/, /jquery(-[\d.]+)?\.easing\.js/, /jquery-form(-[\d.]+)?\.modal\.js/, /jquery(-[\d.]+)?\.bt\.min\.js/, /jquery(-[\d.]+)?\.color\.js/, /jquery(-[\d.]+)?\.ui\.ipad\.js/, /jquery(-[\d.]+)?\.popupwindow\.js/, /jquery\.colorbox(-[\d.]+)?-min\.js/,
			/jquery\.prettyPhoto\.js/, /jquery\.colorbox\.js/, /jquery\.validate\.js/, /jquery\.taxonomy\.js/, /jquery\.min\.taxonomy\.js/, /jquery\.bootstrap-dropdown-hover\.js/,
			/jquery\.glob\.en-US\.min\.js/, /jquery\.global\.min\.js/,
			/jquerycssmenu\.js/, /jquery\.zclip\.js/, /raven(-[\d.]+)?\.min\.js/, /raven(-[\d.]+)?\.min\.js/,
			/jquery-ui(-[\d.]+)?\.min\.css/, /jquery-ui-theme(-[\d.]+)?\.css/, /jquery(-[\d.]+)?\.modal\.css/] */
	},
	find: function(url) {
		try {
			for(i in this.f)
				if(!url.startsWith("anon&") && url.indexOf(i) > 0) {
					list = this.f[i];
					for(j in list)
						if(url.match(list[j]))
							return this.r[i] [j];
				}
		} catch(e) {
			notify(false, "ForcedCache Find Error", e.message);
		}
		return null;
	}
};

// init URL mapper cache
if(!window.forcedCache.r) {
	cacheService = Components.classes["@mozilla.org/netwerk/cache-storage-service;1"].getService(Components.interfaces.nsICacheStorageService);
	var {LoadContextInfo} = Components.utils.import("resource://gre/modules/LoadContextInfo.jsm",{});
	visitor = {
		f: window.forcedCache.f,
		r: {},
		onCacheEntryInfo: function(entryInfo) {
			try {
				url = entryInfo.spec;
				if(url.startsWith("anon") > 0) {
					return;
				}
				for(i in this.f)
					if(url.indexOf(i) > 0) {
						list = this.f[i];
						for(j in list)
							if(url.match(list[j])) {
								if(!this.r[i])
									this.r[i] = {};
								this.r[i] [j] = url;
								return;
							}
					}
			} catch(e) {
				notify(false, "ForcedCache Init Error", e.message);
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
					notify(false, "ForcedCache Init Warning", diff + " sites missing");
				notify(true, "ForcedCache Init", "Initialized successfully");
			} catch(e) {
				notify(false, "ForcedCache Init Error", e.message);
			}
		}
	};
	diskCache = cacheService.diskCacheStorage(LoadContextInfo.default, true);
	diskCache.asyncVisitStorage(visitor, true);
	memCache = cacheService.memoryCacheStorage(LoadContextInfo.default, true);
	memCache.asyncVisitStorage(visitor, true);
}
