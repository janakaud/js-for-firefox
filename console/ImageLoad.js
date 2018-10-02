//reload
var l = document.getElementsByTagName('img');
for(i = 0; i < l.length; i++) {
	console.log(i, l[i].src);
}
var end = l.length - parseInt(prompt('End chop (0-based)'));
for(i = parseInt(prompt('Start chop')); i < end; i++) {
	l[i].src = l[i].src.replace(/^https?:\/\//, '//');
}

//BIC thumbnails
$('.spec-scroll img').each(function(i, img) {
	img.src = img.src.replace(/^https?:\/\//, '//');
})

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

var l = document.getElementsByTagName('img');
for(i = 0; i < l.length; i++) {
	console.log(l[i].src);
}
var end = l.length - parseInt(prompt('End chop'));
for(i = parseInt(prompt('Start chop')); i < end; i++) {
	l[i].src = l[i].src ? l[i].src.substring(5) : l[i].getAttribute('data-src');
}

//Gmail msg reload
var l = document.getElementsByClassName('msg')[0].getElementsByTagName('img');
var end = l.length - parseInt(prompt('End chop'));
for(i = parseInt(prompt('Start chop')); i < end; i++) {
l[i].src += '?';
}

