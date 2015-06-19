var keys = Object.keys(window);

var backup = {}
for(i in keys) {
	var key = keys[i];
	backup[key] = window[key];
}

for(i in keys) {
	var key = keys[i];
	if(backup[key] != window[key])
		console.log(key + ' ' + backup[key] + ' ' + window[key]);
}
