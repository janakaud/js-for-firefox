var cacheservice = Components.classes["@mozilla.org/netwerk/cache-storage-service;1"].getService(Components.interfaces.nsICacheStorageService);
var {LoadContextInfo} = Components.utils.import("resource://gre/modules/LoadContextInfo.jsm",{})
var hdcache = cacheservice.diskCacheStorage(LoadContextInfo.default, true);
var uri = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(prompt("uri"), null, null);

console.log(hdcache.exists(uri, null));

hdcache.asyncOpenURI(uri, null, hdcache.OPEN_READONLY, {
	onCacheEntryCheck: function(aEntry, aApplicationCache) {
		console.log(aEntry);
		console.log(aApplicationCache);
	},
	onCacheEntryAvailable: function(aEntry, aNew, aApplicationCache, aResult) {
		console.log(aEntry);
		console.log(aNew);
		console.log(aApplicationCache);
		console.log(aResult);
	}
})
