> *NOTE:* With the [demise of KeyConfig](https://addons.mozilla.org/en-US/firefox/addon/dorando-keyconfig/reviews/924874/), all scripts have been moved into [All.js](All.js); just copy the content and paste it into the [Browser Console] right after you launch Firefox!

These require the [keyconfig add-on](https://addons.mozilla.org/en-US/firefox/addon/dorando-keyconfig/). You will have to create individual shortcuts for each of the required scripts; please note, however, that the `ToggleOffline` function is mandatory for all scripts to work properly, as it performs some of the basic initializations on behalf of the other scripts.

### ToggleOffline
Provides a keyboard shortcut for toggling offline browsing (the same offered by `File > Work Offline`)

### ToggleCSS
Toggles loading of CSS content, including all URLs containing the distinct word `css`, as well as some predefined stylesheet URL formats such as those found on Wiki websites

### ToggleJS
Toggles loading of JS content, including all URLs containing the distinct word `js`, as well as some predefined JS resource URL formats such as those found on Wiki websites

### ToggleMedia
Toggles loading of a wide range of web media resources including PNGs (e.g. favicons), fonts (`ttf`, `woff`, `woff2`), audio (`mp3`), videos (`mp4`, `webm`), and some other "optional" contents such as Google's Analytics, Maps and fonts, Facebook social widgets, and AdSense ads.

### ToggleRW
Toggles a mode where some common parameter-appended URL forms (e.g. `http://domain/path/resource`**`?_=timestamp`**) are converted to their base forms (`http://domain/path/resource`). In addition, it converts some known static resource URLs of sites like `(script|developers|cloud).google.com` and `stackoverflow.com` from their 'versioned' forms back to more 'cache-ready' forms (e.g. `https://script.google.com/macros`**`/d/XXXXXX`**`/gwt/YYYYYY.cache.js`, which is project-specific, becomes `https://script.google.com/macros/gwt/YYYYYY.cache.js` which works at least for a few hours or days, over multiple Apps Script projects).

The first run of `ToggleOffline` toggles the above `Toggle*` scripts to ON mode. This helps you to start with a 'fully restricted' browser config as soon as you do your first offline toggle since you opened the browser.

### ReloadResources
Similar to [RefreshResources](../console/README.md#refreshresources)

### ToggleProxy
Toggles Firefox's proxy mode between 'No proxy' and a custom proxy config (currently set to `cache.mrt.ac.lk:3128`)

### ToggleRichText
Attempts to reload a "plain-loaded" page (loaded with CSS and JS disabled) by enabling offline mode, disabling CSS and JS blockers, refreshing the page (so that the page and its necessary resources can be pulled from cache) and re-enables the blockers and disables offline mode after a few (currently 3) seconds

### WirelessLogin
Automatically logs into a wireless network (router) with a preconfigured username-password pair. Useful with some wireless login pages which do not support the remember username/password feature.

