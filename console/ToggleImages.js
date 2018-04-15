ps = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch("");
imagestate = 2 - ps.getIntPref("permissions.default.image");
ps.setIntPref("permissions.default.image", imagestate);
imagestate == 2 ? "DISABLED" : "ENABLED"