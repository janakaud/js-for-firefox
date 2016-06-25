These scripts can be simply run in the browser's JS web console (`Ctrl+Shift+K` or `F12`). For this reason many of them should also work with other browsers like Google Chrome.

The following scripts include multiple executable code blocks, and the suitable candidate can be picked based on the preceding header comments:

### ImageLoad
Reloads images on the current webpage by inducing a change of the image URL (`src` property of each `img` tag), by removing the protocol part (`http:`, adjustable to `https:` by changing `substring(5)` to `substring(6)`), appending a `?`, or copying the URL from a different attribute (e.g. `data-original` to `src`, as in BuyInCoins). Initially all URLs are printed into the console, and you are given a choice to ignore a certain number of URLs (images) from the top and bottom (as most pages contain unnecessary header/footer images).

### RefreshResources
Attempts to reload JS and CSS resources on current page by removing and reappending their respective DOM elements (tags) to the main `document` (DOM), or by opening them in new tabs to be auto-closed after a few seconds (less effective).

### YoutubeDownload
Downloads YouTube playlists via the www.downvids.net website. You first have to open the playlist page in YT, run the first script, copy the content of the resulting `alert` message, switch to DownVids, run the second script, and paste the content in the input box.

Other scripts are straightforward to use:

### SaveFrom
Similar to [YoutubeDownload](#youtubedownload), but works on savefrom.net, opening a new tab for each selected video

### 2048Hack
A player for the once-famous [2048 game](https://gabrielecirulli.github.io/2048/) which makes rapid random moves (with a slight bias towards increasing the sum obtainable in the current move) until the game is over

### 2048DirtyTrick
A trick that reconfigures the 2048 game board to show that you have won the game; a good opportunity to show off without going through the actual trouble of solving the puzzle

### AboutCache
Rewrites some of the URLs on the `about:cache` page to eliminate dynamic parameters; see [ToggleRW](../keyconfig/README.md#togglerw)

### Coursera_download
Automatically downloads all MP4 videos from a resources page of a [Coursera](https://www.coursera.org/) course

### DigCache
Searches the browser cache for a given keyword, similar to [CacheViewer addon](https://addons.mozilla.org/en-US/firefox/addon/cacheviewer/). Must be run on the browser's context (`Ctrl+Shift+J`) rather than on a single page or tab's context.

### FileStream_Multiple
Automates selection of multiple files on a long file list in [FileStream](https://filestream.me/) (where each selection triggers a HTTP request, hence making multiple selections takes a lot of time); resumable

### GmailDelete
Selects and deletes all visible mails on [Gmail mobile view](https://mail.google.com/mail/u/0/x/a)

### plainhtml
Older version of [ToggleMedia](../keyconfig/README.md#togglemedia), not used anymore

### TrackVars
Makes a dump of all variables in the current window (tab) context (`Object.keys(window)`) for later reference. First block saves existing values, and the second compares stored values with current values in `window`.

