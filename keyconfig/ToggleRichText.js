isOffline = BrowserOffline._uiElement.getAttribute("checked") == "true";
if (!isOffline) {
	BrowserOffline.toggleOfflineStatus();
}
if (window.jsDown) {
	window.toggleJS();
}
if (window.cssDown) {
	window.toggleCSS();
}
content.document.location.reload();
setTimeout(function() {
	window.toggleJS();
	window.toggleCSS();
	BrowserOffline.toggleOfflineStatus();
}, 3000);
