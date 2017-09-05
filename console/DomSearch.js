function find(o, cur, name) {
	if (stack.indexOf(o) >= 0) {
		return false;
	}
	stack.push(o);
	names.push(cur);
try {
	for (k in o) {
		if (k == name || find(o[k], k, name)) {
			console.log(names);
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
stack = [document]; names = ["document"]; find(window, "window", "ajaxSetup")
