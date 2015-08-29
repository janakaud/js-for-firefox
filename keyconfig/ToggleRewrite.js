window.toggleService.toggle('rw', function(channel) {
	url = channel.URI.spec;
	if(url.match(/\bfiverrcdn\.com\b.+-\w{32}/)) {	//Fiverr
		cached = window.forcedCache.find(url);
		if(cached)
			channel.URI.spec = cached;
	}
	if(!url.match(/\b\.(js|css)\?\b/))
		return;
	param = url.match(/\b(date|v|ver|_|_v|t|_t|timestamp)\b=[-a-z0-9.]{2,}&?|\?[a-z0-9]+$/);
	if(!param)
		return;
	url = url.replace(param[0], '');
	if(url.endsWith('?'))
		url = url.substring(0, url.length - 1);
	channel.URI.spec = url;
}, {
	title: "URL Rewriter On",
	body: "Chosen URLs will be remapped to cache."
}, {
	title: "URL Rewriter Off",
	body: "Chosen URLs will load normally."
});
