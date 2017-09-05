window._socialRegex = window._socialRegex || /\b(connect\.facebook\.net|facebook\.com\/connect\/ping|facebook\.com\/(v[0-9.]+\/)?plugins\/like(box)?\.php|platform\.twitter\.com\/(widgets\.)?js)\b/;

window.toggleSocial = window.toggleSocial || function() {
	toggleService.toggle('social', function(channel) {
		if(!channel.URI.spec.match(_toggleIgnore) && channel.URI.spec.match(_socialRegex))
			channel.cancel(Components.results.NS_BINDING_ABORTED);
	}, {
		title: "Social Blocked",
		body: "FB, Twitter etc plugins will be blocked."
	}, {
		title: "Social Unblocked",
		body: "FB, Twitter etc plugins will load normally."
	});
};
toggleSocial();
