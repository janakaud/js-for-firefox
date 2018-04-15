offline = BrowserOffline._uiElement;

if (!(offline.getAttribute("checked") == "true")) toggleOffline();
if (window.jsDown) toggleJS();
if (window.cssDown) toggleCSS();

window.cHeader = window.cHeader || function(channel, key) {
	try {
		return channel.getRequestHeader(key);
	} catch (e) {
		return undefined;
	}
};
window.toggleXhrOnline = window.toggleXhrOnline || function() {
	toggleService.toggle('xhronline', function(channel) {
		url = channel.URI.spec;
		if(offline.getAttribute("checked") == "true" && 
			(url.indexOf("trello") > 0 && (cHeader(channel, "X-Requested-With") || cHeader(channel, "X-Trello-Client-Version"))) ||
			url.indexOf("gwt/autocompleteService") > 0 || url.indexOf("gwt/ideService") > 0)
			toggleOffline();
	}, {
		title: "Listening for XHR",
		body: "Browser will go online if an XHR is encountered."
	}, {
		title: "XHR Disabled",
		body: "XHR will be blocked while browser is offline."
	});
};
if (!window.xhronlineDown) toggleXhrOnline();

gBrowser.reload();
setTimeout(function() {
	if (offline.getAttribute("checked") == "true") toggleOffline();
	if (!window.jsDown) toggleJS();
	if (!window.cssDown) toggleCSS();
	if (window.xhronlineDown) toggleXhrOnline();
}, 5000);
