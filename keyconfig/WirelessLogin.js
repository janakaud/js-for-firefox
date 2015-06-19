content.document.forms[0].username.value = "<username>";
content.document.forms[0].password.value = "<password>";
var button = content.document.getElementsByName('Submit');
if(button.length > 0) {	//UOM Wireless login
	button[0].click();
	//change proxy
	if(Services.prefs.getIntPref("network.proxy.type") != 1) {
		Services.prefs.setCharPref("network.proxy.http", "cache.mrt.ac.lk");
		Services.prefs.setIntPref("network.proxy.http_port", 3128);
		Services.prefs.setIntPref("network.proxy.type", 1);
		Services.prefs.setBoolPref("network.proxy.share_proxy_settings", true);
		var alertsService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
		alertsService.showAlertNotification("chrome://mozapps/skin/extensions/alerticon-info-positive.png", "Proxy Enabled", "Proxy set to cache.mrt.ac.lk.", false, "", null, "");
	}
}
else {				//Moodle login
	content.document.getElementById('loginbtn').click();
}
