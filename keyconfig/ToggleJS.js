window._regexJS = window._regexJS || /\b(\.js|_Incapsula_Resource|jsapi)\b/;
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
