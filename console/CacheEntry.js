var cacheservice = cacheservice || Components.classes["@mozilla.org/netwerk/cache-storage-service;1"].getService(Components.interfaces.nsICacheStorageService);
var hdcache = hdcache || cacheservice.diskCacheStorage(Services.loadContextInfo.default, true);
var iosvc = iosvc || Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService)

var uri = iosvc.newURI(prompt("uri"), null, null);
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
