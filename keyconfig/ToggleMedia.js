window.toggleMedia = window.toggleMedia || function() {
	toggleService.toggle('media', function(channel) {
		if(channel.URI.spec.match(/\b(woff|woff2|ttf|mp3|\.ico|ogv|webm|translate\.google\.com|(fonts|maps|content)\.googleapis\.com|(ssl\.)?google-analytics\.com|survey\.g\.doubleclick\.net|connect\.facebook\.net|facebook\.com\/connect\/ping|facebook\.com\/(v[0-9.]+\/)?plugins\/like(box)?\.php|seal\.geotrust\.com|tawk\.to|alexa\.com|cdn\.optimizely\.com|doubleclick\.net|www\.google\.com\/jsapi|www\.youtube\.com\/embed\/|s\.ytime\.com|google\.com\/adsense|forter.com|wiki(pedia\.org\/w|\b)\/load\.php|pagead2\.googlesyndication\.com|apis\.google\.com|apis-explorer\.appspot\.com|developers\.google\.com\/profile\/userhistory)\b/))
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
