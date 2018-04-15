// OFFLINE

// notification generator
window.__notifyElem = Cc["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService).showAlertNotification;
window.notify = function(enabled, title, body) {
	__notifyElem("chrome://mozapps/skin/extensions/alerticon-info-" + (enabled ? "positive" : "negative") + ".svg", title, body, false, "", null, "");
};

// provides toggle functions and status maintenance
window.toggleService = {
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
window._toggleIgnore = /^https?:\/\/(127\.0\.0\.1|192\.168\.|localhost|unpkg\.com\/@?(blueprintjs|normalize\.css)|raw\.githubusercontent\.com\/kristoferjoseph\/flexboxgrid\/master\/dist\/flexboxgrid\.min\.css|cdnjs\.cloudflare\.com\/ajax\/libs\/(monaco-editor|require\.js)|(cloudformation|lambda)\.\S+\.amazonaws\.com|s3(|\..+)\.amazonaws\.com\/com\.slappforge\.sigma\.test|apis\.google\.com\/_\/scs|docs\.google\.com\/document\/)/;

// disable reconnection attempts on Slack
window._regexSlack = /slack\.com\/api\/api\.test/;
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
	if (!isOffline && (channelsDown || slackDown)) {
		setTimeout(function() {
			notify(false, "Channels Disabled", "Channels are still offline.");
		}, 2000);
	}
};
toggleOffline();



// RW

window._uriSvc = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

window._rwHackerStack = /\bhackerrank\.com\b|\/posts\/\d+\/comments/;
window._rwGAE = /\bappengine\.google\.com\/(css|js)/;
window._rwGoogleDev = /\b(cloud|developers)\.google\.com\/_static\/\w{10,}\//;
window._rwMDN = /developer\.cdn\.mozilla\.net\/static\//;
window._rwGoogleIssues = /issuetracker\.google\.com\/.+\.(css|js)?/;
window._rwBlogger = /www\.blogger\.com\/dyn-css\//;
window._rwSpring = /spring\.io\/.+\.(js|css)/;
window._rwImgSrch = /www\.google\.[a-z]*\/async\/imgrc\?/;
window._rwReddit = /redditstatic\.com\//;
window._rwMozMedia = /mozilla\.org\/media\//;
window._rwAliExpress = /i\.alicdn\.com\/\S+\/.*\?\?/;

window._rwAble = /\b(js|css|png)\b/;
window._rwIgnore = /(docs|drive|accounts)\.google\.com|www\.googleapis\.com|mail\.google\.com\/mail\/u\/\d\/(x|h)|google\.\w+\/search\?|\/xjs\/_\/js\/|recaptcha\/api2\/webworker\.js|ssl\.gstatic\.com\/accounts\/static\/_\/|forums\.mozillazine\.org\/viewtopic\.php/;
window._rwCustomReq = /\/users\/codeheart\/requests\?/;
window._rwParams = /\b(d|date|version|timestamp|buildTime|build-number|build|tseed|ver|cx|_v|_t|v|t|_|r|b|u|q|cb|rnd|tsp|spm)\b=[-a-z_0-9.:]+&?|\?_?[a-z_0-9]+$/ig;

/*
window._search = window._search || {};
window._replace = window._replace || {};

url5r = 'https://assetsv2.fiverrcdn.com/';
window._search[url5r] = [
/\/conversations-\w+\.css/,
/\/conversations-\w+\.js/,
/\/jquery\.uploadifive-\w+\.js/,
/\/application-\w+\.js/,
/\/application-\w+\.css/,
/\/application-deferred-\w+\.css/,
/\/application-dependencies-\w+\.js/,
/\/application-legacy-\w+\.js/,
/\/orders-\w+\.css/,
/\/orders-\w+\.js/,
/\/reconnecting\.websocket-\w+\.js/,
/\/global-gig-listings-\w+\.js/,
/\/global-gig-listings-\w+\.css/,
/\/marketplace-\w+\.css/,
/\/user-dashboard-\w+\.css/,
/\/jquery\.inline-alert-\w+\.js/,
/\/todos-\w+\.js/,
/\/page-filter-actions-\w+\.css/,
/\/react-quick_responses-\w+\.css/,
/\/react-quick_responses-\w+\.js/,
/\/react-attachment_preview-\w+\.css/,
/\/polyfills-\w+\.js/,
/\/instantImpressions-\w+\.js/,
/\/jquery-2.1.4.min-\w+\.js/,
/\/translations.en-\w+\.js/,
/\/emoji-helper-\w+\.js/,
/\/popup-report-message-\w+\.js/,
/\/popup-report-message-\w+\.css/,
/\/footer-\w+\.css/,
/\/help-menu-\w+\.css/,
/\/fHelpMenu-\w+\.js/,
/\/appboy.min-\w+\.css/,
/\/appboy.min-\w+\.js/,
/\/notification-drawer-\w+\.css/,
/\/notification-drawer-\w+\.js/,
/\/appboy-overrides-\w+\.css/,
/\/tab-manager-\w+\.js/,
/\/fiverr-realtime-\w+\.css/,
/\/fRealTime-\w+\.js/,
/\/requests-\w+\.js/,
/\/offers-shared-\w+\.css/,
/\/offers-shared-\w+\.js/,
/\/react-order_notes_show-\w+\.css/,
/\/react-order_notes_show-\w+\.js/,
/\/global-social-sharing-\w+\.js/,
/\/popup-base-\w+\.js/,
/\/global-gig-cards-\w+\.css/,
/\/react-inbox-\w+\.css/,
/\/react-inbox-\w+\.js/,
/\/todos-\w+\.js/,
/\/popup-order-social-share-\w+\.js/,
/\/orders-share-deliveries-\w+\.js/,
/\/manage_gigs-\w+\.js/,
/\/passable-\w+\.js/,
/\/react-seller_profile_form_thin-\w+\.css/,
/\/react-seller_profile_form_thin-\w+\.js/,
/\/users-\w+\.css/,
/\/users-\w+\.js/,
/\/seller-popup-\w+\.css/,
/\/fNow-\w+\.js/,
/\/CountryAutocomplete-\w+\.js/,
/\/phone-verification-\w+\.js/,
/\/templates-popups-\w+\.js/,
/\/convDeprecationEvents-\w+\.js/
];

urlBb = 'https://d301sr5gafysq2.cloudfront.net/';
window._search[urlBb] = [
/\/css\/entry\/vendor\.css/,
/\/css\/entry\/app\.css/,
/\/css\/entry\/adg3\.css/,
/\/dist\/webpack\/app\.js/,
/\/dist\/webpack\/vendor\.js/,
/\/dist\/webpack\/sentry\.js/,
/\/dist\/webpack\/early\.js/,
/\/dist\/webpack\/common\.js/,
/\/dist\/webpack\/pullrequests\.js/,
/\/dist\/webpack\/1\.chunk\.js/,
/\/dist\/webpack\/word-diff-worker\.js/,
/\/dist\/webpack\/locales\/en\.js/,
/\/dist\/webpack\/dashboard\.js/,
/\/dist\/webpack\/repo-admin\.js/,
/\/jsi18n\/en\/djangojs\.js/
];

urlPPal = 'https://www.paypalobjects.com/';
window._search[urlPPal] = [
/\/web\/res\/\w+\/\w+\/css\/contextualLogin\.css/,
/\/auth\/createchallenge\/\w+\/challenge.js/,
/\/js\/lib\/tealeaf-ul-prod_domcap\.min\.js/,
/\/css\/app\.ltr\.css/,
/\/css\/paypal-sans\.css/,
/\/css\/summary\.ltr\.css/,
/\/js\/apps\/app\.js/,
/\/js\/apps\/3\.3\.js/,
/\/widgets\/ajaxError\.js/,
/\/dust-templates\.js/,
/\/languagepack\.js/,
/\/widgets\/overpanel\.js/,
/\/summary\/inc\/fiModule\/fiList\.js/,
/\/activity\/transactionItemSimple\.js/,
/\/txndetails\/modules\.js/,
/\/txndetails\/inc\/layout\.js/,
/\/css\/wallet\.ltr\.css/,
/\/js\/apps\/1\.1\.js/,
/\/eboxapps\/css\/\w+\//,
/\/eboxapps\/css\/\w+\//,
/\/eboxapps\/css\/\w+\//,
/\/eboxapps\/js\/\w+\//,
/\/css\/app-service-nav\.ltr\.css/,
/\/js\/index\.js/,
];

urlPPAuth = 'https://www.paypal.com/auth/createchallenge/';
window._search[urlPPAuth] = [/challenge\.js/];

urlTrello = 'https://a.trellocdn.com/';
window._search[urlTrello] = [
/\/snowplow\.js/,
/\/quickload\.js/,
/\/ltp\.js/,
/\/locale\.en-US\.js/,
/\/app\.js/,
/\/core\.css/,
/\/images\.css/,
// https://trello.com/1/boards/58c182fa6a2274fdeeff4ff3/plugins
// https://rules.quantcount.com/rules-p-9tnwrxnK1azF1.js
// https://bello.atlassian.io/index.6bd8e18b3a5707deeb51.js
// https://cdn.segment.com/analytics.js/v1/8Sa7pJhJNl2oAwmmg0bs5LotU31HtsmE/analytics.min.js
];

urlSlack = 'https://a.slack-edge.com/';
window._search[urlSlack] = [
/\/style\/rollup-plastic\.css/,
/\/style\/libs\/lato-2-compressed\.css/,
/\/style\/_helpers\.css/,
/\/style\/signin\.css/,
/\/style\/index\.css/,
/\/style\/sticky_nav\.css/,
/\/style\/footer\.css/,
/\/style\/rollup-client_core\.css/,
/\/style\/rollup-client_primary\.css/,
/\/style\/typography\.css/,
/\/style\/rollup-client_general\.css/,
/\/style\/rollup-client_secondary\.css/,
/\/style\/rollup-client_base\.css/,
/\/style\/date_picker\.css/,
/\/style\/libs\/quill\.core\.css/,
/\/style\/texty\.css/,
/\/style\/rollup-slack_kit_legacy_adapters\.css/,
/\/style\/account_settings\.css/,
/\/bv1-1\/webpack\.manifest\.\w+\.min\.js/,
/\/bv1-1\/emoji\.\w+\.min\.js/,
/\/bv1-1\/rollup-core_required_libs\.\w+\.min\.js/,
/\/bv1-1\/rollup-core_required_ts\.\w+\.min\.js/,
/\/bv1-1\/handlebars_4010\.\w+\.min\.js/,
/\/bv1-1\/TS\.web\.\w+\.min\.js/,
/\/bv1-1\/rollup-core_web\.\w+\.min\.js/,
/\/bv1-1\/rollup-secondary_a_required\.\w+\.min\.js/,
/\/bv1-1\/rollup-secondary_b_required\.\w+\.min\.js/,
/\/bv1-1\/application\.\w+\.min\.js/,
/\/bv1-1\/slack_beacon\.\w+\.min\.js/,
/\/bv1-1\/webpack\.manifest\.\w+\.min\.js/,
/\/bv1-1\/bootstrap-client\.\w+\.min\.js/,
/\/bv1-1\/emoji\.\w+\.min\.js/,
/\/bv1-1\/rollup-core_required_libs\.\w+\.min\.js/,
/\/bv1-1\/rollup-core_required_ts\.\w+\.min\.js/,
/\/bv1-1\/handlebars_4010\.\w+\.min\.js/,
/\/bv1-1\/rollup-client\.\w+\.min\.js/,
/\/bv1-1\/TS\.highlights_briefing\.\w+\.min\.js/,
/\/bv1-1\/TS\.utility\.window\.\w+\.min\.js/,
/\/bv1-1\/TS\.files\.gdrive\.\w+\.min\.js/,
/\/bv1-1\/TS\.files\.onedrive\.\w+\.min\.js/,
/\/bv1-1\/TS\.ui\.current_status_input\.\w+\.min\.js/,
/\/bv1-1\/rollup-secondary_a_required\.\w+\.min\.js/,
/\/bv1-1\/rollup-secondary_b_required\.\w+\.min\.js/,
/\/bv1-1\/application\.\w+\.min\.js/,
/\/bv1-1\/focus-ring\.\w+\.min\.js/,
/\/bv1-1\/lz-string-[\d.]+\.worker\.\w{20,}\.js/,
/\/bv1-1\/TS\.client\.ui\.channel_insights\.\w+\.min\.js/,
/\/bv1-1\/TS\.web\.account_settings\.\w+\.min\.js/,
/\/bv1-1\/username_format\.\w+\.min\.js/,
/\/bv1-1\/zxcvbn\.\w+\.min\.js/,
/\/bv1-1\/format-message-parse-tokens\.\w+\.min\.js/,
/\/bv1-1\/message-format\.\w+\.min\.js/,
/\/bv1-1\/TS\.min\.\w+\.min\.js/,
/\/bv1-1\/TS\.i18n\.\w+\.min\.js/,
/\/bv1-1\/TS\.clog\.\w+\.min\.js/,
/\/bv1-1\/signals\.\w+\.min\.js/,
/\/bv1-1\/sticky_nav\.\w+\.min\.js/,
/\/bv1-1\/spin\.\w+\.min\.js/,
/\/bv1-1\/ladda\.\w+\.min\.js/,
/\/bv1-1\/footer\.\w+\.min\.js/,
/\/bv1-1\/jquery\.\w+\.min\.js/,
/\/bv1-1\/Intl\.\w+\.min\.js/,
/\/bv1-1\/warn_capslock\.\w+\.min\.js/,
/\/bv1-1\/modern\.vendor\.\w+\.min\.js/,
/\/bv1-1\/codemirror\.min\.\w+\.min\.js/,
/\/bv1-1\/simple\.\w+\.min\.js/,
/\/bv1-1\/codemirror_load\.\w+\.min\.js/,
];

urlSlackTmpl = ".slack.com/templates.php?cb=";
_search[urlSlackTmpl] = [/templates\.php\?cb=/];

urleBayDev = '://ir.ebaystatic.com/rs/c/';
window._search[urleBayDev] = [
[/hello-\w+\.css/, 2],
[/reset-\w+\.css/, 2],
[/fyp-\w+\.css/, 2],
[/auth-\w+\.css/, 2],
[/keys-\w+\.css/, 2],
[/profile-\w+\.css/, 2],
/hello-\w+\.js/,
/reset-\w+\.js/,
/fyp-\w+\.js/,
/auth-\w+\.js/,
/keys-\w+\.js/,
/profile-\w+\.js/,
];

urleBay = 'https://secureir.ebaystatic.com/rs/v/';
window._search[urleBay] = [
[/\w+\.css/, 5],
[/\w+\.js/, 7],
];

urlEBForum = '://forums.developer.ebay.com/';
window._search[urlEBForum] = [/\/css\/bootstrap\.min\.css/];

urlGH = 'https://assets-cdn.github.com/assets/';
window._search[urlGH] = [
/mobile-\w+\.css/,
/mobile-\w+\.js/,
/frameworks-\w+\.css/,
/frameworks-\w+\.js/,
/github-\w+\.css/,
/github-\w+\.js/,
/compat-\w+\.js/,
];

urlDZ1 = '://dz2cdn3.dzone.com/';
window._search[urlDZ1] = [[/-combined\.css/, 2]];
urlDZ2 = '://dz2cdn2.dzone.com/';
window._search[urlDZ2] = [[/-combined\.js/, 2]];

urlGAS = 'https://script.google.com/';
window._search[urlGAS] = [
/\/client\/css\/\d+-MaestroIdeShellCss_ltr.css/,
/\/client\/js\/\d+-code_mirror_bin_code_mirror.js/,
/\/client\/js\/\d+-maestro_ide_shell_bin_i18n_maestro_ide_shell\.js/,
/\/gwt\/googleappsscripts\.nocache\.js/,
/\/sharing\/init/,
/\/gwt\/\w+\.cache\.js/,
/\/static\/\d+-Browser/,
/\/static\/\d+-CacheService/,
/\/static\/\d+-CalendarApp/,
/\/static\/\d+-Charts/,
/\/static\/\d+-GmailApp/,
/\/static\/\d+-ContactsApp/,
/\/static\/\d+-ContentService/,
/\/static\/\d+-DocumentApp/,
/\/static\/\d+-DriveApp/,
/\/static\/\d+-FormApp/,
/\/static\/\d+-PropertiesService/,
/\/static\/\d+-GroupsApp/,
/\/static\/\d+-ScriptApp/,
/\/static\/\d+-ScriptProperties/,
/\/static\/\d+-Session/,
/\/static\/\d+-SpreadsheetApp/,
/\/static\/\d+-UiApp/,
/\/static\/\d+-UrlFetchApp/,
/\/static\/\d+-UserProperties/,
/\/static\/\d+-Utilities/,
/\/static\/\d+-XmlService/,
/\/static\/\d+-Blob/,
/\/static\/\d+-HtmlService/,
/\/static\/\d+-Jdbc/,
/\/static\/\d+-LanguageApp/,
/\/static\/\d+-LinearOptimizationService/,
/\/static\/\d+-Ui/,
/\/static\/\d+-LockService/,
/\/static\/\d+-Logger/,
/\/static\/\d+-MailApp/,
/\/static\/\d+-Maps/,
/\/static\/\d+-MimeType/,
/\/static\/\d+-SlidesApp/,
/\/static\/\d+-console/,
/\/static\/\d+-BigNumber/,
/\/static\/\d+-JSON/,
/\/static\/\d+-Math/,
/\/static\/\d+-Object/,
/\/static\/\d+-BlobSource/,
/\/static\/\d+-Button/,
/\/static\/\d+-ButtonSet/,
/\/static\/\d+-ColumnType/,
/\/static\/\d+-DataTable/,
/\/static\/\d+-DataTableBuilder/,
/\/static\/\d+-DataTableSource/,
/\/static\/\d+-DigestAlgorithm/,
/\/static\/\d+-Menu/,
/\/static\/\d+-Month/,
/\/static\/\d+-PromptResponse/,
/\/static\/\d+-User/,
/\/static\/\d+-Weekday/,
/\/static\/\d+-Array/,
/\/static\/\d+-SitesApp/,
/\/static\/\d+-CardService/,
];

urlGooJS = 'https://www.google.com/js/';
window._search[urlGooJS] = [
[/\/bg\/\w+\.js/, 2],
];

urlGAPI = 'https://apis.google.com/_/scs/abc-static/';
window._search[urlGAPI] = [
[/_\/js\/k=gapi\.gapi\.en\..*\/m=gapi_iframes,googleapis_client,plusone\/rt=j\/sv=1\/d=1\/ed=1\/rs=.*\/cb=gapi\.loaded_0/, 2],
/_\/js\/k=gapi\.gapi\.en\..*\/m=gapi_iframes,googleapis_client,iframes_styles_slide_menu,plusone\/rt=j\/sv=1\/d=1\/ed=1\/rs=.*\/cb=gapi\.loaded_0/,
];

urlMozBug = 'https://bugzilla.mozilla.org/data/assets/';
window._search[urlMozBug] = [
[/\w+\.css/, 2],
[/\w+\.js/, 4],
];

urlOstk = 'https://ak1.ostkcdn.com/';
window._search[urlOstk] = [
/js\/product-page\.[.\d]+\.min\.js/,
/css\/os-master\.[.\d]+\.min\.css/,
/js\/overstock\.[.\d]+\.min\.js/,
/js\/os-async\.[.\d]+\.min\.js/,
/js\/ostk-user-tracking-all\.[.\d]+\.min\.js/,
/js\/thirdparty\/siteIntercept\.[.\d]+\.min\.js/,
/js\/thirdparty\/ensighten\/ensighten-bootstrap\.js/,
/js\/thirdparty\/swf\/jwplayer\.[.\d]+\.min\.js/,
/js\/s_code_async\.js/,
/css\/product-page\.[.\d]+\.min\.css/,
/js\/os-templates\.[.\d]+\.min\.js/,
];

urlMedium = 'https://cdn-static-1.medium.com/_/fp/';
window._search[urlMedium] = [
/gen-js\/main-base\.bundle\..+\.js/,
/gen-js\/main-common-async\.bundle\..+\.js/,
/gen-js\/main-misc-screens\.bundle\..+\.js/,
/gen-js\/main-notes.bundle\..+\.js/,
/gen-js\/main-home-screens\.bundle\..+\.js/,
/gen-js\/main-posters\.bundle\..+\.js/,
/css\/main-branding-base\..+\.css/,
/css\/fonts-latin-base\..+\.css/,
/css\/fonts-base\..+\.css/,
];

urlStatCtr = 'https://statcounter.com/';
window._search[urlStatCtr] = [
/\/css\/packed\/app-\w+\.css/,
/\/css\/packed\/print-\w+\.css/,
/\/js\/packed\/user-\w+\.js/,
/\/js\/packed\/base-\w+\.js/,
/\/css\/packed\/layout-\w+\.css/,
];

urlDkrHubId = "https://id.docker.com/static/";
window._search[urlDkrHubId] = [
/vendor\.\w+\.css/,
/login\.\w+\.css/,
/vendor\.\w+\.js/,
/login\.\w+\.js/,
];

urlDkrHub = "https://hub.docker.com/";
window._search[urlDkrHub] = [
/vendor\.\w+\.css/,
/login\.\w+\.css/,
/vendor\.\w+\.js/,
/login\.\w+\.js/,
/client\.\w+\.js/,
/main-0-\w+\.css/,
];

urlK8sIo = "https://d33wubrfki0l68.cloudfront.net/";
window._search[urlK8sIo] = [
/\w+\/css\/styles\.css/,
];

urlEc2 = "/ec2/";
window._search[urlEc2] = [
/ec2\.nocache\.js/,
/[^\/]{5,}\.cache\.js/,
/\/1\.cache\.js/,
/\/2\.cache\.js/,
/\/3\.cache\.js/,
/\/4\.cache\.js/,
/\/5\.cache\.js/,
/\/6\.cache\.js/,
/\/7\.cache\.js/,
/\/8\.cache\.js/,
/\/9\.cache\.js/,
/\/10\.cache\.js/,
/\/11\.cache\.js/,
/\/12\.cache\.js/,
/\/13\.cache\.js/,
/\/14\.cache\.js/,
];

urlEc22 = ".gz.";
window._search[urlEc22] = [
/menu-\w+\/globalnav-\w+\.gz\.css/,
/mezz-\w+\/custsat-\w+\.gz\.css/,
/mezz-\w+\/custsat-\w+\.gz\.js/,
[/mezz-\w+\/mezz-\w+.gz.js/, 2],
/menu-\w+\/globalnav-\w+\.gz\.js/,
/iam\/assets\/css\/bundles\/1_1505433600_270085c48f576fdeb829590f4fc80996\.css\.gz\.css/,
/iam\/assets\/js\/bundles\/en_4_1505433600_185326f6f405fe93a05e1f0cfd76ac88\.min\.js\.gz\.js/,
];

urlEc23 = ".cloudfront.net/";
window._search[urlEc23] = [
/versions\/live-ec2\/[\w-_]+\/Content\/text\/content_en\.js/,
/\/amznUrchin\.js/,
/iam\/assets\/js\/bundles\/policies.js/,
];

urlGeeks = "codegeeks.com/wp-content/cache/autoptimize/";
window._search[urlGeeks] = [
[/css\/autoptimize_\w+\.css/, 3],
/js\/autoptimize_\w+\.js/
];
*/

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
	if (origUrl.spec === url)	// already redirected
		return;
//	channel.URI = origUrl.mutate().setSpec(url).finalize();
	channel.redirectTo(origUrl.mutate().setSpec(url).finalize());
};

window._rwFunction = function(channel) {
	var url = channel.URI.spec;
	//console.debug(url, "start");
	if (url.match(_toggleIgnore)) {
		//console.debug(url, "ignored");
		return;
	}
	if(url.match(_rwHackerStack))
		_redir(channel, url.replace(/&?_=\d+/, '').replace(/\?$/, ''));
	else if(url.match(_rwGAE))
		_redir(channel, url.replace(/\d+\-[0-9a-z]+\.\d+\./, ''));
	else if(url.match(_rwGoogleDev)) {
		var pos = url.indexOf("/", url.indexOf("_static"));
		_redir(channel, url.substring(0, pos) + url.substring(url.indexOf("/", pos + 1)));
	}
	else if(url.match(_rwMDN))
		_redir(channel, url.replace(/[0-9a-z]+\.js/, 'js').replace(/[0-9a-z]+\.css/, 'css'));
	else if(url.match(_rwGoogleIssues))
		_redir(channel, url.substring(0, url.lastIndexOf('?')));
	else if(url.match(_rwBlogger))
		_redir(channel, url.substring(0, url.indexOf("?")));
	else if(url.match(_rwSpring))
		_redir(channel, url.replace(/-[a-z0-9]{32}\./, '.'));
	else if(url.match(_rwImgSrch)) {
		var csi = url.indexOf('&csi=');
		_redir(channel, (url.substring(0, csi) + url.substring(url.indexOf('&', csi + 1))).replace(/cidx:\d,_id:irc_imgrc\d,_pms:s/, "cidx:2,_id:irc_imgrc2,_pms:s"));
	}
	else if(url.match(_rwReddit))
		_redir(channel, url.replace(/\.\S{11}\./, '.'));
	else if(url.match(_rwMozMedia))
		_redir(channel, url.replace(/\.\S{12}\./, '.'));
	else if(url.match(_rwAliExpress))
		_redir(channel, url.replace(/\.\S{8}\./, '.'));
/*
	else for(k in _search) if(url.indexOf(k) > -1) {
		var s = _search[k];
		var r = _replace[k] || (_replace[k] = []);
		for(i in s) {
			var multi = s[i] instanceof Array;
			var key = multi ? s[i] [0] : s[i];
			if(url.match(key)) {
				if(r[i]) {
					if (!multi) {
						if (!rwOverwriteDown) {
							r[i] = _sanitizeUrl(channel.URI.spec);
						}
						_redir(channel, r[i]);
						//console.debug(url, "->", channel.URI.spec);
						return;
					}
					s[i] [2] = (++s[i] [2] || 0) % s[i] [1];
					if (r[i] [s[i] [2]]) {
						if (!rwOverwriteDown) {
							r[i] [s[i] [2]] = _sanitizeUrl(channel.URI.spec);
						}
						_redir(channel, r[i] [s[i] [2]]);
						//console.debug(url, "->", channel.URI.spec);
					} else {
						r[i].push(_sanitizeUrl(url));
					}
				} else {
					url = _sanitizeUrl(url);
					r[i] = multi ? [url] : url;
				}
				return;
			}
		}
		return;
	}

	//skip sanitization unless a custom request OR a CSS/JS/PNG that's not in the ignore list
	if ((!url.match(_rwAble) || url.match(_rwIgnore)) && !url.match(_rwCustomReq)) {
*/
	if (url.match(_rwIgnore)) {
		//console.debug(url, "final", channel.URI.spec)
		return;
	}

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

window._regexChannels = /slack\.com\/(templates\.php\?cb=|api\/api\.test)|(client-channel|clients\d|hangouts)\.google\.com|mail\.google\.com\/mail\/u\/0\/\?|trello\.com\/1\/(Session|batch)|\/youtrack\/(_events\?|rest\/(statistics|profile\/hasUnseenFeatures))/;
window.toggleChannels = window.toggleChannels || function() {
	toggleService.toggle('channels', function(channel) {
		if(channel.URI.spec.match(_regexChannels))
			channel.cancel(Components.results.NS_BINDING_ABORTED);
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

window._sitesDefault = /\/\/(.+\.webex\.com|0\.facebook\.com|.+\.slack\.com|.+\.appspot\.com|console\.aws\.amazon\.com|(developers|docs|drive|apis|cloud|script|domains)\.google\.com|drive\.google\.com|dzone\.com|fiverr\.com|kuoni\.zoom\.us|localhost|mail\.google\.com|medium\.com|messenger\.com|microsoftonline\.com|payoneer\.com|script\.google\.com|wap\.ebay\.com|web\.facebook\.com|www\.anyvan\.com|www\.evernote\.com|www\.facebook\.com|www\.fiverr\.com|www\.google\.(ca|com)|www\.gstatic\.com|developer\.android\.com|.+\.appspot\.com|www\.fiverr\.com)/;
window._sitesSafari = /\/\/((www\.|)google\.lk|(www\.|signin\.|)quora\.com)/;
window._sitesAndroid = /\/\/(blogspot\.com|cwiki\.apache\.org)/;
window._sitesFirefox = /\/\/((mobile\.|)twitter\.com)/;
window._sitesAndroidMobile = /\/\/(github\.com|productforums\.google\.com)/;
window._uaDefault = navigator.userAgent;

window.toggleUA = window.toggleUA || function() {
	toggleService.toggle('ua', function(channel) {
		var url = channel.URI.spec;
		var ua = _uaDefault;
		if (url.match(_sitesDefault)) {
			ua = navigator.userAgent;
		} else if (url.match(_sitesSafari)) {
			ua = "Mobile Safari";
		} else if (url.match(_sitesAndroid)) {
			ua = "Android";
		} else if (url.match(_sitesFirefox)) {
			ua = "Firefox";
		} else if (url.match(_sitesAndroidMobile)) {
			ua = "Android Mobile";
		}
		channel.setRequestHeader("User-Agent", ua, false);
	}, {
		title: "UA Blocked",
		body: _uaDefault
	}, {
		title: "UA Unblocked",
		body: navigator.userAgent
	});
};
toggleUA();



// SOCIAL

window._regexSocial = /\b(facebook\.com\/sem_pixel\/|connect\.facebook\.net|facebook\.com\/connect\/ping|facebook\.com\/(v[0-9.]+\/)?plugins\/like(box)?\.php|platform\.twitter\.com\/(widgets\.)?js)\b/;

window.toggleSocial = window.toggleSocial || function() {
	toggleService.toggle('social', function(channel) {
		if(!channel.URI.spec.match(_toggleIgnore) && channel.URI.spec.match(_regexSocial))
			channel.cancel(Components.results.NS_BINDING_ABORTED);
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
		origin = gBrowser.currentURI.spec.substring(0, gBrowser.currentURI.spec.indexOf("/", gBrowser.currentURI.spec.indexOf("//") + 2));
		if (gBrowser.currentURI.spec != "about:newtab" && !url.startsWith(origin) && !url.startsWith("https://encrypted-tbn0.gstatic.com")) {
			channel.cancel(Components.results.NS_BINDING_ABORTED);
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

window._regexMedia = /\b(woff|woff2|ttf|otf|\.eot|mp3|mp4|m4a|\.ico|ogv|webm|gif|(fonts|maps|content)\.googleapis\.com|(ssl\.)?google-analytics\.com|survey\.g\.doubleclick\.net|seal\.geotrust\.com|tawk\.to|alexa\.com|cdn\.optimizely\.com|doubleclick\.net|www\.youtube\.com\/embed\/|s\.ytime\.com|google\.com\/adsense|forter.com|wiki(pedia\.org\/w|\b)\/load\.php|pagead2\.googlesyndication\.com|apis-explorer\.appspot\.com|developers\.google\.com\/profile\/userhistory|www\.googletagmanager\.com|radar\.cedexis\.com|intercom\.io|intercomcdn\.com|api\.qualaroo\.com|support\.google\.com\/[^/]+\/apis|s3\.amazonaws\.com\/ki\.js\/|www\.fiverr\.com\/(js_event_tracking|report_payload_(events|counter))|dev\.appboy\.com|(rt2|jen|collector)\.fiverr\.com|player\.vimeo\.com\/video\/233549644|script\.google\.com\/.+\/((bind|test|active)\?|exceptionService)|\/image-s\d-\dx\.jpg|ogs\.google\.com|bitbucket\.org\/(emoji\/|\!api\/.*\/pullrequests\/\d+\/(participants|merge-restrictions|updates))|google\.com\/.*\/jserror\?|dropbox\.com\/(jse|unity_connection_log|get_info_for_quota_upsell|alternate_wtl_browser_performance_info|log_js_sw_data|log\/|alternate_wtl|2\/notify\/subscribe)|slack\.com\/(beacon\/error|api\/(dnd\.teamInfo))|linkedin\.com\/(csp\/dtag|realtime\/connect|li\/track|voyager\/(abp-detection\.js|api\/(identity\/cards|legoWidgetImpressionEvents|feed\/(hovercard|richRecommendedEntities)|growth\/(suggestedRoutes|emailsPrefill|socialproofs)|relationships\/(peopleYouMayKnow|connectionsSummary)|voyagerGrowthEmailDomainResolutions)))|play\.google\.com\/log\?|(hackernoon|medium)\.com\/_\/batch|medium\.com\/.*(\/state\/location|me\/activity)|bam\.nr-data\.net\/jserrors|\/uconsole\/services\/metrics\/retrieveMultiGauges\/|www\.google\.com\/coop\/cse\/brand|\.google\.com\/(_s\/getsuggestions|profile\/userhistory)|api\.github\.com\/(users\/\w+\/repos|user\/repos\?)|www\.googleapis\.com\/urlshortener\/v1\/url|support\.\w+\.com\/(youtrack\/|hub\/api\/rest\/hubfeatures|youtrack\/(rest\/profile\/hasUnseenFeatures|rest\/user\/banner\/content|rest\/statistics))|sentry\.io\/api|cdn\.ravenjs\.com|www\.statcounter\.com\/counter\/counter\.js|_Incapsula_Resource|tripleclicks\.com\/(shared\/ajax\/notifications|games\/.*\/Badges))\b/;

window.toggleMedia = window.toggleMedia || function() {
	toggleService.toggle('media', function(channel) {
		if(!channel.URI.spec.match(_toggleIgnore) && channel.URI.spec.match(_regexMedia))
			channel.cancel(Components.results.NS_BINDING_ABORTED);
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

window.toggleNoExpiry = window.toggleNoExpiry || function() {
	toggleService.toggleResponse('noexpiry', function(channel) {
		channel.setResponseHeader("Expires", "", false);
		channel.setResponseHeader("expires", "", false);
		channel.setResponseHeader("cache-control", "", false);
		channel.setResponseHeader("Cache-Control", "", false);
		channel.setResponseHeader("pragma", "", false);
		channel.setResponseHeader("Pragma", "", false);
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

window._regexPermanent = /\b(clients\d+\.google\.com\/(voice|chat|invalidation)\/|\d+\.client-channel\.google\.com\/client-channel\/|hangouts\.google\.com\/webchat|notifications\.google\.com\/.*\/idv2)\b/;

window.togglePermanent = window.togglePermanent || function() {
	toggleService.toggle('permanent', function(channel) {
		if(!channel.URI.spec.match(_toggleIgnore) && channel.URI.spec.match(_regexPermanent))
			channel.cancel(Components.results.NS_BINDING_ABORTED);
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

window._regexJS = /\b(\.js|_Incapsula_Resource|jsapi|ssl\.gstatic\.com\/accounts\/static\/_\/js\/|load\.php\?debug=false)\b/;
window.toggleJS = window.toggleJS || function() {
	toggleService.toggle('js', function(channel) {
		if(!channel.URI.spec.match(_toggleIgnore) && channel.URI.spec.match(_regexJS))
			channel.cancel(Components.results.NS_BINDING_ABORTED);
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

window._regexCSS = /\b(css\b|s\d\.wp\.com\/_static\/|ssl\.gstatic\.com\/accounts\/static\/_\/css\/|load\.php\?debug=false)/;
window.toggleCSS = window.toggleCSS || function() {
	toggleService.toggle('css', function(channel) {
		if(!channel.URI.spec.match(_toggleIgnore) && channel.URI.spec.match(_regexCSS))
			channel.cancel(Components.results.NS_BINDING_ABORTED);
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
		title: "URL Rewriter - Overwrite Mode Off",
		body: "URL rewrites will happen normally."
	}, {
		title: "URL Rewriter - Overwrite Mode",
		body: "Mappings for visited URLs will be overwritten."
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

window._regexYT = /\/youtrack\/(_events\?|rest\/(statistics|profile\/hasUnseenFeatures))|hub\/api\/rest\/oauth2\/auth/;
window.toggleYT = window.toggleYT || function() {
	toggleService.toggle('yt', function(channel) {
		if(channel.URI.spec.match(_regexYT))
			channel.cancel(Components.results.NS_BINDING_ABORTED);
	}, {
		title: "YouTrack Blocked",
		body: "Reconnection tries of YouTrack will be blocked."
	}, {
		title: "YouTrack Unblocked",
		body: "YouTrack reconnection restored."
	});
};
toggleYT();



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
		if(_offline.getAttribute("checked") == "true" && 
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
if(!window.toggleJS) {
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