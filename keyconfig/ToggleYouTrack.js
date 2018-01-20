window._regexYT = window._regexYT || /\/youtrack\/(_events\?|rest\/(statistics|profile\/hasUnseenFeatures))|hub\/api\/rest\/oauth2\/auth/;
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
