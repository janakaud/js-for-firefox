window.toggleService.toggle('js', function(channel) {
	if(channel.URI.spec.match(/\b(\.js|_Incapsula_Resource)\b/))
		channel.cancel(Components.results.NS_BINDING_ABORTED);
}, {
	title: "JS Blocked",
	body: "External JS will be blocked."
}, {
	title: "JS Unblocked",
	body: "External JS will load normally."
});
