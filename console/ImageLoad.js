var l = document.getElementsByTagName('img');
var end = l.length - parseInt(prompt('End chop'));
for(i = parseInt(prompt('Start chop')); i < end; i++) {
l[i].src += '?';
}

var l = document.getElementsByTagName('img');
var end = l.length - parseInt(prompt('End chop'));
for(i = parseInt(prompt('Start chop')); i < end; i++) {
l[i].src = l[i].getAttribute('data-original') + '?';
}

var l = document.getElementsByClassName('msg')[0].getElementsByTagName('img');
var end = l.length - parseInt(prompt('End chop'));
for(i = parseInt(prompt('Start chop')); i < end; i++) {
l[i].src += '?';
}

