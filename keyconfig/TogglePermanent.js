window._regexPermanent = window._regexPermanent || /\b(clients\d+\.google\.com\/(voice|chat|invalidation)\/|\d+\.client-channel\.google\.com\/client-channel\/|hangouts\.google\.com\/webchat|notifications\.google\.com\/.*\/idv2)\b/;

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
