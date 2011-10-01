var inBig = false;
var inSmall = false;
var genderSelector;

var start = function () {
// storing original coordinates
	this.ox = this.attr("cx");
	this.oy = this.attr("cy");
	this.attr({opacity: 0.5});
};

move = function (dx, dy) {
	var newx = this.ox + dx;
	var newy = this.oy + dy;

	// Snap to the middle of the small triangle if inside
	if(inSmall){
		newx = 100;
		newy = 100;
		this.attr({cx: newx, cy: newy});
	}

	if(inBig){
		this.attr({cx: newx, cy: newy});
	}

	if(this == genderSelector){
		// gender value given in (male, female, none)
		// TODO: record gender value 

		document.getElementById("genderXPos").value = newx;
		document.getElementById("genderYPos").value = newy;
	} else {
		// sexuality value given in (men, women, indifferent)
		// RODO: record sexuality value

		document.getElementById("sexualityXPos").value = newx;
		document.getElementById("sexualityYPos").value = newy;
	}
};

up = function () {
	// restoring state
	this.attr({opacity: 1.0});
};

over = function() {

};

out = function() {

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

	// hover events to deal with "collisions"
	tris.outer.hover(function (event) {
		inBig = true;
	}, function (event) {
		inBig = false;
	});

	tris.inner.hover(function (event){
		inSmall = true;
	}, function (event){
		inSmall = false;
	});

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

	gender.paper = Raphael("genderTriField", 200, 200);
	gender.tris = drawSelector(gender.paper, 100, 100, 100, attr.outer, attr.inner);

	// draw gender labels
	gender.paper.text(100,100,"none");
	gender.paper.text(100,20, "all");
	gender.paper.text(40,140,"female");
	gender.paper.text(165,140, "male");
	gender.paper.text(100,180,"Gender Identity");

	sexuality.paper = Raphael("sexualityTriField", 200, 200);
	sexuality.tris = drawSelector(sexuality.paper, 100, 100, 100, attr.outer, attr.inner);

	// draw sexuality labels
	sexuality.paper.text(100,100,"none");
	sexuality.paper.text(100,20, "all");
	sexuality.paper.text(40,140,"women");
	sexuality.paper.text(165,140, "men");
	sexuality.paper.text(100,180,"Attracted To");

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

	genderSelector = gender.selector;

	// add drag events to gender and sexuality selectors
	gender.selector.drag(move, start, up);
	sexuality.selector.drag(move, start, up);

	gender.selector.mouseover(over);
	gender.selector.mouseout(out);
	sexuality.selector.mouseover(over);
	sexuality.selector.mouseout(out);
}
