This is a collection of GreaseMonkey scripts for various websites. The purpose of each is described in its header comment. Some notable scripts are:

### GoogleSearch, GmailDirect, FacebookDirect
Converts redirection URLs (e.g. https://www.google.lk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=13&ved=0ahUKEwiQ2tmWucnMAhVCHo4KHWZECHYQFghDMAw&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DNkErShu63do&usg=AFQjCNEDnRB2UfXhsqFl1niJnhuczKxyDg&sig2=ZFiDPaboMpFJQGVIzgV4Kg) in respective pages, to their base forms (https://www.youtube.com/watch?v=NkErShu63do). Prevents unnecessary redirections and limits the ability of the link's hosting site to track your activity. Tested for mobile websites (https://mail.google.com/mail/u/0/x/a in case of Gmail, https://0.facebook.com and https://m.facebook.com in case of FB) but can be modified to suit desktop sites as well.

### FacebookAJAXMessaging
Enables chat-like behavior (send only; no automatic reception) on the basic (static HTML) FB mobile websites (https://0.facebook.com and https://m.facebook.com) by converting its form submission to an async operation

### FacebookCSS
A fix for an issue on Facebook dynamic mobile site (https://m.facebook.com) that used to render an overlay 

### DisableTabRedirect
Disables URL navigations (page reloads) that used to happen in the old layout of the [TripleClicks website](https://www.tripleclicks.com/13336056/detail.php?item=437622&share=Q2nDG7EUP2uy)

### FixImageThumbs
Fixes item preview image URLs on TripleClicks product pages to use actual thumbnails, instead of scaled-down full-size images

### BlockAutoReloadOnAuctionUpdate
Disables the JS timer that causes TripleClicks pages to be reloaded whenever a [PriceBenders auction](https://www.tripleclicks.com/indexAuctions) ends

### Shiply
Custom script for traversing the entry list and submitting automatic bids on [Shiply] (www.shiply.com) website

### RemoveBloggerOverlay
Automatically removes the overlay of Blogger pages in mobile view (e.g. http://randomizd.blogspot.com/?m=1), which block mouse access to top portions of those pages. Currently detects only blogspot.com domains.

### DeleteSignupOverlay
Automatically removes a similar set of overlays on the malideveloper.arm.com website

### eBaySearchRedirect
Removes hashes (e.g. `http://www.ebay.com/itm/Rubber-with-2-FREE-Picks-HeadStock-0-81mm-Guitar-Pick-Holder-/391006458554`**`?hash=item5b09cd12ba%3Ag%3AvkQAAOSw0vBUk3he`**) from eBay's search result URLs, making them cache-friendly and remain 'marked' as visited (on the browser) over multiple searches

### SpinnerDown
Removes the spinning-wheel graphic from [Apache Stratos documentation](https://cwiki.apache.org/confluence/display/STRATOS/) sidebar (the logic being applicable to any Atlassian Confluence webpage), which used to consume a significant portion of my CPU capacity while the page was open on Firefox

### WirelessLogin
Disables redirection after a successful login to a wireless router (network) by automatically opening a blank page

### DLDoc
Downloads HTML content of Apache Confluence documentation pages (currently set for [AdroitLogic UltraESB documentation](http://docs.adroitlogic.org/display/esb/AdroitLogic+UltraESB+-+Documentation)) in text format, ignoring headers and sidebars; useful for exporting documentation content for further processing

### FiverrErrorCatcher
Catches and handles (suppresses) WebSocket connection failures on opening [Fiverr](https://www.fiverr.com) pages which, if not handled, break the JavaScript page rendering flow

### MarkdownURLFixer
When using [Markdown Viewer add-on](https://addons.mozilla.org/en-US/firefox/addon/markdown-viewer/) on local clones of online content (e.g. repositories with nested MD files), fixes relative paths of anchor nodes (e.g. `../README.md` as rendered by the add-on), for local browsing (e.g. `file:../README.md`)
