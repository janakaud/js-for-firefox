window.toggleService.toggle('media', function(channel) {
	if(channel.URI.spec.match(/\b(woff|ttf|mp3|\.ico|ogv|webm|translate\.google\.com|(fonts|maps)\.googleapis\.com|(ssl\.)?google-analytics\.com|survey\.g\.doubleclick\.net|facebook\.com\/plugins\/like(box)?\.php|seal\.geotrust\.com|tawk\.to|alexa\.com|cdn\.optimizely\.com|doubleclick\.net|www\.google\.com\/jsapi|www\.youtube\.com\/embed\/|s\.ytime\.com|google\.com\/adsense)\b/))
		channel.cancel(Components.results.NS_BINDING_ABORTED);
}, {
	title: "Media Blocked",
	body: "Fonts, analytics etc will be blocked."
}, {
	title: "Media Unblocked",
	body: "Fonts, analytics etc will load normally."
});
