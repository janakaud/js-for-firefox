function find(o, cur, name) {
    if ((stack.length > 0 && o instanceof Window) || o instanceof Document || o instanceof Element || stack.indexOf(o) >= 0) {
        return false;
    }
    stack.push(o);
    names.push(cur);
try {
    for (k in o) {
        if (k.indexOf(name) > -1 || find(o[k], k, name)) {
            console.log(k, names);
            stack.pop();
            names.pop();
            return true;
        }
    }
} catch (e) {}
    stack.pop();
    names.pop();
    return false;
}
stack = []; names = [];
find(window, "window", "xsrf")