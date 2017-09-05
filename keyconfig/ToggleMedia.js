window._regexMedia = window._regexMedia || /\b(woff|woff2|ttf|otf|mp3|mp4|\.ico|ogv|webm|translate\.google\.com|(fonts|maps|content)\.googleapis\.com|(ssl\.)?google-analytics\.com|survey\.g\.doubleclick\.net|seal\.geotrust\.com|tawk\.to|alexa\.com|cdn\.optimizely\.com|doubleclick\.net|www\.youtube\.com\/embed\/|s\.ytime\.com|google\.com\/adsense|forter.com|wiki(pedia\.org\/w|\b)\/load\.php|pagead2\.googlesyndication\.com|apis-explorer\.appspot\.com|developers\.google\.com\/profile\/userhistory|www\.googletagmanager\.com|radar\.cedexis\.com|intercom\.io|intercomcdn\.com|api\.qualaroo\.com|support\.google\.com\/[^/]+\/apis|ssl\.gstatic\.com\/accounts\/static|s3\.amazonaws\.com\/ki\.js\/|www\.fiverr\.com\/report_payload_(events|counter)|jen\.fiverr\.com|script\.google\.com\/macros\/.+\/(bind|test|active)\?|\/image-s\d-\dx\.jpg|ogs\.google\.com|bitbucket\.org\/(emoji\/|\!api\/.*\/pullrequests\/\d+\/(participants|merge-restrictions|updates)))\b/;

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
