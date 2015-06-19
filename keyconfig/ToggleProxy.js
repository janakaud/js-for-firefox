var alertsService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
if(Services.prefs.getIntPref("network.proxy.type") != 1) {
	Services.prefs.setCharPref("network.proxy.http", "cache.mrt.ac.lk");
	Services.prefs.setIntPref("network.proxy.http_port", 3128);
	Services.prefs.setIntPref("network.proxy.type", 1);
	Services.prefs.setBoolPref("network.proxy.share_proxy_settings", true);
	alertsService.showAlertNotification("chrome://mozapps/skin/extensions/alerticon-info-positive.png", "Proxy Enabled", "Proxy set to cache.mrt.ac.lk.", false, "", null, "");
}
else {
	Services.prefs.setIntPref("network.proxy.type", 0);
	alertsService.showAlertNotification("chrome://mozapps/skin/extensions/alerticon-info-negative.png", "Proxy Disabled", "No proxy settings are active now.", false, "", null, "");
}
