var cacheservice = Components.classes["@mozilla.org/netwerk/cache-storage-service;1"].getService(Components.interfaces.nsICacheStorageService);
var {LoadContextInfo} = Components.utils.import("resource://gre/modules/LoadContextInfo.jsm",{})
var hdcache = cacheservice.diskCacheStorage(LoadContextInfo.default, true);
hdcache.asyncVisitStorage({
	f: [/\/conversations-\w{32}\.css/, /\/conversations-\w{32}\.js/, /\/jquery\.uploadifive-\w{32}\.js/, /\/application-head-\w{32}\.js/, /\/application-\w{32}\.js/, /\/application-\w{32}\.css/, /\/orders-\w{32}\.css/, /\/orders-\w{32}\.js/, /\/reconnecting\.websocket-\w{32}\.js/, /\/global-gig-listings-\w{32}\.js/, /\/global-gig-listings-\w{32}\.css/, /\/marketplace-\w{32}\.css/, /\/user-dashboard-\w{32}\.css/, /\/jquery\.inline-alert-\w{32}\.js/, /\/todos-\w{32}\.js/],
	r: {},
	onCacheEntryInfo: function(entryInfo) {
		for(i in this.f) {
			if(entryInfo.key.match(this.f[i])) {
				this.r[i] = entryInfo.key.match(/-\w{32}/)[0];
				return;
			}
		}
	},
	onCacheEntryVisitCompleted: function() {
		list = [];
		for(i in this.f) {
			list[i] = this.r[i] ? this.r[i] : null;
		}
		alert(JSON.stringify(list));
		diff = this.f.length - Object.keys(this.r).length;
		if(diff > 0)
			alert('Warning: ' + diff + ' entries missing');
	}
}, true);

