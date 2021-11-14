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
window._or_nowrap = function(...exprs) {
	return new RegExp(_join("|", exprs));
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

window._local = /127\.0\.0\.1|192\.168\.|localhost/;
window._toggleIgnore = _seq(/^https?:\/\//, _or(
	_local,
	/.+gateway\.com\/\d+-es2015\..+/,
	/.*sigma.+\.s3-website-us-east-1\.amazonaws\.com/,
	/unpkg\.com\/@?(blueprintjs|normalize\.css)/,
	/raw\.githubusercontent\.com\/kristoferjoseph\/flexboxgrid\/master\/dist\/flexboxgrid\.min\.css/,
	/cdnjs\.cloudflare\.com\/ajax\/libs\/(monaco-editor|require\.js)/,
	/(cloudformation|lambda)\.\S+\.amazonaws\.com/,
	/s3(|\..+)\.amazonaws\.com\/com\..+\.sigma\.test/,
	/apis\.google\.com\/_\/scs/,
	/accounts\.google\.com\/ServiceLogin\/webreauth/,
	/content\.googleapis\.com\/(discovery\/v1\/apis|static\/proxy\.html)/,
	/content\.googleapis\.com\/(deploymentmanager|storage)/,
/*
	/apis\.google\.com\/js\/(api\.js|googleapis\.proxy\.js)/,
*/
	/accounts\.google\.com\/o\/oauth2\/iframe(|rpc)/,
	/mail-attachment.googleusercontent.com/,
	/ssl\.gstatic\.com\/accounts\/o/,
	/gitlab\.com\/users\/sign_in/,
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
window._regexSlackGif = /\/img\/test_cdn_pixel\.gif/;
window._regexSlack = _or(
/*
	/slack\.com\/api\/api\.test/,
*/
	_regexSlackGif
);
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



window._regexGAS = /script\.google\.com\/(sharing\/init|.+\/((bind|test|active)|exceptionService|gwt\/autocompleteService))/;
window._regexOgs = /ogs\.google\.com/;
window._regexGlog = /(play|clients\d)\.google\.com\/log/;
window._regexSlackErr = /slack\.com\/beacon\/error/;
window._regexGmail = /mail\.google\.com\/sync\/u\/\d\//;
window._regexGDocs = _seq(/docs\.google\.com\//, _or(
	/comments\/u\//,
	/.+\/(bind|test|active|hibernatestat|fetchData|save|sync)/,
	/.+\/(log|naLog)Impressions/
));

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
window._rwGmailDL = /mail-attachment\.googleusercontent\.com\/attachment\/u\/\d\/.+\bview=att\b/;
window._rwPaynr = /login\.payoneer\.com\/(brands|script)\//;
window._rwTwitAPI = /api\.twitter\.com\/2\/notifications\/(all|mentions)\.json/;
window._rwCCDL = /2s\.cc\/.+\/files\/.+\/download/;

window._rwAble = /\b(js|css|png)\b/;
window._rwIgnore = _or(
	_regexGAS,
	/cfl\.dropboxstatic\.com\//,
	/api\.slack\.com\/api\//,
	/virginia\.sessions\.logs\.heroku\.com\//,
	/X-Amz-Date=/,
	/support\.\w+\.com\/youtrack\/issue/,
	/(docs|drive|accounts)\.google\.com/,
	/www\.googleapis\.com/,
	/firestore\.googleapis\.com/,
	/mail\.google\.com\/(mail\/u\/\d|_\/scs\/mail-static\/_\/js\/)/,
	/hangouts\.google\.com\//,
	/google\.\w+\/search\?/,
	/recaptcha\/(api\.js|api2)/,
	/ssl\.gstatic\.com\/accounts\/static\/_/,
	/www\.(gstatic|google)\.com\/(recaptcha|_\/freebird)/,
	/encrypted-tbn0\.gstatic\.com/,
	/forums\.mozillazine\.org\/viewtopic\.php/,
	/support\.\w+\.com\/hub\/api\/rest\/oauth2\/auth/,
	/\.appspot\.com/,
	/linkedin\.com\/voyager\/api/,
	/media\.licdn\.com\/dms\/image/,
	/buyincoins\.com\/\?r=/,
	/youtube\.com\//,
	/\/_\/js\/k=/,
	/edge-chat\.facebook\.com\/pull/,
	/mangools\.com\//,
	/mailing\.dzone\.com\//,
	/as\w\d+\.tawk\.to\//,
	/help\.sap\.com\/http\.svc\/pagecontent/,
	/data\.pendo\.io\//,	//PingOne
	/api\.pingone\.asia\//,
	/(viewtopic|showthread)\.php/
);
window._rwCustomReq = /\/users\/codeheart\/requests\?/;
window._rwParams = new RegExp(_or(
	_seq(/\b/, _or(
		/d|date|version|timestamp|queryAfterTime|buildTime|buildVersion|build-number|timestamp|build|tseed|ver|uniq|cachebust/,
		/cx|_v|_t|v|t|ts|e|_|__|r|b|u|cb|rnd|tsp|spm/
	), /\b=[-a-z_0-9.:]+&?|\?_?[a-z_0-9]+$/
	),
	/moduleId=.*,scriptsPath=.*,isVdtMode=.+,nodePath=.*,ipAddress=.+,contextPath=.*/
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
window._block = function(channel, cause, noDebug) {
	channel.cancel(Components.results.NS_BINDING_ABORTED);
	!noDebug && !_isA(channel.URI.spec, _debugIgnore) && console.debug(channel.URI.spec, "blocked by", cause);
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
	else if (_isA(url, _rwGmailDL))
		_redir(channel, url.replace(/\bdisp=(safe|attd)\b/, "disp=zip"));
	else if (_isA(url, _rwPaynr))
		_redir(channel, url.replace(/-(\w{32}|\w{20})\./, "."));
	else if (_isA(url, _rwCCDL)) {
		var qry = url.indexOf("?");
		_redir(channel, url + (qry > 0 ? "&" : "?") + "res=360p&resolution=360p&alternative_resolution=360p"); // &res=360&resolution=360&alternative_resolution=360
	}
/*TODO fix CORS
	else if (_isA(url, _rwTwitAPI))
		_redir(channel, url.substring(0, url.indexOf("?")));
*/

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

window._regex5r = _seq(/www\.fiverr\.com\//, _or(
	/conversations\/mark_as_read/,
	/inbox\/contacts\/\w+$/,
));
window._regexChannels = _or(
	_seq(/\/rest\//, _or(
		/certificate\?/,
		/message\/(sent|received)/
	)),
	/\.com\/message\/(sent|received)/,
	/medium\.com\/p\/.+\/deltas/,
	/mpmulti-.+\.slack-msgs\.com/,
	/wss-(primary|backup)\.slack\.com/,
	/slack\.com\/(templates\.php\?|api\/api\.test)/,
	/(client-channel|clients\d|hangouts)\.google\.com/,
/*
	/mail\.google\.com\/mail\/u\/\d\/\?/,
*/
	_regexGmail,
	_regexGDocs,
	/mail\.google\.com\/sharing\/driveshare/,
	/trello\.com\/1\/(Session|batch)/,
	/(log|naLog)Impressions/,
	_regex5r,
	_regexSlackGif,
	/as\w\d+\.tawk\.to/,
	_seq(/\/\/[^/]*stack.+\.com\//, _or(
		/posts\/\d\/editor-heartbeat\/ask/,
		/api\/tags\/langdiv/
	)),
	/app\.talkjs\.com/,
	/sockets\.hashnode\.com/,
	_rwTwitAPI,
	/cognito-identity\..+\.amazonaws\.com/,
	/\.nationstrust\.com\/corp\/FinacleRiaRequest/,
	/sandbox-buy\.paddle\.com/,
	/(blog\/wp-content\/uploads\/|images\/full\/)/,
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
	/developers\.google\.com/,
	/medium\.com\/p\/import-story/,
	/cloudfront\.net/,
	/console\.aws\.amazon\.com/,
	/(docs|script|apis)\.google\.com/,
	/gstatic\.com/,
	/support\..+\.com/,
	/savefrom\.net/,
	/slack\.com/,
	/community\.hackernoon\.com/,
	/forum\.videolan\.org/,
	/accounts\.google\.com\/(o\/oauth2|signin\/oauth)\//,
/*
	/mail\.google\.com\/mail\/u\/\d\/$/,
*/
	/google\.com\/recaptcha\//,
	/\.amazonaws\.com|\/recaptcha\//
);
window._sitesVersioned = _or(
	/(docs|domains)\.google\.com/,
	/www\.fiverr\.com/,
	/support\..+\.com\/youtrack\/oauth/
);
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
	/www\.facebook\.com\//,
	/facebook\.com\/sem_pixel/,
	/connect\.facebook\.net/,
	/facebook\.com\/connect\/ping/,
	/facebook\.com\/(v[0-9.]+\/)?plugins\/(page|like(box)?)\.php/,
	/\/\/twitter\.com/,
	_seq(/api\.twitter\.com\//, _or(
		/1\.1\/(jot|live_pipeline|dm\/user_updates\.json)/,
		/2\/badge_count/
	)),
	/platform\.twitter\.com\//
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
		if (gbUrl != "about:newtab" && !url.startsWith(origin) &&
			!url.startsWith("https://encrypted-tbn0.gstatic.com") && !url.startsWith("https://www.gstatic.com")) {
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

window._regexMedia_common = _or_nowrap(
	/\b(woff|woff2|ttf|otf|\.eot|mp3|mp4|m4a|ico|ogv|ogg|webm|gif|wav)\b/,
	/sarigama\.lk\/.+stream\?token=/,
	/(fonts|maps|content)\.googleapis\.com/,
	/google\.com\/maps\/embed/,
	/henhouse/,
	/\.webpack/,
	/\/gps\/event/,
	/\bgen_204\b/,
	/ssl\.gstatic\.com\/gb\/images/,
	/www\.gstatic\.com\/charts\//,
	/apis\.google\.com\/js\/(plusone|platform)\.js/,
	/platform\.linkedin\.com\/js\/secureAnonymousFramework/,
	/explorer\.apis\.google\.com/,
	/(ssl\.)?google-analytics\.com/,
	/survey\.g\.doubleclick\.net|seal\.geotrust\.com|alexa\.com|cdn\.optimizely\.com|doubleclick\.net/,
	/www\.youtube\.com\/embed|s\.ytime\.com/,
	/google\.com\/adsense/,
	/www\.google\.com\/search/,
	/google\..+\/(log|browserinfo|imgevent)\b/,
	/forter.com/,
	/wiki([pm]edia\.org\/w|\b)\/load\.php/,
	/pagead2\.googlesyndication\.com/,
	/apis-explorer\.appspot\.com/,
	/developers\.google\.com\/profile\/userhistory/,
	/www\.googletagmanager\.com/,
	/radar\.cedexis\.com|intercom\.io|intercomcdn\.com|api\.qualaroo\.com/,
	/support\.google\.com\/[^/]+\/apis/,
	/stackoverflow.com\/answers\/\d+\/ivc/
);
window._regexMedia_cloud = _or_nowrap(
	/s3\.amazonaws\.com\/ki\.js/,
	/d1\.awsstatic\.com\/.+\.(jpg|png)/,
	/signin\.aws\.amazon\.com\/oauth.+forceMobileLayout=0&forceMobileApp=0/,
	_seq(/console\.aws\.amazon\.com\//, _or(
		/.+\/logger\//,
		/support\/(operation\/(describeDynamicHelp|getRecommendationsForSupportCase|saveCaseDraft)|invoke\/describe(Operations|Communications))/,
		/p\/log\/\d\/support\/1\/OP/,
		/support\/analytics\/SC_OP/
	)),
	/amazon-adsystem\.com/,
	/g2crowd\.com\/(.+\/events|ahoy\/.+)/,
	_seq(/www\.fiverr\.com\//, _or(
		/quick_responses|js_event_tracking|tag_manager|report_payload_(events|counter)/,
		/transmitter\/api\//,
		/(conversations|notification_items)\/preview/,
		/inbox\/(counters|contacts(\?|\/\w+\/info))/
	)),
	/dev\.appboy\.com|(rt2|jen|collector)\.fiverr\.com/,
	/player\.vimeo\.com\/video\/233549644/,
	_regexGAS,
	/\/image-s\d-\dx\.jpg/,
	_seq(/bitbucket\.org\//, _or(
		/emoji/,
		_seq(/\!api\//, _or(
			/internal\/analytics\/events/,
			/.*\/pullrequests\/\d+.+(participants|merge-restrictions|updates)/,
		)),
		/xhr\/analytics\/events/
	)),
	/api-private\.atlassian\.com\/gasv3\/api\//,
	/google\..+\/(jserror|links\?|linkdetails\?)/,
	_seq(/dropbox\.com\//, _or(
		/jse|unity_connection_log|get_info_for_quota_upsell/,
		/alternate_wtl_browser_performance_info|log_js_sw_data|log|alternate_wtl|2\/notify\/subscribe/
	)),
);
window._regexMedia_slack = _or_nowrap(
	_seq(/slack\.com\//, _or(
		/.+undefined/,
		/messages.+/,
		_seq(/api\//, _or(
			/messages\.list/,
			/experiments\./,
			/api\.features/,
			/api\.test/,
			/apps\.actions|subscriptions\.thread\.get/,
			/apps\.getSidebarPrompts|dnd\.info|bots\.info/,
			/team\.(info|whatsNew|listExternal|admins\.list)/,
			/drafts\..+/,
			/promo\.getEligibleOffer|helpcenter\.getWhatsNew|subteams\.membership/,
			/dnd\.teamInfo|promo\.banner|apps\.list|commands\.list|i18n\.translations\.get|client\.shouldReload/,
			/conversations\.(genericInfo|close|teamConnections)/,
			/search\.(modules|precache|autocomplete(|\.fileSuggestions))/,
			/users\.prefs\.set/,
			/channels\./,
			/calendar\./,
			/bookmarks\.list/,
			/megaphone\./,
			/files\.list|links\.getDomains|sharedInvites\.canGetLink|help\.issues\.ticketStats/,
			/users\.(customStatus|channelSections|interactions)\.list/,
			/rtm\.shouldReload|ublockworkaround\.history|auth\.currentSessions/,
			/emoji(|\.collections)\.list|apps\.profile\.get|help\.issues\.list|users\.counts|users\.info|channels\.suggestions/
		))
	)),
	/slackb\.com\/traces\/v1\/list_of_spans\/json/,
	_seq(/edgeapi\.slack\.com\/.+\//, _or(
		/(users|channels)\/(info|list)/,
		/emojis/
	)),
	/slack-imgs\.com\/.+production-standard-emoji-assets/,
	_seq(/linkedin\.com\//, _or(
		/tscp-serving\/dtag/,
		/csp\/dtag|realtime\/connect|li\/track/,
		_seq(/voyager\//, _or(/abp-detection\.js/,
			_seq(/api\//, _or(
				/messaging\/(badge|presenceStatuses|conversations(\?action|\/\d+\/events($|\?reload=true)))/,
				/identity\/cards|legoWidgetImpressionEvents|feed\/(hovercard|richRecommendedEntities)/,
				/growth\/(suggestedRoutes|emailsPrefill|socialproofs)/,
				/relationships\/(peopleYouMayKnow|connectionsSummary)/,
				/voyagerGrowthEmailDomainResolutions/
			))
		))
	)),
);
if (window._regexMedia_common && window._regexMedia_cloud && window._regexMedia_slack &&
	window._regexMedia_other_1 && window._regexMedia_other_2) {
	window._regexMedia = _or(
		_regexMedia_common,
		_regexMedia_cloud,
		_regexMedia_slack,
		_regexMedia_other_1,
		_regexMedia_other_2
	);
}

window._regexMedia_other_1 = _or_nowrap(
	/((\/\/hackernoon|medium)\.com|medium\.freecodecamp\.org)(\/$|\/_\/(batch|oh-noes))/,
	_seq(/medium\.com\//, _or(
		/_\/fp\/css\/(fonts-base|main-notes\.bundle)/,
		/_\/lite\/.+/,
		/media\/|_\/(batch|activity-status)|.*\/state\/location|me\//,
		/_\/api\/(activity|placements|users|.+\/(responsesStreams|responses|collections))/,
		/.+\/(notes|quotes|upvotes)/
	)),
	/collector-medium\.lightstep\.com/,
	/cdn-images-\d\.medium\.com\/proxy\//,
	/media\/\w{32}\?postId=/,
	/bam\.nr-data\.net\//,
	/\/uconsole\/services\/metrics\/retrieveMultiGauges/,
	/www\.google\.com\/coop\/cse\/brand/,
	/\.google\.com\/(_s\/getsuggestions|profile\/userhistory)/,
	_seq(/api\.github\.com\//, _or(
		/users\/\w+\/repos/,
		/user\/repos/,
		/_private\/browser\/stats/
	)),
	/live\.github\.com\//,
	/github\.com\/.+\/pull\/\d+\/show_partial/,
	/www\.googleapis\.com\/urlshortener\/v1\/url/,
	_seq(/support\.\w+\.com\//, _or(
		/hub\/api\/rest\/hubfeatures/,
		_seq(/youtrack\//, _or(
			/_events\?|error|rest\/(profile\/hasUnseenFeatures|user\/banner\/content|statistics)/,
			_seq(/api\//, _or(
//				/agileUserProfile|.+\/(timeTrackingSettings|propertiesProfile)|seenFeatures|featureFlags/,	//tiny
//				/users\/me/,	// 15K
//				/issuesGetter/,	// 155K
				/search\/assist/,
				/inbox\/threads/,
				/admin\/.+\/notifications/,
				/analytics|wikify/,
				/issues\/.+\/(activities|watchers)/
			))
		))
	)),
);
window._regexMedia_other_2 = _or_nowrap(
	/cdn\.ravenjs\.com/,
	/live-detector\.svc\.transifex\.net/,
	/www\.statcounter\.com\/counter\/counter\.js/,
	/_Incapsula_Resource/,
	/tripleclicks\.com\/(shared\/ajax\/notifications|games\/.*\/Badges)/,
	/wp-includes\/js\/zxcvbn/,
	/previewlg_\d+/,
	/translate_a\/element\.js/,
//	/data\.jsdelivr\.com|cdn\.jsdelivr\.net/,
	/mod_pagespeed_beacon/,
	/assets\.alicdn\.com\/g\/alilog/,
	/gstatic\.com\/support/,
	_or(
		/slant\.co\/.*(viewpoints|related|tags|activity).+format=json/,
		/slant-api\.com\/(batch\/(rec-page|q-user-page)|.+entities\/user)/
	),
	/youtube\.com\/iframe_api|PlusAppUi/,
	/videoplayback/,
	/\.sfimg\.com\/(shared\/ajax\/notifications|ajax\/chat)/,
	/trustradius\.com\/locales\/resources\.json/,
	/quora\.com\/.+(log_browser_|time_on_site_|m=(fetch_toggled_component|get_next_page))/,
	/microsoft\.com\/app\/content/,
	/app\.prosperworks\.com\/api\/.+\/split_flaps\/check/,
	_seq(/\.nationstrust.com\/corp\//, _or(
		/json\/(BS_MS_RS_001|BS_QL_RA_001)/,
		/consumer\/images\/mImages\/reload\.png/, // 404
		/scripts\/appNew\.js/,
//		/scripts\/module\/.+\/(NPFTotalAmountCalculator|cpregistration_phase2)\.js/
	)),
	/accounts\.google\.com\/ListAccounts/,
	/aa\.google\.com\//,
	/ipinfo\.io/,
	/.+\.qualtrics\.com/,
	//intellij-support.jetbrains.com
	/\/hc\/tracking\/events/,
	/htmlcommentbox\.com\//,
	/pusherism\.com/,
	/(m|js)\.stripe\.com/,
	/drlimmode9ddd\.cloudfront\.net/,
	/\w+\.cloudfront\.net\/\?\w+=\d+/,
	/(forms|api)\.hubspot\.com/,
	/\/page-data\/(.+\/page-data\.json|app-data\.json)/,	// paypal, sendgrid etc docs
	/sendgrid.api-docs\.io\/sockjs/,
	/1389.html/, // dzone
	/paypal\.com\/sdk\/js/,
	/cdn\.paddle\.com\/paddle\//,
	/jetpack\.wordpress\.com\//,
	/rollbar\.com/
);

window._regexMedia = _or(
	_regexMedia_common,
	_regexMedia_cloud,
	_regexMedia_slack,
	_regexMedia_other_1,
	_regexMedia_other_2
);

_regexPendoGif = /data\.pendo\.io\/data\/ptm\.gif\//	//PingOne
window._mediaIgnore = _or(
	/dashboard\.tawk\.to/,
	_regexSlackGif,
	_regexPendoGif,
	/(jetbrainsresearch\..+|jfe-cdn)\.qualtrics\.com/
);

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



// META (extra data)

window._regexMeta = _or(
/*
	_seq(/slack\.com\/api\//, _or(
		/conversations\.mark/
	)),
*/
	/firestore\.googleapis\.com\/.+\/Listen\/channel/,
	_seq(/\.slack\.com\/api\//, _or(
		/files\/list/
	)),
	_seq(/edgeapi\.slack\.com\/cache\/\w+\//, _or(
		/channels\/(membership|search)/,
		/users\/(list|search)/
	))
);

window.toggleMeta = window.toggleMeta || function() {
	toggleService.toggle('meta', function(channel) {
		if (_isA(channel.URI.spec, _toggleIgnore)) {
			return;
		}
		if (_isA(channel.URI.spec, _regexMeta)) {
			_block(channel, "meta");
		} else if (_isA(channel.URI.spec, /conversations\.history/) && !channel.referrerInfo.originalReferrer.spec.endsWith("/unreads")) {
			// block history loading by default
			_block(channel, "meta");
		}
	}, {
		title: "Meta Blocked",
		body: "Metadata URLs in Slack etc. will be blocked."
	}, {
		title: "Meta Unblocked",
		body: "Metadata URLs in Slack etc. will load normally."
	});
};
toggleMeta();



// NO EXPIRY

window._regexNoCache = _or(
//	/googleusercontent\.com/,
	/youtrack\/(oauth|hub\/api\/rest\/oauth2\/auth)/,
	/signin\.aws\.amazon\.com\/oauth/,
	/127\.0\.0\.1|localhost|192\.168\./,
/*
	/(accounts|myaccount)\.google\.com/,
*/
	/accounts\.mobitel\.lk\/samlsso/,
	/kotrivia\.appspot\.com/
);
window._regexDoCache = _or(
	/mail\.google\.com\/mail\/u\/\d/,
	/mail-attachment\.googleusercontent\.com\/.+disp=emb/,
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

			channel.setResponseHeader("Content-Security-Policy", "", false);
			channel.setResponseHeader("content-security-policy", "", false);
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
	/support\.google\.com\/accounts\/answer\/32050/,
	/\d+\.client-channel\.google\.com\/client-channel/,
	/hangouts\.google\.com\/(hangouts|webchat|_\/scs)/,
	/notifications\.google\.com\/.*\/idv2/,
	/csp[-_]?report/,
	/\bcsp\b/,
	/soschildrensvillages\.lk\/ScriptResource\.axd/,
	/hnbpg\.hnb\.lk\/.+\/HNBStyles\.css/,
	_regexOgs,
	/slack\.com\/(humans\.txt|clog\/track|beacon\/timing|.+\bforce_cold_boot=1)/,
	/embed\.tawk\.to/,
	/qa\.sockets\.stackexchange\.com/,
	/tawk\.to\/log/,
	/dashboard\.tawk\.to\/$/,
	_regexGlog,
	_regexSlackErr,
	/pinpoint\..+\.amazonaws\.com/,
	/analytics\.console\.aws\.a2z\.com/,
	_seq(/console\.aws\.amazon\.com\//, _or(
		/apigateway\/api\/lambda/,
		/rds\/status/,
		/ec2\/v2\/jsErrorLogging/,
	)),
	/zc7prmwsbi\.execute-api\.us-east-1\.amazonaws\.com\/default/,
	/\.execute-api\.us-east-1\.amazonaws\.com\/prod\/[^/]+Analytics/
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
	/\.(jss?|jtp)\b|\/js\/|_js[^o]/,
	/alt=json-in-script/,	// blogger
	/\b_static\b.+js/,
	/\b(axd|jsx)\b/,	// extension
	/\bakam\b/, // MS docs
	/_Incapsula_Resource/,
	/load-scripts\.php/,
	/\bas[ph]x?\b/,	// unnecessary ASPs; may even be CSS
	/jsapi/,
	/\bjs_inst\b/,	// m.twitter login
	/\/js\.php/,
	/(static|og|xjs)\/_\/js/,
	/load\.php\?debug=false/,
	/kb\.mozillazine\.org\/index\.php.+gen=js/,
	/mail\.google\.com\/mail\/u\/\d(\/h\/_\/.+v=mjs|.+view=)/,
	/accounts\.google\.com\/gsi\/client/,
	/techcrunch\.com\/_static\//,
	/tag\.vlitag\.com/,
//	/\/js\.stripe\.com\//,
	/forums\.aws\.amazon\.com\/resources\/merge\|messagepost/,
	/jsi18n/
);

window.toggleJS = window.toggleJS || function() {
	toggleService.toggle('js', function(channel) {
		if (cHeader(channel, "Sec-Fetch-Dest") == "script" || (
			!_isA(channel.URI.spec, _toggleIgnore) && _isA(channel.URI.spec, _regexJS))) {
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
	/\bcss\b/,
	/s\d\.wp\.com\/_static/,
	/style\.php/,
	/load-styles\.php/,
	/\/_\/(css|ss)/,
	/load\.php\?debug=false/,
	/mail\.google\.com\/mail\/u\/\d\/h\/_\/.+v=ss/
);

window.toggleCSS = window.toggleCSS || function() {
	toggleService.toggle('css', function(channel) {
		if (!_isA(channel.URI.spec, _toggleIgnore) && (
			(cHeader(channel, "Accept") || "").startsWith("text/css") ||
			_isA(channel.URI.spec, _regexCSS))) {
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

window._imgIgnore = _or(
	_local,
	_regexPendoGif,
	_regexSlackGif
);
/*
window.prefSvc = Cc['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch("");
*/

window._regexImages = _or(
	/\b(svg|webp)\b/
);
window.toggleImages = window.toggleImages || function() {
/*
	showImages = 2 - prefSvc.getIntPref("permissions.default.image");
	prefSvc.setIntPref("permissions.default.image", showImages);
	notify(showImages, showImages ? "Images Blocked" : "Images Unblocked", "Images will be " + (showImages ? "blocked." : "displayed."));
*/
	toggleService.toggle('images', function(channel) {
		if (((cHeader(channel, "Accept") || "").startsWith("image/") || _isA(channel.URI.spec, _regexImages))
			&& !_isA(channel.URI.spec, _imgIgnore)) {
			_block(channel, "images", true);
		}
	}, {
		title: "Images Blocked",
		body: "Images will be blocked."
	}, {
		title: "Images Unblocked",
		body: "Images will be displayed."
	});
};
toggleImages();



// YOUTRACK

window._regexYT = _or(
	_seq(/support\.\w+\.com\//, _or(
		/hub\/api\/rest\/(permissions|settings\/public|oauth2\/auth)/,
		_seq(/youtrack\//, _or(
			/api\/(config)/
		))
	))
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
	/https?:\/\/(localhost|127\.0\.0\.1|192\.168\.)/,
	/script\.google\.com\/(macros|a\/macros\/[^\/]+)\/s\//,
	/www\.dialog\.lk\/(dlg\/|)browse\/reloadPayBillOnline/,
	/mail\.google\.com\/mail\/u\/\d\/.+(view=(fimg|att)|v=att)/,
	/www\.mailing\.dzone\.com\/click\.html/,
	/stackoverflow\.com\/landing\/r\/digest/,
	/accounts\.google\.com\/o\/oauth2\//
);

window.toggleNoRedirect = window.toggleNoRedirect || function() {
	toggleService.toggleResponse('noredirect', function(channel) {
		if (_isA(channel.URI.spec, _noredirIgnore)) {
			return;
		}
		if ([301, 302, 307].includes(channel.responseStatus)) {
			try {
				if (channel.URI.scheme == "http" && channel.getResponseHeader("Location") == channel.URI.spec.replace("http:", "https:")) {
					return;
				}
			} catch (e) {}
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
toggleNoRedirect();



// OFFLINE

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



// RELOAD

var _offline = BrowserOffline._uiElement;
window.cHeader = function(channel, key) {
	try {
		return channel.getRequestHeader(key);
	} catch (e) {
		return undefined;
	}
};
window._xhrMatch = function(channel) {
	url = channel.URI.spec;
	gotXhr = (
		(url.indexOf("trello") > 0 && (cHeader(channel, "X-Requested-With") || cHeader(channel, "X-Trello-Client-Version"))) ||
		url.indexOf("gwt/autocompleteService") > 0 || url.indexOf("gwt/ideService") > 0
	);
	return _offline.getAttribute("checked") == "true" && gotXhr;
}
window.toggleXhrOnline = window.toggleXhrOnline || function() {
	toggleService.toggle('xhronline', function(channel) {
		if (_xhrMatch(channel)) toggleOffline();
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
	77: [
		{ctrl: true, shift: true, alt: true, handler: toggleMeta}
	],
	79: [
		{ctrl: true, shift: true, alt: false, handler: toggleOffline},
		{ctrl: false, shift: true, alt: true, handler: toggleOffline},
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
	],
	121: [
		{ctrl: true, shift: false, alt: true, handler: toggleYT}
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
