var genderSelector;
var start = function () {
// storing original coordinates
	this.ox = this.attr("cx");
	this.oy = this.attr("cy");
	this.attr({opacity: 0.5});
},
move = function (dx, dy) {
	// TODO: check for collisions
	// TODO: Update hidden fields with values
},
up = function () {
	// restoring state
	this.attr({opacity: 1.0});
},

over = function() {
	document.body.style.cursor = "move";
},
out = function() {
	document.body.style.cursor = "default";
},
arcAt = function(paper, centerX, centerY, radius, startAngle, endAngle){
	// TODO: draw arc at location
	var startX = centerX+radius*Math.cos(startAngle);
	var startY = centerY+radius*Math.sin(startAngle);
	var endX = centerX+radius*Math.cos(endAngle);
	var endY = centerY+radius*Math.sin(endAngle);

	var arcSVG = [radius, radius, 0, 0, 0, endX, endY].join(' ');

	return " A" + arcSVG;
},
reuleauxAt = function(paper,x,y,r) {
	// TODO: update to draw reuleaux trinangle at specified location and radius
	r = r || 1;

	var reuleauxFocals = function(x,y,r) {
		r = r || 1;
		var ret = new Array();
		ret[0] = {x:x,y:y-r};
		var diff_x = r * 0.5 * Math.sqrt(3);
		ret[1] = {x:x-diff_x,y:y+(0.5 * r)};
		ret[2] = {x:x+diff_x,y:ret[1].y};
		return ret;
	};

	var cir_r = 2*r*r*(1-Math.cos(2/3*Math.PI));
	cir_r = Math.sqrt(cir_r);

	var points = reuleauxFocals(x,y,r);

	var start = 2*Math.PI+(Math.PI/3);
	var pathstr = " M" + points[1].x + " " + points[1].y;

	for (var i=0;i<3;i++) {
		pathstr += arcAt(	paper,
							points[i].x,
							points[i].y, cir_r,
							start+(Math.PI/3),
							start
						);
		start -= (2*Math.PI)/3;
	}

	paper.path(pathstr).attr({stroke:"red"});
};
window.onload = function() {
	var genderPaper = Raphael("genderTriField", 200, 200);
	// TODO: draw reuleaux triangles
	// TODO: draw labels

	reuleauxAt(genderPaper, 100, 100, 100);

	var sexualityPaper = Raphael("sexualityTriField", 200, 200);
	//TODO: draw reuleaux triangles
	//TODO: draw labels

	var genderXPos, genderYPos, sexualityXPos, sexualityYPos;

	if(document.getElementById("genderXPos").value == "" || document.getElementById("genderYPos").value == "") {
		genderXPos = 100;
		genderYPos = 100;
	} else {
		genderXPos = parseInt(document.getElementById("genderXPos").value);
		genderYPos = parseInt(document.getElementById("genderYPos").value);
	}

	if(document.getElementById("sexualityXPos").value == "" || document.getElementById("sexualityYPos").value == "") {
		sexualityXPos = 100;
		sexualityYPos = 100;
	} else {
		sexualityXPos = parseInt(document.getElementById("sexualityXPos").value);
		sexualityYPos = parseInt(document.getElementById("sexualityYPos").value);
	}

	// clear fill opacity to allow for selection of entire circle
	genderSelector = genderPaper.circle(genderXPos,genderYPos,5).attr({stroke: "#999", "stroke-width": 2, fill: "#fff", "fill-opacity": 0.0});
	var sexualitySelector = sexualityPaper.circle(sexualityXPos,sexualityYPos,5).attr({stroke: "#999", "stroke-width": 2, fill: "#fff", "fill-opacity": 0.0});

	// add drag events to gender and sexuality selectors
	genderSelector.drag(move, start, up);
	sexualitySelector.drag(move, start, up);

	genderSelector.mouseover(over);
	genderSelector.mouseout(out);
	sexualitySelector.mouseover(over);
	sexualitySelector.mouseout(out);
}
