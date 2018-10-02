// load the disk cache
var cacheservice = Components.classes["@mozilla.org/netwerk/cache-storage-service;1"]
    .getService(Components.interfaces.nsICacheStorageService);
var hdcache = cacheservice.diskCacheStorage(Services.loadContextInfo.default, true);

// compose the URL and submit it for dooming
var uri = Components.classes["@mozilla.org/network/io-service;1"]
    .getService(Components.interfaces.nsIIOService).newURI(prompt("Enter the URL to kick out:"), null, null);
hdcache.asyncDoomURI(uri, null, null);
