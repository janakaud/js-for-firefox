window.toggleRWOverwrite = window.toggleRWOverwrite || function() {
	toggleService.toggle('rwOverwrite', function(channel) {}, {
		title: "URL Rewriter - Overwrite Mode Off",
		body: "URL rewrites will happen normally."
	}, {
		title: "URL Rewriter - Overwrite Mode",
		body: "Mappings for visited URLs will be overwritten."
	});
};
toggleRWOverwrite();
