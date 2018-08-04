// svg = `<svg content>`
dattr = /d="[^"]+"/g;
coord = /(\d+(\.\d+|))/g;

minX = minY = NaN;
svg.match(dattr).forEach(d => {
    d.match(digits).forEach((match, i) => {
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
moved = svg.replace(dattr, d => d.replace(digits, (match, pos, full) => {
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