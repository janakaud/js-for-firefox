window.toggleNoExpiry = window.toggleNoExpiry || function() {
	toggleService.toggleResponse('noexpiry', function(channel) {
		channel.setResponseHeader("Expires", "", false);
		channel.setResponseHeader("expires", "", false);
		channel.setResponseHeader("cache-control", "", false);
		channel.setResponseHeader("Cache-Control", "", false);
		channel.setResponseHeader("pragma", "", false);
		channel.setResponseHeader("Pragma", "", false);
	}, {
		title: "Expiry Off",
		body: "Response expiry headers will be stripped."
	}, {
		title: "Expiry Normal",
		body: "Response expiry will happen normally."
	});
};
toggleNoExpiry();
