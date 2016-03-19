isOffline = BrowserOffline._uiElement.getAttribute("checked") == "true";
if (!isOffline) {
	BrowserOffline.toggleOfflineStatus();
}
if (window.jsDown) {
	toggleJS();
}
if (window.cssDown) {
	toggleCSS();
}
content.document.location.reload();
setInterval(function() {
	toggleJS();
	toggleCSS();
	BrowserOffline.toggleOfflineStatus();
}, 2000);
