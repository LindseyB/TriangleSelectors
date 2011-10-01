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

function drawSelector(paper, x, y, size, attr_outer, attr_inner, caption, labels, start_x, start_y, inner_size) {
	var tri_fit = 0.98;
	if (!inner_size) inner_size = 0.17;

	var selector = {};

	selector.update = function(x,y) {
		selector.x = x;
		selector.y = y;
	};
	
	// an event for when the knob moves (initially, do nothing)
	selector.updated = function(x,y) {};

	selector.tris = {};
	selector.tris.outer = paper.reuleaux(x, y, size*tri_fit).attr(attr_outer);
	selector.tris.inner = paper.reuleaux(x, y, size*tri_fit*inner_size).attr(attr_inner);

	selector.inBig = false;
	selector.inSmall = false;

	// hover events to deal with "collisions"
	selector.tris.outer.hover(function (event) {
		selector.inBig = true;
	}, function (event) {
		selector.inBig = false;
	});

	selector.tris.inner.hover(function (event){
		selector.inSmall = true;
	}, function (event){
		selector.inSmall = false;
	});

	// draw non-colliding gender labels
	// TODO: make these coords relative to the size! scale if necessary!
	selector.labels = {};
	selector.labels.middle = paper.text(100,100,labels.middle).hover(function (event){selector.inSmall = true;}, function (event){selector.inSmall = false;});
	selector.labels.top = paper.text(100,20, labels.top).hover(function (event){selector.inBig = true;}, function (event){selector.inBig = false;});
	selector.labels.left = paper.text(40,140,labels.left).hover(function (event){selector.inBig = true;}, function (event){selector.inBig = false;});
	selector.labels.right = paper.text(165,140, labels.right).hover(function (event){selector.inBig = true;}, function (event){selector.inBig = false;});
	selector.caption = paper.text(100,180,caption);

	// Set knob coords
	if (start_x) {
		selector.x = start_x;
	}
	else {
		selector.x = x;
	}

	if (start_y) {
		selector.y = start_y;
	}
	else {
		selector.y = y;
	}

	// selector
	selector.knob = paper.circle(selector.x,selector.y,5).attr({stroke: "#999", "stroke-width": 2, fill: "#fff", "fill-opacity": 0.0});

	// add drag events to knob

	// What happens when the knob is dragged
	selector.knob.drag(
		// on move
		function (dx, dy) {
			var newx = this.ox + dx;
			var newy = this.oy + dy;

			// Snap to the middle of the small triangle if inside
			if(selector.inSmall){
				newx = x;
				newy = y;
				this.attr({cx: newx, cy: newy});
			}

			if(selector.inBig){
				this.attr({cx: newx, cy: newy});
			}

			selector.updated(newx, newy);
		},
		// on start
		function() {
			// storing original coordinates
			this.ox = this.attr("cx");
			this.oy = this.attr("cy");
			this.attr({opacity: 0.5});
		},
		// when done
		function() {
			// restoring state
			this.attr({opacity: 1.0});
		});

	// extra event for when we mouse out of the knob
	selector.knob.mouseout(
		function() {
			// restoring state
			this.attr({opacity: 1.0});
		});

	return selector;
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
	gender.selector = drawSelector(gender.paper,
	                           100, 100, 100,
							   attr.outer, attr.inner,
							   "Gender Identity",
							   {middle: "none", top: "all", left: "female", right: "male"},
	                              parseInt(document.getElementById("genderXPos").value) || 100,
	                              parseInt(document.getElementById("genderYPos").value) || 100);

	gender.selector.updated = function(newx,newy) {
		document.getElementById("genderXPos").value = newx;
		document.getElementById("genderYPos").value = newy;
	}

	sexuality.paper = Raphael("sexualityTriField", 200, 200);
	sexuality.selector = drawSelector(sexuality.paper,
	                              100, 100, 100,
								  attr.outer, attr.inner,
								  "Attracted To",
		  					      {middle: "none", top: "all", left: "women", right: "men"},
	                              parseInt(document.getElementById("sexualityXPos").value) || 100,
	                              parseInt(document.getElementById("sexualityYPos").value) || 100);

	sexuality.selector.updated = function(newx,newy) {
		document.getElementById("sexualityXPos").value = newx;
		document.getElementById("sexualityYPos").value = newy;
	}
}
