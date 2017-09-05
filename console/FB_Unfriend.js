// https://x.facebook.com/friends/center/friends/?mff_nav=1
btns = document.querySelectorAll("button._56bt");
i = parseInt(prompt("resume from"));
for (i += (1 - i % 2); i < btns.length; i += 2) {
	btns[i].click();
	go = prompt("Unfriend " + btns[i].parentElement.parentElement.parentElement.parentElement.parentElement.children[1].children[0].children[0].textContent + "?");
	if (go != null) {
		if (go.length > 0) {
			break;
		}
		document.querySelectorAll('a[data-sigil="touchable touchable mflyout-remove-on-click m-unfriend-request"]')[0].click();
	}
	console.log(i);
}
