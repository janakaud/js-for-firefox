url = "https://assetsv2.fiverrcdn.com/assets/dist/translations.en-"
obss = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
es = ["http-on-before-connect", "http-on-examine-cached-response", "http-on-modify-request", "http-on-opening-request", "http-on-stop-request", "http-on-useragent-request"];
os = es.map(function(e) {
	return {
		observe: function(aSubject, aTopic, aData) {
			var channel = aSubject.QueryInterface(Ci.nsIHttpChannel);
			if (channel.URI.spec.indexOf("translations.en") > 0) {
				console.warn(e, channel.URI.spec);
			}
		}
	};
});
es.forEach(function(e, i) {
	obss.addObserver(os[i], e, false);
});


es.forEach(function(e, i) {
	obss.removeObserver(os[i], e, false);
});


/*
Observable event names: obtained via enabling all logs as per http://forums.mozillazine.org/viewtopic.php?f=28&t=2378891

before-first-paint
browser-fullZoom:location-change
chrome-document-global-created
chrome-document-interactive
chrome-document-loaded
chrome-page-hidden
chrome-page-shown
chrome-webnavigation-create
chrome-webnavigation-destroy
content-document-interactive
cycle-collector-begin
cycle-collector-end
cycle-collector-forget-skippable
document-element-inserted
document-shown
domwindowclosed
dom-window-destroyed
domwindowopened
garbage-collection-statistics
gather-memory-telemetry-finished
http-on-before-connect
http-on-examine-cached-response
http-on-modify-request
http-on-opening-request
http-on-stop-request
http-on-useragent-request
inner-window-destroyed
inner-window-nuked
ipc:browser-destroyed
ipc:content-shutdown
message-manager-close
message-manager-disconnect
net:current-toplevel-outer-content-windowid
on-datatransfer-available
outer-window-destroyed
outer-window-nuked
PopupNotifications-updateNotShowing
sessionstore-closed-objects-changed
sessionstore-state-write-complete
style-sheet-applicable-state-changed
toplevel-window-ready
user-interaction-active
visited-status-resolution
widget-first-paint
xul-window-destroyed
xul-window-registered
xul-window-visible
*/
