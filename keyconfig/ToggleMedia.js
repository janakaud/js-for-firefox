window._regexMedia = window._regexMedia || /\b(woff|woff2|ttf|otf|mp3|mp4|\.ico|ogv|webm|translate\.google\.com|(fonts|maps|content)\.googleapis\.com|(ssl\.)?google-analytics\.com|survey\.g\.doubleclick\.net|seal\.geotrust\.com|tawk\.to|alexa\.com|cdn\.optimizely\.com|doubleclick\.net|www\.youtube\.com\/embed\/|s\.ytime\.com|google\.com\/adsense|forter.com|wiki(pedia\.org\/w|\b)\/load\.php|pagead2\.googlesyndication\.com|apis-explorer\.appspot\.com|developers\.google\.com\/profile\/userhistory|www\.googletagmanager\.com|radar\.cedexis\.com|intercom\.io|intercomcdn\.com|api\.qualaroo\.com|support\.google\.com\/[^/]+\/apis|ssl\.gstatic\.com\/accounts\/static|s3\.amazonaws\.com\/ki\.js\/|www\.fiverr\.com\/(js_event_tracking|report_payload_(events|counter))|dev\.appboy\.com|(rt2|jen|collector)\.fiverr\.com|player\.vimeo\.com\/video\/233549644|script\.google\.com\/.+\/((bind|test|active)\?|exceptionService)|\/image-s\d-\dx\.jpg|ogs\.google\.com|bitbucket\.org\/(emoji\/|\!api\/.*\/pullrequests\/\d+\/(participants|merge-restrictions|updates))|google\.com\/.*\/jserror\?|dropbox\.com\/(jse|unity_connection_log|get_info_for_quota_upsell|alternate_wtl_browser_performance_info|log_js_sw_data|log\/|alternate_wtl|2\/notify\/subscribe)|slack\.com\/(beacon\/error|api\/(dnd\.teamInfo))|linkedin\.com\/(csp\/dtag|realtime\/connect|li\/track|voyager\/(abp-detection\.js|api\/(identity\/cards|legoWidgetImpressionEvents|feed\/(hovercard|richRecommendedEntities)|growth\/(suggestedRoutes|emailsPrefill|socialproofs)|relationships\/(peopleYouMayKnow|connectionsSummary)|voyagerGrowthEmailDomainResolutions)))|play\.google\.com\/log\?|(hackernoon|medium)\.com\/_\/batch|medium\.com\/.*(\/state\/location|me\/activity)|bam\.nr-data\.net\/jserrors|\/uconsole\/services\/metrics\/retrieveMultiGauges\/)\b/;

window.toggleMedia = window.toggleMedia || function() {
	toggleService.toggle('media', function(channel) {
		if(!channel.URI.spec.match(_toggleIgnore) && channel.URI.spec.match(_regexMedia))
			channel.cancel(Components.results.NS_BINDING_ABORTED);
	}, {
		title: "Media Blocked",
		body: "Fonts, analytics etc will be blocked."
	}, {
		title: "Media Unblocked",
		body: "Fonts, analytics etc will load normally."
	});
};
toggleMedia();
