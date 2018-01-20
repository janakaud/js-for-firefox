window._regexChannels = window._regexChannels || /slack\.com\/(templates\.php\?cb=|api\/api\.test)|(client-channel|clients\d|hangouts)\.google\.com|mail\.google\.com\/mail\/u\/0\/\?|trello\.com\/1\/(Session|batch)|\/youtrack\/(_events\?|rest\/(statistics|profile\/hasUnseenFeatures))/;
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
