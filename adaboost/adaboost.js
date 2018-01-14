function findWeakLearner(X, y, w, Xmin, Xmax) {
	var n = X.length; // nr instante
	var m = X[0].length; // nr trasaturi

	var bestErr = Infinity;
	var bestClasif = null;

	for(let j=0; j<m; j++) { // j = trasatura
		for(let prag=Xmin[j]; prag<=Xmax[j]; prag++) { // se plimba intre min si max
			for(let clasa=-1; clasa<=1; clasa+=2) {
				// avem un candidat: clasificator slab descris de j, prag si clasa (stanga-dreapta)
				var err = 0;

				// calculam eroarea totala (pe toate instantele)
				for(var i=0; i<n; i++) {
					var z = X[i][j] < prag ? clasa : -clasa; // predictie
					if(z*y[i] < 0) {
						err += w[i]; // fiecare instanta contribuie la eroare cu ponderea w
						if(err >= bestErr) {
							break; // candidatul a esuat, deja eroarea e prea mare
						}
					}
				}
				if(err < bestErr) {
					bestErr = err;
					bestClasif = {
						clasifica: (x) => x[j] < prag ? clasa : -clasa,
						err: err,
						j: j,
						prag: prag,
						clasa: clasa
					}
				}
			}
		}
	}

	return bestClasif;
}

function adaboost(X, y, Xmin, Xmax, T, isAcceptable) {
	var n = X.length; // nr. instante
	var w = []; // ponderi instante
	var wInit = 1 / n;
	var clasif = {
		hs: [], // lista de clasificatori slabi
		alphas: [], // lista de ponderi pt clasificatori
		clasifica: (x) => sgn(clasif.hs.reduce((sum, h, t) => sum + h.clasifica(x) * clasif.alphas[t], 0))
	};


	for(var i=0; i<n; i++) {
		w[i] = wInit;
	}

	for(var t=0; t<T; t++) {
		var h = findWeakLearner(X, y, w, Xmin, Xmax);
		clasif.hs.push(h);
		var alpha = ln((1-h.err)/h.err) / 2;
		clasif.alphas.push(alpha);

		wSum = 0;
		for(var i=0; i<n; i++) {
			w[i] *= exp(-alpha * y[i] * h.clasifica(X[i]));
			wSum += w[i];
		}

		for(var i=0; i<n; i++) {
			w[i] /= wSum;
		}
		if(isAcceptable && isAcceptable(clasif)) {
			break;
		}
	}

	return clasif;
}