//reload
var l = document.getElementsByTagName('img');
for(i = 0; i < l.length; i++) {
	console.log(l[i].src);
}
var end = l.length - parseInt(prompt('End chop'));
for(i = parseInt(prompt('Start chop')); i < end; i++) {
	l[i].src = l[i].src.substring(5);
}

//dynamic img URLs
var l = document.getElementsByTagName('img');
var end = l.length - parseInt(prompt('End chop'));
for(i = parseInt(prompt('Start chop')); i < end; i++) {
	if(l[i].src != "") {
		l[i].src += "?";
	} else {
		l[i].src = l[i].getAttribute('data-original');
	}
}

//Gmail msg reload
var l = document.getElementsByClassName('msg')[0].getElementsByTagName('img');
var end = l.length - parseInt(prompt('End chop'));
for(i = parseInt(prompt('Start chop')); i < end; i++) {
l[i].src += '?';
}

