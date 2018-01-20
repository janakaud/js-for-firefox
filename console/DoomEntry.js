// load the disk cache
var cacheservice = Components.classes["@mozilla.org/netwerk/cache-storage-service;1"]
    .getService(Components.interfaces.nsICacheStorageService);
var {LoadContextInfo} = Components.utils.import("resource://gre/modules/LoadContextInfo.jsm",{})
var hdcache = cacheservice.diskCacheStorage(LoadContextInfo.default, true);

// compose the URL and submit it for dooming
var uri = Components.classes["@mozilla.org/network/io-service;1"]
    .getService(Components.interfaces.nsIIOService).newURI(prompt("Enter the URL to kick out:"), null, null);
hdcache.asyncDoomURI(uri, null, null);
