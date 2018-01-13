function abs(x) { return Math.abs(x); }

function sgn(x) { return Math.sign(x); }

function prod_scalar(v1, v2) {
	var prod = 0;
	for(var i=0; i<v1.length; i++) {
		prod += v1[i] * v2[i];
	}
	return prod;
}

function undef(val, defval) {
	return val === undefined ? defval: val;
}
