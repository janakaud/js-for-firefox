/*
svg = `<svg content>`
*/
dattr = /d="[^"]+"/g;
coord = /(\d+(\.\d+|))/g;

minX = minY = NaN;
svg.match(dattr).forEach(d => {
    d.match(coord).forEach((match, i) => {
        v = parseFloat(match);
        if (i % 2 === 0) {
            if (!minX || minX > v) {
                minX = v;
            }
        } else {
            if (!minY || minY > v) {
                minY = v;
            }
        }
    });
});

i = 0;
moved = svg.replace(dattr, d => d.replace(coord, (match, pos, full) => {
    val = (parseFloat(match) - (i++ % 2 === 0 ? minX : minY)).toFixed(4);
    end = val.indexOf(".999");
    if (end < 0) {
        end = val.indexOf(".000");
    }
    if (end >= 0) {
        val = val.substring(0, end);
    }
    return val;
}));
copy(moved);



/* temp

x = NaN;
y = NaN;
minX = Infinity;
minY = Infinity;

xx.match(/[\w-]\d+(\.\d+|),-?\d+(\.\d+|)/g).forEach(pair => {
    val = pair.match(/(-?\d+(\.\d+|)),(-?\d+(\.\d+|))/).map(parseFloat);
    if (pair.match(/^[A-Z]/)) {
        x = val[1];
        y = val[2];
    } else {
        x += val[1];
        y += val[2];
    }
console.log(val[1], val[2])
    if (minX > x) {
        minX = x;
    }
    if (minY > y) {
        minY = y;
    }
});

console.log(minX);
console.log(minY);

*/