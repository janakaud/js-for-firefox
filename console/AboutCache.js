l = getList();
list = [];
for(i = 0; i < l.length; i++) {
	result = process(l[i])
	if(result) {
		list.push(result)
	}
}
console.log(list.length)
console.log(list.join('\n'))
/*//download
link = document.createElement('a');
link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(list.join('\n')));
link.setAttribute('download', 'out.csv');
document.body.appendChild(link);
link.click();*/

//process about:cache URLs
function getList() {
	return Array.map(document.links, function(e) { return e.innerHTML });
}

//strip timestamps
function process(url) {
	if(!url.match(/\b\.(js|css)\?\b/))
		return null;
	k = url.match(/\b(date|v|ver|_|_v|t|timestamp|_t)\b=[-a-z0-9.]{2,}&?|\?[a-z0-9]+$/);
	if(!k)
		return null;
	url = url.replace(k[0], '');
	if(url.endsWith('?'))
		url = url.substring(0, url.length - 1);
	return url;
}


//process rows
function getList() {
	return document.getElementById('entries').rows;
}

//find once-used entries
function process(row) {
	if(row.cells[2].innerHTML == '1') {
		url = row.cells[0].children[0].innerHTML;
		if(url.match(/\b(js|css)\b/))
			return url;
	}
	return null;
}

