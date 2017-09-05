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
toggleSameOrigin();
