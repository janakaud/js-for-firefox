window._regexCSS = window._regexCSS || /\b(css\b|s\d\.wp\.com\/_static\/)/;
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
