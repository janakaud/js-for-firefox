window.toggleService.toggle('media', function(channel) {
	if(channel.URI.spec.match(/\b(woff|ttf|mp3|ico|translate\.google\.com|google-analytics\.com|facebook\.com\/plugins\/like(box)?\.php)\b/))
		channel.cancel(Components.results.NS_BINDING_ABORTED);
}, {
	title: "Media Blocked",
	body: "Fonts, analytics etc will be blocked."
}, {
	title: "Media Unblocked",
	body: "Fonts, analytics etc will load normally."
});
