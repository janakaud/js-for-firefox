// OFFLINE

// notification generator
window.__notifyElem = Cc["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService).showAlertNotification;
window.notify = function(enabled, title, body) {
	__notifyElem("chrome://mozapps/skin/extensions/alerticon-info-" + (enabled ? "positive" : "negative") + ".svg",
		title, body, false, "", null, "");
};

window._flat = function(expr) {
	return expr.source;
};
window._or = function(...exprs) {
	return new RegExp("(" + _join("|", exprs) + ")");
};
window._seq = function(...exprs) {
	return new RegExp(_join("", exprs));
};
window._join = function(sep, exprs) {
	return exprs.map(_flat).join(sep);
};

window._isA = function(str, regex) {
	return regex.test(str);
};

// provides toggle functions and status maintenance
window.toggleService = {
	a: window.__notifyElem,
	s: Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService),
	e: ["http-on-modify-request", "http-on-examine-response"],
	init: function(name, processFunc) {
		try {
			flagName = name + "Down";
			if (window[flagName] == undefined) {
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
			if (window[flagName]) {
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
				if (p > 0 && k[i].length == p + 4) {
					name = k[i].substring(0, p);
					if (window[k[i]]) {
						alert(name + " enabled, please disable it");
						return;
					}
					delete window[k[i]];
					delete window[name + "Obs"];
				}
			}
			l = ["JS", "CSS", "RW", "Media", "Social", "Channels", "RWOverwrite", "SameOrigin", "NoExpiry", "Service"];
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

window._toggleIgnore = _seq(/^https?:\/\//, _or(
	/127\.0\.0\.1|192\.168\.|localhost/,
	/.*sigma.+\.s3-website-us-east-1\.amazonaws\.com/,
	/unpkg\.com\/@?(blueprintjs|normalize\.css)/,
	/raw\.githubusercontent\.com\/kristoferjoseph\/flexboxgrid\/master\/dist\/flexboxgrid\.min\.css/,
	/cdnjs\.cloudflare\.com\/ajax\/libs\/(monaco-editor|require\.js)/,
	/(cloudformation|lambda)\.\S+\.amazonaws\.com/,
	/s3(|\..+)\.amazonaws\.com\/com\..+\.sigma\.test/,
	/apis\.google\.com\/_\/scs/,
	/content\.googleapis\.com\/(discovery\/v1\/apis|static\/proxy\.html)/,
	/content\.googleapis\.com\/(deploymentmanager|storage)/,
	/apis\.google\.com\/js\/(api\.js|googleapis\.proxy\.js)/,
	/accounts\.google\.com\/o\/oauth2\/iframe(|rpc)/,
	/ssl\.gstatic\.com\/accounts\/o/,
	/cdnjs\.cloudflare\.com\/ajax\/libs\/jsrsasign/,
	/medium\.com\/(_\/api\/posts\/\w+\/claps|me\/stories)/,
	_seq(/mail\.google\.com\/mail\/u\/\d.+/, _or(
		/view=(tl|fimg)/,
		/view=att&/,
		/view=cv.*&cfact=/,
		/act=(rd|tr|rc|sm|lrd|secint|urt|dr|sd|xst)/
	))
));

// disable reconnection attempts on Slack
window._regexSlack = /slack\.com\/api\/api\.test/;
window.toggleSlack = window.toggleSlack || function() {
	toggleService.toggle('slack', function(channel) {
		if (_isA(channel.URI.spec, _regexSlack)) {
			_block(channel, "slack");
		}
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
	if (!isOffline && (channelsDown || slackDown)) {
		setTimeout(function() {
			notify(false, "Channels Disabled", "Channels are still offline.");
		}, 2000);
	}
};
toggleOffline();



window._regexGAS = /script\.google\.com\/(sharing\/init|.+\/((bind|test|active)|exceptionService|gwt\/autocompleteService))/;
window._regexOgs = /ogs\.google\.com/;
window._regexGlog = /(play|clients\d)\.google\.com\/log/;
window._regexSlackErr = /slack\.com\/beacon\/error/;

// RW

window._uriSvc = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

window._rwHackerStack = /\bhackerrank\.com\b|\/posts\/\d+\/comments/;
window._rwGAE = /\bappengine\.google\.com\/(css|js)/;
window._rwGoogleDev = /\b(cloud|developers|firebase)\.google\.com\/_static\/\w{10,}\//;
window._rwMDN = /developer\.mozilla\.org\/static\//;
window._rwGoogleIssues = /issuetracker\.google\.com\/.+\.(css|js)?/;
window._rwBlogger = /www\.blogger\.com\/dyn-css\//;
window._rwSpring = /spring\.io\/.+\.(js|css)/;
window._rwImgSrch = /www\.google\.[a-z]*\/async\/imgrc\?/;
window._rwReddit = /redditstatic\.com\//;
window._rwMozMedia = /mozilla\.org\/media\//;
window._rwAliExpress = /i\.alicdn\.com\/\S+\/.*\?\?/;
window._rwStackCss = /cdn\.sstatic\.net\/Sites\/\w+\/mobile\.css/;
window._rwYouTrackAuth = /jkweirujlskandfksdnf/; // /support\.\w+\.com\/(hub\/api\/rest\/oauth2\/auth|youtrack\/oauth)#/;
window._rwSlant = /slant\.co\/\w{20,}/;
window._rwGAS = /script\.google\.com\/.+\/(googleappsscripts\.nocache\.js|.+\.cache\.js)/;

window._rwAble = /\b(js|css|png)\b/;
window._rwIgnore = _or(
	_regexGAS,
	/support\.\w+\.com\/youtrack\/issue/,
	/(docs|drive|accounts)\.google\.com/,
	/www\.googleapis\.com/,
	/mail\.google\.com\/(mail\/u\/\d|_\/scs\/mail-static\/_\/js\/)/,
	/hangouts\.google\.com\//,
	/google\.\w+\/search\?/,
	/recaptcha\/(api\.js|api2)/,
	/ssl\.gstatic\.com\/accounts\/static\/_/,
	/www\.gstatic\.com\/recaptcha/,
	/encrypted-tbn0\.gstatic\.com/,
	/forums\.mozillazine\.org\/viewtopic\.php/,
	/support\.\w+\.com\/hub\/api\/rest\/oauth2\/auth/,
	/pb-control\.appspot\.com/,
	/linkedin\.com\/voyager\/api/,
	/media\.licdn\.com\/dms\/image/,
	/buyincoins\.com\/\?r=/,
	/youtube\.com\//,
	/(viewtopic|showthread)\.php/
);
window._rwCustomReq = /\/users\/codeheart\/requests\?/;
window._rwParams = new RegExp(
	_seq(/\b/, _or(
		/d|date|version|timestamp|queryAfterTime|buildTime|buildVersion|build-number|timestamp|build|tseed|ver/,
		/cx|_v|_t|v|t|e|_|r|b|u|cb|rnd|tsp|spm/
	), /\b=[-a-z_0-9.:]+&?|\?_?[a-z_0-9]+$/
).source, "ig");

window._sanitizeUrl = function(url, params) {
    if (!params) {
        params = url.match(_rwParams) || [];
    }
    params.map(function(v) {
        url = url.replace(v, '');
    });
    url = url.endsWith('?') || url.endsWith('&') ? url.substring(0, url.length - 1) : url;
    return url;
};

window._redir = function(channel, url) {
	origUrl = channel.URI;
	if (origUrl.spec === url) {	// already redirected
		return;
	}
//	channel.URI = origUrl.mutate().setSpec(url).finalize();
	console.debug(origUrl.spec, "->", url);
	channel.redirectTo(origUrl.mutate().setSpec(url).finalize());
};

window._debugIgnore = _or(
	_regexGAS,
	_regexOgs,
	_regexGlog,
	_regexSlack,
	_regexSlackErr,
	/hangouts\.google\.com\//
);
window._block = function(channel, cause) {
	channel.cancel(Components.results.NS_BINDING_ABORTED);
	!_isA(channel.URI.spec, _debugIgnore) && console.debug(channel.URI.spec, "blocked by", cause);
};

window._rwFunction = function(channel) {
	var url = channel.URI.spec;
	//console.debug(url, "start");
	if (_isA(url, _toggleIgnore) || _isA(url, _rwIgnore)) {
		//console.debug(url, "ignored");
		return;
	}
	if (_isA(url, _rwHackerStack))
		_redir(channel, url.replace(/&?_=\d+/, '').replace(/\?$/, ''));
	else if (_isA(url, _rwGAE))
		_redir(channel, url.replace(/\d+\-[0-9a-z]+\.\d+\./, ''));
	else if (_isA(url, _rwGoogleDev)) {
		var pos = url.indexOf("/", url.indexOf("_static"));
		_redir(channel, url.substring(0, pos) + url.substring(url.indexOf("/", pos + 1)));
	}
	else if (_isA(url, _rwMDN))
		_redir(channel, url.replace(/[0-9a-z]{12}\.js/, 'js').replace(/[0-9a-z]{12}\.css/, 'css'));
	else if (_isA(url, _rwGoogleIssues))
		_redir(channel, url.substring(0, url.lastIndexOf('?')));
	else if (_isA(url, _rwBlogger))
		_redir(channel, url.substring(0, url.indexOf("?")));
	else if (_isA(url, _rwSpring))
		_redir(channel, url.replace(/-[a-z0-9]{32}\./, '.'));
	else if (_isA(url, _rwImgSrch)) {
		var csi = url.indexOf('&csi=');
		_redir(channel, (url.substring(0, csi) + url.substring(url.indexOf('&', csi + 1))).replace(/cidx:\d,_id:irc_imgrc\d,_pms:s/,
			"cidx:2,_id:irc_imgrc2,_pms:s"));
	}
	else if (_isA(url, _rwReddit))
		_redir(channel, url.replace(/\.\S{11}\./, '.'));
	else if (_isA(url, _rwMozMedia))
		_redir(channel, url.replace(/\.\S{12}\./, '.'));
	else if (_isA(url, _rwAliExpress))
		_redir(channel, url.replace(/\.\S{8}\./, '.'));
	else if (_isA(url, _rwYouTrackAuth))
		_redir(channel, "http://127.0.0.1/youtrack/index.html" + url.substring(url.indexOf("#")));
	else if (_isA(url, _rwStackCss))
		_redir(channel, "https://cdn.sstatic.net/Sites/stackoverflow/mobile.css");
	else if (_isA(url, _rwSlant))
		_redir(channel, url.replace(/\w{20,}\//, ''));
	else if (_isA(url, _rwGAS))
		_redir(channel, url.replace(/\/a\/[^\/]+/, '').replace(/\/d\/[^\/]+/, ''));

	params = url.match(_rwParams);
	if (!params) {
		//console.debug(url, "no params; final", channel.URI.spec)
		return;
	}
	_redir(channel, _sanitizeUrl(url, params));
	//console.debug(url, "final", channel.URI.spec)
};

window.toggleRW = window.toggleRW || function() {
	toggleService.toggle('rw', function(channel) {
		_rwFunction(channel);
	}, {
		title: "URL Rewriter On",
		body: "Chosen URLs will be remapped to cache."
	}, {
		title: "URL Rewriter Off",
		body: "Chosen URLs will load normally."
	});
};
toggleRW();



// CHANNELS

window._regexChannels = _or(
	/medium\.com\/p\/.+\/deltas/,
	/mpmulti-.+\.slack-msgs\.com/,
	/slack\.com\/(templates\.php\?|api\/api\.test)/,
	/(client-channel|clients\d|hangouts)\.google\.com/,
	/mail\.google\.com\/mail\/u\/\d\/\?/,
	/trello\.com\/1\/(Session|batch)/,
	/\/youtrack\/(_events\?|rest\/(statistics|profile\/hasUnseenFeatures))/,
	/logImpressions/,
	/docs\.google\.com\/.+\/(bind|test|active|hibernatestat)/,
	/www\.fiverr\.com\/inbox\/contacts\/\w+$/,
	/tripleclicks\.com\/PBAPI\d*\.php/
);

window.toggleChannels = window.toggleChannels || function() {
	toggleService.toggle('channels', function(channel) {
		if (_isA(channel.URI.spec, _regexChannels)) {
			_block(channel, "channels");
		}
	}, {
		title: "Channels Blocked",
		body: "Slack, Hangouts, Gmail, Trello etc blocked."
	}, {
		title: "Channels Unblocked",
		body: "Slack, Hangouts, Gmail, Trello etc restored."
	});
};
toggleChannels();



// UA

window._sitesDefault = _or(
	/localhost:3000/,
	/sigma\..+\.com/,
	/bitbucket\.org/,
	/medium\.com\/p\/import-story/,
	/cloudfront\.net/,
	/console\.aws\.amazon\.com/,
	/(docs|script)\.google\.com\/.+\/edit/,
	/support\..+\.com/,
	/mail\.google\.com\/mail\/u\/\d\/$/,
	/google\.com\/recaptcha\//,
	/\.amazonaws\.com|\/recaptcha\//
);
window._sitesVersioned = _or(
	/(docs|domains)\.google\.com/,
	/www\.fiverr\.com/,
	/support\..+\.com\/youtrack\/oauth/
);
window._sitesMozFox = /(developers|apis|code)\.google\.com/;
window._sitesGecko = _or(
	/(cloud|drive|firebase)\.google\.com/,
	/developer\.android\.com/,
	/appspot\.com/
);
window._sitesSafari = _seq(/\/\//, _or(
	/(www\.|)google\.(lk|ca)/,
	/(www|m)\.youtube\.com/,
	/www\.quora\.com/
));
window._sitesAndroid = _seq(/\/\//, _or(
	/blogspot\.com/,
	/cwiki\.apache\.org/
));
window._sitesAndroidMobile = _seq(/\/\//, _or(
	/(gist\.|)github\.com/,
	/productforums\.google\.com/
));

window._uaOptimal = "Firefox";
window._uaVersioned = "Firefox/61";
window._uaMozFox = "Mozilla/5 Firefox";
window._uaGecko = "M Gecko";
window._uaSafari = "Mobile Safari";

window.toggleUA = window.toggleUA || function() {
	toggleService.toggle('ua', function(channel) {
		var url = channel.URI.spec;
		var ua = _uaOptimal;
		if (_isA(url, _sitesDefault)) {
			ua = navigator.userAgent;
		} else if (_isA(url, _sitesVersioned)) {
			ua = _uaVersioned;
		} else if (_isA(url, _sitesMozFox)) {
			ua = _uaMozFox;
		} else if (_isA(url, _sitesGecko)) {
			ua = _uaGecko;
		} else if (_isA(url, _sitesSafari)) {
			ua = _uaSafari;
		} else if (_isA(url, _sitesAndroid)) {
			ua = "Android";
		} else if (_isA(url, _sitesAndroidMobile)) {
			ua = "Android Mobile";
		}
		channel.setRequestHeader("User-Agent", ua, false);
	}, {
		title: "UA Blocked",
		body: _uaOptimal
	}, {
		title: "UA Unblocked",
		body: navigator.userAgent
	});
};
toggleUA();



// SOCIAL

window._regexSocial = _or(
	/facebook\.com\/sem_pixel/,
	/connect\.facebook\.net/,
	/facebook\.com\/connect\/ping/,
	/facebook\.com\/(v[0-9.]+\/)?plugins\/(page|like(box)?)\.php/,
	/platform\.twitter\.com\/(widgets\.)?js/
);

window.toggleSocial = window.toggleSocial || function() {
	toggleService.toggle('social', function(channel) {
		if (!_isA(channel.URI.spec, _toggleIgnore) && _isA(channel.URI.spec, _regexSocial)) {
			_block(channel, "social");
		}
	}, {
		title: "Social Blocked",
		body: "FB, Twitter etc plugins will be blocked."
	}, {
		title: "Social Unblocked",
		body: "FB, Twitter etc plugins will load normally."
	});
};
toggleSocial();



// SAME ORIGIN

window.toggleSameOrigin = window.toggleSameOrigin || function() {
	toggleService.toggle('sameorigin', function(channel) {
		url = channel.URI.spec;
		gbUrl = gBrowser.currentURI.spec;
		origin = gbUrl.substring(0, gbUrl.indexOf("/", gbUrl.indexOf("//") + 2));
		if (gbUrl != "about:newtab" && !url.startsWith(origin) && !url.startsWith("https://encrypted-tbn0.gstatic.com")) {
			_block(channel, "sameorigin");
		}
	}, {
		title: "Same Origin On",
		body: "Cross-origin requests are blocked."
	}, {
		title: "Same Origin Off",
		body: "Cross-origin requests are enabled."
	});
}
//toggleSameOrigin();



// MEDIA

window._regexMedia = _or(
	/\b(woff|woff2|ttf|otf|\.eot|mp3|mp4|m4a|ico|ogv|ogg|webm|gif|svg|wav)\b/,
	/(fonts|maps|content)\.googleapis\.com/,
	/henhouse/,
	/ssl\.gstatic\.com\/gb\/images/,
	/explorer\.apis\.google\.com/,
	/(ssl\.)?google-analytics\.com/,
	/survey\.g\.doubleclick\.net|seal\.geotrust\.com|alexa\.com|cdn\.optimizely\.com|doubleclick\.net/,
	/www\.youtube\.com\/embed|s\.ytime\.com/,
	/google\.com\/adsense/,
	/forter.com/,
	/wiki(pedia\.org\/w|\b)\/load\.php/,
	/pagead2\.googlesyndication\.com/,
	/apis-explorer\.appspot\.com/,
	/developers\.google\.com\/profile\/userhistory/,
	/www\.googletagmanager\.com/,
	/radar\.cedexis\.com|intercom\.io|intercomcdn\.com|api\.qualaroo\.com/,
	/support\.google\.com\/[^/]+\/apis/,
	/s3\.amazonaws\.com\/ki\.js/,
	_seq(/www\.fiverr\.com\//, _or(
		/quick_responses|js_event_tracking|report_payload_(events|counter)/,
		/inbox\/(custom_offer|counters|contacts(\?|\/\w+\/info))/
	)),
	/dev\.appboy\.com|(rt2|jen|collector)\.fiverr\.com/,
	/player\.vimeo\.com\/video\/233549644/,
	_regexGAS,
	/\/image-s\d-\dx\.jpg/,
	/bitbucket\.org\/(emoji|\!api\/.*\/pullrequests\/\d+\/(participants|merge-restrictions|updates))/,
	/google\.com\/.*\/jserror/,
	_seq(/dropbox\.com\//, _or(
		/jse|unity_connection_log|get_info_for_quota_upsell/,
		/alternate_wtl_browser_performance_info|log_js_sw_data|log|alternate_wtl|2\/notify\/subscribe/
	)),
	_seq(/slack\.com\//, _or(
		/messages\/.+/,
		_seq(/api\//, _or(
			/dnd\.teamInfo|experiments\.getByUser|promo\.banner|apps\.list|commands\.list|i18n\.translations\.get/,
			/emoji\.list|apps\.profile\.get|help\.issues\.list|users\.counts|users\.info|channels\.suggestions/
		))
	)),
	_seq(/linkedin\.com\//, _or(
		/csp\/dtag|realtime\/connect|li\/track/,
		_seq(/voyager\//, _or(/abp-detection\.js/,
			_seq(/api\//, _or(
				/messaging\/(badge|presenceStatuses|conversations(\?action|\/\d+\/events$))/,
				/identity\/cards|legoWidgetImpressionEvents|feed\/(hovercard|richRecommendedEntities)/,
				/growth\/(suggestedRoutes|emailsPrefill|socialproofs)/,
				/relationships\/(peopleYouMayKnow|connectionsSummary)/,
				/voyagerGrowthEmailDomainResolutions/
			))
		))
	)),
	/((hackernoon|medium)\.com|medium\.freecodecamp\.org)(\/$|\/_\/(batch|oh-noes))/,
	_seq(/medium\.com\//, _or(
		/_\/fp\/css\/(fonts-base|main-notes\.bundle)/,
		/media\/|_\/(batch|activity-status)|.*\/state\/location|me\//,
		/_\/api\/(placements|users|.+\/(responsesStreams|responses|collections))/,
		/.+\/(notes|quotes|upvotes)/
	)),
	/cdn-images-\d\.medium\.com\/proxy\//,
	/media\/\w{32}\?postId=/,
	/bam\.nr-data\.net\/jserrors/,
	/\/uconsole\/services\/metrics\/retrieveMultiGauges/,
	/www\.google\.com\/coop\/cse\/brand/,
	/\.google\.com\/(_s\/getsuggestions|profile\/userhistory)/,
	/api\.github\.com\/(users\/\w+\/repos|user\/repos)/,
	/www\.googleapis\.com\/urlshortener\/v1\/url/,
	_seq(/support\.\w+\.com\//, _or(
		/hub\/api\/rest\/(hubfeatures|settings|permissions)/,
		/youtrack\/(error|rest\/(profile\/hasUnseenFeatures|user\/banner\/content|statistics))/
	)),
	/cdn\.ravenjs\.com/,
	/www\.statcounter\.com\/counter\/counter\.js/,
	/_Incapsula_Resource/,
	/tripleclicks\.com\/(shared\/ajax\/notifications|games\/.*\/Badges)/,
	/wp-includes\/js\/zxcvbn/,
	/previewlg_\d+/,
	/translate_a\/element\.js/,
	/data\.jsdelivr\.com|cdn\.jsdelivr\.net/,
	/mod_pagespeed_beacon/,
	/assets\.alicdn\.com\/g\/alilog/,
	/gstatic\.com\/support/,
	_or(
		/slant\.co\/.*(viewpoints|related|tags|activity).+format=json/,
		/slant-api\.com\/(batch\/(rec-page|q-user-page)|.+entities\/user)/
	),
	/youtube\.com\/iframe_api|PlusAppUi/,
	/\.sfimg\.com\/(shared\/ajax\/notifications|ajax\/chat)/,
	/trustradius\.com\/locales\/resources\.json/,
	/quora\.com\/.+(log_browser_|time_on_site_|m=(fetch_toggled_component|get_next_page))/,
	/microsoft\.com\/app\/content/,
	/app\.prosperworks\.com\/api\/.+\/split_flaps\/check/,
	/\/\/twitter\.com/,
	/ipinfo\.io/,
	/.+\.qualtrics\.com/,
	/rollbar\.com/
);

window._mediaIgnore = /dashboard\.tawk\.to/;

window.toggleMedia = window.toggleMedia || function() {
	toggleService.toggle('media', function(channel) {
		if (!_isA(channel.URI.spec, _toggleIgnore) && !_isA(channel.URI.spec, _mediaIgnore) && _isA(channel.URI.spec, _regexMedia)) {
			_block(channel, "media");
		}
	}, {
		title: "Media Blocked",
		body: "Fonts, analytics etc will be blocked."
	}, {
		title: "Media Unblocked",
		body: "Fonts, analytics etc will load normally."
	});
};
toggleMedia();



// NO EXPIRY

window._regexNoCache = _or(
	/googleusercontent\.com/,
	/youtrack\/(oauth|hub\/api\/rest\/oauth2\/auth)/,
	/signin\.aws\.amazon\.com\/oauth/,
	/127\.0\.0\.1|localhost|192\.168\./,
	/(accounts|myaccount)\.google\.com/,
	/accounts\.mobitel\.lk\/samlsso/,
	/kotrivia\.appspot\.com/
);
window._regexDoCache = _or(
	/mail\.google\.com\/mail\/u\/\d/,
	/\w+\.slack\.com\/messages/,
	/docs\.google\.com/,
	/\.facebook\.com\/messages/,
	/tripleclicks\.com/,
	/linkedin\.com\/feed/
);
window._regexNoTouchCache = _or(
	/google\.\w+\/searchbyimage/,
	/lh\d\.googleusercontent\.com/,
	/alicdn\.com/,
	/\d-bp\.blogspot\.com/,
	/glyph\.medium\.com/
);

window.toggleNoExpiry = window.toggleNoExpiry || function() {
	toggleService.toggleResponse('noexpiry', function(channel) {
		if (_isA(channel.URI.spec, _regexNoTouchCache)) {
			return;
		}
		if (_isA(channel.URI.spec, _regexNoCache)) {
			channel.setResponseHeader("Cache-Control", "no-cache, no-store", false);
		} else {
//		} else if (_isA(channel.URI.spec, _regexDoCache)) {
			channel.setResponseHeader("Expires", "", false);
			channel.setResponseHeader("expires", "", false);
			channel.setResponseHeader("cache-control", "", false);
			channel.setResponseHeader("Cache-Control", "", false);
			channel.setResponseHeader("pragma", "", false);
			channel.setResponseHeader("Pragma", "", false);
		}
	}, {
		title: "Expiry Off",
		body: "Response expiry headers will be stripped."
	}, {
		title: "Expiry Normal",
		body: "Response expiry will happen normally."
	});
};
toggleNoExpiry();



// PERMANENT

window._regexPermanent = _or(
	/clients\d+\.google\.com\/(voice|chat|invalidation)/,
	/\d+\.client-channel\.google\.com\/client-channel/,
	/hangouts\.google\.com\/(hangouts|webchat|_\/scs)/,
	/notifications\.google\.com\/.*\/idv2/,
	_regexOgs,
	_regexGlog,
	_regexSlackErr
);

window.togglePermanent = window.togglePermanent || function() {
	toggleService.toggle('permanent', function(channel) {
		if (!_isA(channel.URI.spec, _toggleIgnore) && _isA(channel.URI.spec, _regexPermanent)) {
			_block(channel, "permanent");
		}
	}, {
		title: "Permanents Blocked",
		body: "Gmail/Hangouts resources etc will be blocked."
	}, {
		title: "Permanents Unblocked",
		body: "Gmail/Hangouts resources etc will load normally."
	});
};
togglePermanent();



// JS

window._regexJS = _or(
	/\.jss?\b|\/js\/|_js/,
	/_Incapsula_Resource/,
	/jsapi/,
	/(static|og|xjs)\/_\/js/,
	/load\.php\?debug=false/,
	/kb\.mozillazine\.org\/index\.php.+gen=js/,
	/mail\.google\.com\/mail\/u\/\d(\/h\/_\/.+v=mjs|.+view=)/,
	/jsi18n/
);

window.toggleJS = window.toggleJS || function() {
	toggleService.toggle('js', function(channel) {
		if (!_isA(channel.URI.spec, _toggleIgnore) && _isA(channel.URI.spec, _regexJS)) {
			_block(channel, "js");
		}
	}, {
		title: "JS Blocked",
		body: "External JS will be blocked."
	}, {
		title: "JS Unblocked",
		body: "External JS will load normally."
	});
};
toggleJS();



// CSS

window._regexCSS = _or(
	/css/,
	/s\d\.wp\.com\/_static/,
	/\/_\/(css|ss)/,
	/load\.php\?debug=false/,
	/mail\.google\.com\/mail\/u\/\d\/h\/_\/.+v=ss/
);

window.toggleCSS = window.toggleCSS || function() {
	toggleService.toggle('css', function(channel) {
		if (!_isA(channel.URI.spec, _toggleIgnore) && _isA(channel.URI.spec, _regexCSS)) {
			_block(channel, "css");
		}
	}, {
		title: "CSS Blocked",
		body: "External CSS will be blocked."
	}, {
		title: "CSS Unblocked",
		body: "External CSS will load normally."
	});
};
toggleCSS();



// RW OVERWRITE

window.toggleRWOverwrite = window.toggleRWOverwrite || function() {
	toggleService.toggle('rwOverwrite', function(channel) {}, {
		title: "URL Rewriter - Overwrite Mode",
		body: "Mappings for visited URLs will be overwritten."
	}, {
		title: "URL Rewriter - Overwrite Mode Off",
		body: "In-memory mappings will be ignored."
	});
};
//toggleRWOverwrite();



// IMAGES

window.prefSvc = Cc['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch("");

window.toggleImages = function() {
	showImages = 2 - prefSvc.getIntPref("permissions.default.image");
	prefSvc.setIntPref("permissions.default.image", showImages);
	notify(showImages, showImages ? "Images Blocked" : "Images Unblocked", "Images will be " + (showImages ? "blocked." : "displayed."));
};
//toggleImages();



// YOUTRACK

window._regexYT = _or(
	/\/youtrack\/(_events\?|rest\/(statistics|profile\/hasUnseenFeatures))/,
	/hub\/api\/rest\/oauth2\/auth/
);

window.toggleYT = window.toggleYT || function() {
	toggleService.toggle('yt', function(channel) {
		if (_isA(channel.URI.spec, _regexYT)) {
			_block(channel, "yt");
		}
	}, {
		title: "YouTrack Blocked",
		body: "Reconnection tries of YouTrack will be blocked."
	}, {
		title: "YouTrack Unblocked",
		body: "YouTrack reconnection restored."
	});
};
//toggleYT();



// NOREDIR

window._noredirIgnore = _or(
	/script\.google\.com\/macros\/s\//,
	/www\.dialog\.lk\/(dlg\/|)browse\/reloadPayBillOnline/,
	/mail\.google\.com\/mail\/u\/\d\/\?.+view=fimg/,
	/accounts\.google\.com\/o\/oauth2\//
);

window.toggleNoRedirect = window.toggleNoRedirect || function() {
	toggleService.toggleResponse('noredirect', function(channel) {
		if (!_isA(channel.URI.spec, _noredirIgnore) &&  channel.responseStatus > 299 && channel.responseStatus < 303) {
			_block(channel, "noredirect");
		}
	}, {
		title: "Redirect Off",
		body: "30x responses will be blocked."
	}, {
		title: "Redirect Normal",
		body: "30x responses will be redirected as usual."
	});
};



// RELOAD

var _offline = BrowserOffline._uiElement;
window.cHeader = function(channel, key) {
	try {
		return channel.getRequestHeader(key);
	} catch (e) {
		return undefined;
	}
};
window.toggleXhrOnline = window.toggleXhrOnline || function() {
	toggleService.toggle('xhronline', function(channel) {
		url = channel.URI.spec;
		if (_offline.getAttribute("checked") == "true" &&
			(url.indexOf("trello") > 0 && (cHeader(channel, "X-Requested-With") || cHeader(channel, "X-Trello-Client-Version"))) ||
			url.indexOf("gwt/autocompleteService") > 0 || url.indexOf("gwt/ideService") > 0)
			toggleOffline();
	}, {
		title: "Listening for XHR",
		body: "Browser will go online if an XHR is encountered."
	}, {
		title: "XHR Disabled",
		body: "XHR will be blocked while browser is offline."
	});
};
if (!window.xhronlineDown) toggleXhrOnline();

window.reloadResources = window.reloadResources || function() {
	if (!(_offline.getAttribute("checked") == "true")) toggleOffline();
	if (window.jsDown) toggleJS();
	if (window.cssDown) toggleCSS();

	gBrowser.reload();
	setTimeout(function() {
		if (_offline.getAttribute("checked") == "true") toggleOffline();
		if (!window.jsDown) toggleJS();
		if (!window.cssDown) toggleCSS();
		if (window.xhronlineDown) toggleXhrOnline();
	}, 5000);
};


var _mappings = {
	13: [
		{ctrl: true, shift: true, alt: false, handler: reloadResources},
	],
	32: [
		{ctrl: true, shift: true, alt: false, handler: toggleCSS},
		{ctrl: true, shift: false, alt: true, handler: toggleJS},
		{ctrl: true, shift: true, alt: true, handler: toggleMedia},
		{ctrl: true, shift: false, alt: false, handler: toggleSocial}
	],
	79: [
		{ctrl: true, shift: true, alt: false, handler: toggleOffline},
		{ctrl: true, shift: true, alt: true, handler: toggleChannels}
	],
	111: [
		{ctrl: true, shift: false, alt: true, handler: toggleSameOrigin},
	],
	80: [
		{ctrl: true, shift: true, alt: true, handler: toggleNoExpiry}
	],
	112: [
		{ctrl: true, shift: false, alt: true, handler: togglePermanent},
	],
	82: [
		{ctrl: false, shift: true, alt: true, handler: toggleRW},
		{ctrl: true, shift: true, alt: true, handler: toggleRWOverwrite}
	],
	105: [
		{ctrl: true, shift: false, alt: true, handler: toggleImages}
	],
	114: [
		{ctrl: true, shift: false, alt: true, handler: toggleNoRedirect}
	],
	115: [
		{ctrl: true, shift: false, alt: true, handler: toggleSlack}
	],
	117: [
		{ctrl: true, shift: false, alt: true, handler: toggleUA}
	]
};
window.addEventListener("keypress", function(event) {
	var _subset = _mappings[String(event.charCode || event.keyCode)];
	if (_subset) {
		for (var _i in _subset) {
			var _entry = _subset[_i];
			if (_entry.ctrl == event.ctrlKey && _entry.shift == event.shiftKey && _entry.alt == event.altKey) {
				_entry.handler();
				break;
			}
		}
	}
});


/*
// init and enable toggles at first call
if (!window.toggleJS) {
	// JS, CSS, rewrite, media, social, channels, rewrite-overwrite, no-expiry, permanent-blocked
	alt = [true, false, true, true, false, true, true, true];
	ctrl = [true, true, false, true, true, true, true, true];
	shft = [false, true, true, true, false, true, true, false];
	chr = [32, 32, 32, 32, 32, 111, 112, 112];
	for(i = 0; i < chr.length; i++) {
		e = document.createEvent("KeyboardEvent");
		e.initKeyEvent("keypress", true, true, window, ctrl[i], alt[i], shft[i], false, 0, chr[i])
		document.dispatchEvent(e);
	}
}
*/