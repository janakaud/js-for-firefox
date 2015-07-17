window.toggleService.toggle('rw', function(channel) {
	if(channel.URI.spec.match(/\b(all\.css|full\.en\.js|stub\.en\.js|mobile\.en\.js)\b/))	//SO
		channel.URI.spec = channel.URI.spec.substring(0, channel.URI.spec.indexOf('?'));
	else if(channel.URI.spec.match(/\bfiverrcdn\.com\b.+-\w{32}/)) {	//Fiverr
		f = [/\/conversations-\w{32}\.css/, /\/conversations-\w{32}\.js/, /\/jquery\.uploadifive-\w{32}\.js/, /\/application-head-\w{32}\.js/, /\/application-\w{32}\.js/, /\/application-\w{32}\.css/, /\/orders-\w{32}\.css/, /\/orders-\w{32}\.js/, /\/reconnecting\.websocket-\w{32}\.js/, /\/global-gig-listings-\w{32}\.js/, /\/global-gig-listings-\w{32}\.css/, /\/marketplace-\w{32}\.css/, /\/user-dashboard-\w{32}\.css/, /\/jquery\.inline-alert-\w{32}\.js/, /\/todos-\w{32}\.js/];
		r = ['-b25f50c2376ef0db1abc8242f23e739d', '-86f3a4100c74cf6741131ee27ff28c9b', '-2da63e0b30a9bb21ff8ca8f6f310a06b', '-8635d9a6574156891a41a7ec9e67c08b', '-fcfbab638e7fe353c2880ae0f82c9477', '-0ab08c5dbd69a0bc95aff4f72e88d2c6', '-a94d6affc09849cf2cdbb219b1e11d25', '-5c578a98450ef733d7d7930f388c2eb7', '-f4ed6da3145f6ff75fdd1db3d28673e2', '-ff8d661343c98c614fad5a8e1deaf8ff', '-4d5ae44fda4d4dfb4651744ee26fcdac', '-820d69401119329bb354c80057223d53', '-c36fd940e4b186759e7e65c6d432bac5', '-58bb93d809c51749dda9f505571e1c30', '-71ca542f0eb42114f487e2488620d94d'];
		for(var i in f)
			if(channel.URI.spec.match(f[i])) {
				channel.URI.spec = channel.URI.spec.replace(/-\w{32}/, r[i]);
				break;
			}
	}
}, {
	title: "URL Rewriter On",
	body: "Chosen URLs will be remapped to cache."
}, {
	title: "URL Rewriter Off",
	body: "Chosen URLs will load normally."
});
