var genderSelector;

var start = function () {
// storing original coordinates
	this.ox = this.attr("cx");
	this.oy = this.attr("cy");
	this.attr({opacity: 0.5});
};

move = function (dx, dy) {
	// TODO: check for collisions
	// TODO: Update hidden fields with values
};

up = function () {
	// restoring state
	this.attr({opacity: 1.0});
};

over = function() {
	document.body.style.cursor = "move";
};

out = function() {
	document.body.style.cursor = "default";
};

Raphael.fn.arc = function(centerX, centerY, radius, startAngle, endAngle) {
	var endX = centerX+radius*Math.cos(endAngle);
	var endY = centerY+radius*Math.sin(endAngle);

	var arcSVG = [radius, radius, 0, 0, 0, endX, endY].join(',');

	return this.path("A" + arcSVG);
};

Raphael.fn.reuleaux = function(x, y, r) {
	r = r || 1;

	var cir_r = 2*r*r*(1-Math.cos(2/3*Math.PI));
	cir_r = Math.sqrt(cir_r);

	var points = new Array();
	points[0] = {x:x,y:y-r};
	var diff_x = r * 0.5 * Math.sqrt(3);
	points[1] = {x:x-diff_x,y:y+(0.5 * r)};
	points[2] = {x:x+diff_x,y:points[1].y};

	var start = 2*Math.PI+(Math.PI/3);
	var pathstr = "M" + points[0].x + " " + points[0].y;

	for (var i=0;i<3;i++) {
		var next_point = points[(i + 1) % 3];
		pathstr += "A" + [cir_r, cir_r, 0, 0, 0, next_point.x, next_point.y].join(',');
		start -= 2 * Math.PI/3;
	}

	pathstr += "z";
	return this.path(pathstr);
};

function drawSelector(paper, x, y, size, attr_outer, attr_inner, inner_size) {
	var tri_fit = 0.98;
	if (!inner_size) inner_size = 0.17;

	var tris = {};

	tris.outer = paper.reuleaux(x, y, size*tri_fit).attr(attr_outer);
	tris.inner = paper.reuleaux(x, y, size*tri_fit*inner_size).attr(attr_inner);

	return tris;
}

window.onload = function() {
	// TODO: draw reuleaux triangles
	// TODO: draw labels

	var gender = {};
	var sexuality = {};
	var attr = {};

	attr.outer = {fill: "#ccf", stroke: "#225", "stroke-width": "1.35"};
	attr.inner = {fill: "#fff", stroke: "#558", "stroke-width": "1.15"};

	//TODO: draw labels

	gender.paper = Raphael("genderTriField", 200, 200);
	gender.tris = drawSelector(gender.paper, 100, 100, 100, attr.outer, attr.inner);

	sexuality.paper = Raphael("sexualityTriField", 200, 200);
	sexuality.tris = drawSelector(sexuality.paper, 100, 100, 100, attr.outer, attr.inner);

	//TODO: Remove this redundancy
	if(document.getElementById("genderXPos").value == "" || document.getElementById("genderYPos").value == "") {
		gender.x = 100;
		gender.y = 100;
	} else {
		gender.x = parseInt(document.getElementById("genderXPos").value);
		gender.y = parseInt(document.getElementById("genderYPos").value);
	}

	if(document.getElementById("sexualityXPos").value == "" || document.getElementById("sexualityYPos").value == "") {
		sexuality.x = 100;
		sexuality.y = 100;
	} else {
		sexuality.x = parseInt(document.getElementById("sexualityXPos").value);
		sexuality.y = parseInt(document.getElementById("sexualityYPos").value);
	}

	// clear fill opacity to allow for selection of entire circle
	gender.selector = gender.paper.circle(gender.x,gender.y,5).attr({stroke: "#999", "stroke-width": 2, fill: "#fff", "fill-opacity": 0.0});
	sexuality.selector = sexuality.paper.circle(sexuality.x,sexuality.y,5).attr({stroke: "#999", "stroke-width": 2, fill: "#fff", "fill-opacity": 0.0});

	// add drag events to gender and sexuality selectors
	gender.selector.drag(move, start, up);
	sexuality.selector.drag(move, start, up);

	gender.selector.mouseover(over);
	gender.selector.mouseout(out);
	sexuality.selector.mouseover(over);
	sexuality.selector.mouseout(out);
}
