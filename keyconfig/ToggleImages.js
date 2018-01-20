window.prefSvc = window.prefSvc || Cc['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch("");

window.toggleImages = window.toggleImages || function() {
	showImages = 2 - prefSvc.getIntPref("permissions.default.image");
	prefSvc.setIntPref("permissions.default.image", showImages);
	notify(showImages, showImages ? "Images Blocked" : "Images Unblocked", "Images will be " + (showImages ? "blocked." : "displayed."));
};
toggleImages();
