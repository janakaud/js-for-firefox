window._sitesDefault = window._sitesDefault || /\/\/(\.webex\.com|0\.facebook\.com|\.slack\.com|appspot\.com|confluentcommunity\.slack\.com|console\.aws\.amazon\.com|docs\.google\.com|domains\.google\.com|drive\.google\.com|dzone\.com|fiverr\.com|kubernetes\.slack\.com|kuoni\.zoom\.us|localhost|mail\.google\.com|medium\.com|messenger\.com|microsoftonline\.com|payoneer\.com|script\.google\.com|slack\.com|support\.\w+\.com|wap\.ebay\.com|web\.facebook\.com|www\.anyvan\.com|www\.evernote\.com|www\.facebook\.com|www\.fiverr\.com|www\.google\.ca|www\.gstatic\.com)/;
window._sitesAndroid = window._sitesAndroid || /\/\/(blogspot\.com|cwiki\.apache\.org)/;
window._sitesAndroidMobile = window._sitesAndroidMobile || /\/\/(github\.com|productforums\.google\.com)/;

window.toggleUA = window.toggleUA || function() {
	toggleService.toggle('ua', function(channel) {
		var url = channel.URI.spec;
		var ua = "Mobile Safari";
		if (url.match(_sitesDefault)) {
			ua = navigator.userAgent;
		} else if (url.match(_sitesAndroid)) {
			ua = "Android";
		} else if (url.match(_sitesAndroidMobile)) {
			ua = "Android Mobile";
		}
		channel.setRequestHeader("User-Agent", ua, false);
	}, {
		title: "UA Blocked",
		body: "Mobile Safari."
	}, {
		title: "UA Unblocked",
		body: "Default UA."
	});
};
toggleUA();
