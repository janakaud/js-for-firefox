var form = content.document.forms[0];
form.username.value = "<username>";
form.password.value = "<password>";
if (form.buttonClicked) form.buttonClicked.value = 4;
form.submit();
//change proxy
var sp = Services.prefs;
if(content.document.title == "Web Authentication" && sp.getIntPref("network.proxy.type") != 1) {
	sp.setCharPref("network.proxy.http", "cache.mrt.ac.lk");
	sp.setIntPref("network.proxy.http_port", 3128);
	sp.setIntPref("network.proxy.type", 1);
	sp.setBoolPref("network.proxy.share_proxy_settings", true);
	var alertsService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
	alertsService.showAlertNotification("chrome://mozapps/skin/extensions/alerticon-info-positive.png", "Proxy Enabled", "Proxy set to cache.mrt.ac.lk.", false, "", null, "");
}

