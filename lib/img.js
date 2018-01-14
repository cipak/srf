var img = (function() {
	var img = {
		position: undefined,
		canvas: undefined,
		context: undefined,
		w: undefined,
		h: undefined,
		pixels: undefined,
		select: select,
		getx: (i) => i/4 % img.w,
		gety: (i) => Math.floor(i/4/img.w),
		getRGB: (i) => img.pixels.slice(i, i+3),
		getRGBxy: (x, y) => img.pixels.slice((y*img.w+x)*4, (y*img.w+x)*4 + 3),
		drawLine: drawLine,
		clear: clear,
		circle: circle,
		pixel: pixel
	};

	$(function() {
		img.canvas = $('canvas').hide().get(0);
		img.context = img.canvas.getContext('2d');
	});

	return img;

	function select(imgElem) {
		img.w = img.canvas.width = imgElem.width;
		img.h = img.canvas.height = imgElem.height;

		img.position = $(imgElem).position();
		$(img.canvas).css(img.position).show();

		img.context.drawImage(imgElem, 0, 0, img.w, img.h);
		img.pixels = img.context.getImageData(0, 0, img.w, img.h).data;
	}

	function drawLine(a, b, c) { // ax+by+c = 0
		var [x0, y0, x1, y1] = b ? [0, -c/b, img.w, (-c-a*img.w)/b] : [-c/a, 0, -c/a, img.h]; 

		img.context.beginPath();
		img.context.moveTo(x0, y0);
		img.context.lineTo(x1, y1);
		img.context.stroke();
	}

	function clear() {
		img.context.clearRect(0, 0, img.w, img.h);
	}

	function circle(x, y, r) {
		img.context.beginPath();
		img.context.arc(x, y, r, 0, 2 * Math.PI);
		img.context.stroke();
	}

	function pixel(x, y, color) {
		var defaultColor = setFillColor(color);
		img.context.fillRect(x, y, 1, 1);
		setFillColor(defaultColor);
	}

	function setFillColor(color) {
		var prevColor = img.context.fillStyle;
		if(color) {
			img.context.fillStyle = toColor(color);
		}
		return prevColor;
	}

	function toColor(color) {
		if(!color || typeof color === 'string') {
			return color;
		}
		return 'rgb(' + color.join(', ') + ')';
	}

}());



