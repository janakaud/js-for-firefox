window.toggleUA = window.toggleUA || function() {
	toggleService.toggle('ua', function(channel) {
		channel.setRequestHeader("User-Agent", "Mobile Safari", false);
	}, {
		title: "UA Blocked",
		body: "Mobile Safari."
	}, {
		title: "UA Unblocked",
		body: "Default UA."
	});
};
toggleUA();
