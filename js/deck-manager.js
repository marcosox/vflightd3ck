var svgElement;
var divArea;
var decks = {};
var viewAircrafts = [];
var activeDeckId;
var dragFunction;
var selectedSVGAircraft = {};

// px/m: 3.807

// ***************************************** view functions (responsible for viewAircrafts) interface for the presentation layer

/**
 * generates an uuid v4 (random)
 * @returns {string} the uuid
 */
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

/**
 * adds a new aircraft to the view
 * @param {string} aircraftId model ID as defined in installedAircrafts.js
 * @param {string} [shape] shape as defined in installedAircrafts.js
 * @param {number} qty quantity
 * @param {number || string} [x] initial X position
 * @param {number || string} [y] initial Y position
 * @param {number || string} [r] initial rotation in degrees
 * @param {string} [fill] aircraft color string (css values)
 * @param {string} [label] aircraft text label
 */
function addAircraftToView(aircraftId, shape, qty, x, y, r, fill, label) {

	var aircraftDefinition = installedAircrafts[aircraftId];
	if (x === 0 || x === "0" || x === "default" || typeof x === "undefined" || x === null) {
		x = 250;
	}
	if (y === 0 || y === "0" || y === "default" || typeof y === "undefined" || y === null) {
		y = 250;
	}
	if (fill === "default" || fill === null || typeof fill === "undefined") {
		fill = config.colors[0];
	}
	if (shape === "default" || shape === null || typeof shape === "undefined") {
		shape = aircraftDefinition.shapes[0];
	}
	for (var i = 0; i < qty; i++) {
		if (typeof label === "undefined" || label === null) {
			label = "";
		}
		var newLabel = label;
		if (qty > 1 && newLabel.match(/.*[0-9_]+X/) !== null) {
			newLabel = newLabel.substr(0, newLabel.length - (i.toString().length)).concat("" + i);
		}
		viewAircrafts.push({
			id: uuidv4(),
			label: newLabel,
			model: aircraftId,
			shape: shape,
			x: x + (i * aircraftDefinition.width / 2), //space them apart if more than one
			y: y,
			r: r,
			fill: fill,
			width: aircraftDefinition.width,
			heigth: aircraftDefinition.heigth,
			fontSize: aircraftDefinition.fontSize,
			shapes: aircraftDefinition.shapes
		});
	}
	render();
}

/**
 * removes an aircraft from the view
 * @param aircraft the selected view aircraft
 */
function removeAircraftFromView(aircraft) {
	viewAircrafts.splice(viewAircrafts.indexOf(aircraft), 1);
	render();
}

/**
 * delete all aircrafts from the current deck
 */
function clearView() {
	viewAircrafts = [];
	render();
}

/**
 *  saves (in memory) the configuration for the current deck
 */
function saveViewToDeck() {
	decks[activeDeckId].config = viewAircrafts;
}

/**
 * loads a deck configuration from the corresponding deck to the view
 * @param {string} deckId ID of the deck to show
 */
function loadDeckConfigIntoView(deckId) {
	viewAircrafts = decks[deckId].config;
	render();
}

/**
 * resets the view the current deck configuration, without overwriting it first
 */
function reloadView() {
	clearView();
	loadDeckConfigIntoView(activeDeckId);
}

// ***************************************** synchronization between view data and presentation layer

/**
 * Synchronizes the data with the view using the D3 update pattern
 */
function render() {

	// **************** JOIN: Join new data with old elements, if any.
	var updateSelection = svgElement.selectAll("#svg_element > g")	// main groups -
		.data(viewAircrafts, function (aircraft) {
			return aircraft.id;	//key function
		});
	//console.log("main selection: ", updateSelection.size(), updateSelection.nodes());

	// **************** EXIT: Remove old elements as needed.
	var exitSelection = updateSelection.exit();
	//console.log("exit selection: ",exitSelection.size(), exitSelection.nodes());
	exitSelection.remove();

	// **************** ENTER selection
	//console.log("enter selection: ", updateSelection.enter().size(), updateSelection.enter().nodes());

	var newGroups = updateSelection.enter().append("g")	// main group
		.on("dblclick", dblClickHandler)
		.on("click", leftClickHandler)
		.on("contextmenu", rightClickHandler)
		.call(dragFunction);

	newGroups.append("use");	// aircraft figure

	var newLabelGroups = newGroups.append("g")
		.attr("title", function (d) {
			return d.label;
		});	// label groups

	newLabelGroups.append("rect")	// aircraft label background rectangle
		.attr("x", 0)	// unimportant: will be set by the text
		.attr("y", function (d) {
			return (d.heigth * 1.0 / 2.0) - (d.fontSize * 1.0 / 2.0) + (d.fontSize * 1.0 / 6.0);	// center rect vertically
		})
		.attr("width", function () {
			return 0;	// unimportant: will be set by the text
		})
		.attr("height", function (d) {
			return d.fontSize;
		})
		.classed("aircraftLabelRect", true);

	newLabelGroups.append("text")	// aircraft label text
		.attr("font-size", function (d) {
			return d.fontSize;
		})
		.classed("aircraftLabelText", true);

	var groups = newGroups.merge(updateSelection);	// sync with the data
	//console.log("selection after merge: ", groups.size(), groups.nodes());

	// **************** UPDATE: Update all elements as needed.
	groups.attr("transform", function (d) {
		return ("translate(" + d.x + "," + d.y + ")");	// aircraft position
	});
	groups.select("use")
		.attr("xlink:href", function (d) {
			return "#" + d.model + "_" + d.shape;	//aircraft shape
		})
		.attr("transform", function (d) {	// aircraft rotation
			return (" rotate(" + d.r + ","
			+ Math.floor(d.width / 2) + ","
			+ Math.floor(d.heigth / 2) + ")");
		})
		.style("fill", function (d) {
			return d.fill;	// aircraft color
		});

	groups.select("g").select("text")	//label text
		.text(function (d) {
			return "" + d.label;
		})
		.attr("x", function (d) {
			var labelWidth = this.getComputedTextLength();
			d3.select(this.parentNode).select("rect")	// update label rect
				.attr("width", labelWidth)
				.attr("x", (d.width / 2) - (labelWidth / 2));
			return (d.width / 2) - (labelWidth / 2);
		})
		.attr("y", function (d) {
			return (d.heigth / 2) + (d.fontSize / 2);
		});
}

// ***************************************** page functions (presentation layer)

/**
 * setup the web page
 */
function initPage() {
	svgElement = d3.select("#svg_element");
	divArea = d3.select("#deckArea");

	d3.select('#addDiv').node().style.display = 'none';
    d3.select('#importDiv').node().style.display = 'none';
	d3.select("#colorPaletteHeader").on("dblclick", function () {
		promptColorBoxesHeader(d3.select("#colorPaletteHeader").text());
	});
	drawColorBoxes(config.colors);

	loadInstalledAircrafts(installedAircrafts);
	loadInstalledDecks(installedDecks);

	populateDeckSelector(decks);
	populateAircraftSelector(installedAircrafts);

	var decksIDs = d3.select("#view_select").node().options;
	activeDeckId = decksIDs[decksIDs.selectedIndex].value;

	// drag behavior - override the default behaviour of not catching right drags
	dragFunction = d3.drag()
		.on("drag", dragHandler)
		.filter(function () {
			return true;
		})
		.on("end", function () {
			$("html").css("cursor", "auto");
		});

	changeDeckListener(activeDeckId);
}

/**
 * loads data from the installed decks
 * @param d installed decks data
 */
function loadInstalledDecks(d) {
	Object.keys(d).forEach(function (key) {
		decks[key] = d[key];
		if (!decks[key].config) {
			decks[key].config = [];
		}
	});
}

/**
 * load symbols from installedAircrafts array keys.
 * looks for svg files inside shapesPath named as installedAircrafts[key]+"_"+installedAircrafts[key].shapes[0]
 * e.g.: F18_spread.svg, F18_fold.svg, SH60_running.svg
 * SVG files must be composed of a single path element
 */
function loadInstalledAircrafts() {
	Object.keys(installedAircrafts).forEach(function (key) {		// for every key in the array
		for (var shapes_idx = 0; shapes_idx < installedAircrafts[key].shapes.length; shapes_idx++) { // for every key in the shapes array
			var svgId = key + "_" + installedAircrafts[key].shapes[shapes_idx];
			d3.xml(config.shapesPath + svgId + ".svg", addSvgSymbolCallback(svgId)).mimeType("image/svg+xml");
		}
	});
}

// ********** page manipulation

/**
 * sets the html background with the deck image file
 * @param image
 */
function setViewImage(image) {
	divArea.style("background-image", "url(" + image + ")");
}

/**
 * draws the color palette
 * @param {string[]} colors css color strings array
 * @param {number} [height] height in pixels. if not specified, defaults to css-set height (20px)
 */
function drawColorBoxes(colors, height) {
	var paletteRow = d3.select("#colorPalette");
	if (height !== null && typeof height !== "undefined") {
		paletteRow.style("height", height + "px");
	}
	for (var i = 0; i < colors.length; i++) {
		var colorBox = paletteRow.append("td")
			.style("background-color", colors[i])
			.style("overflow", "hidden")
			.style("text-overflow", "ellipsis")
			.text("" + i);
		colorBox.on("dblclick", function () {
			promptColorBoxLabel(this, d3.select(this).text());
		});
	}
}

/**
 * sets the label for a color box
 * @param HTMLElement color box html element
 * @param newLabel the new label for this box
 */
function setColorBoxLabel(HTMLElement, newLabel) {
	var rect = d3.select(HTMLElement);
	rect.text(newLabel);
	rect.attr("title", newLabel);
}

/**
 * set the color palette header text
 * @param newLabel the new text
 */
function setColorBoxesHeader(newLabel) {
	d3.select("#colorPaletteHeader").text(newLabel);
}

/**
 * generates options for hotspot selector
 * @param hotspots array of hotspots objects
 */
function populateHotspotsSelector(hotspots) {
	//d3.select("#hotspotSelect").selectAll("*").remove();
	var d3Data = d3.select("#hotspotSelect").selectAll("option").data(hotspots, function (h) {
		return h.title;
	});
	d3Data.exit().remove();
	d3Data.enter().append("option")
		.attr("value", function (d, i) {
			return i;
		})
		.html(function (h) {
			return h.title;
		});
}

/**
 * generates options for deck selector from loaded decks
 */
function populateDeckSelector(decks) {
	var selection = d3.select("#view_select");
	selection.select("*").remove();
	Object.keys(decks).forEach(function (key) {
		selection.append("option").attr("value", key)
			.text(decks[key].title);
	});
}

/**
 * generates options for the aircraft selector from the installed aircrafts
 * @param aircraftModels the installed aircrafts data
 */
function populateAircraftSelector(aircraftModels) {
	var selection = d3.select("#aircraftSelector");
	selection.select("*").remove();
	Object.keys(aircraftModels).forEach(function (key) {
		selection.append("option").attr("value", key)
			.text(aircraftModels[key].title);
	});
}

/**
 * Adds an svgSymbol definition to the svg element
 * @param id
 * @returns {Function}
 */
function addSvgSymbolCallback(id) {
	// return a callback with the proper id reference
	// this should be the most correct and memory safe way to pass extra parameters to a callback
	return function (error, xml) {
		if (error) {
			throw error;
		}
		var symbol = svgElement.append("symbol")
			.attr("id", id);
		symbol.node().appendChild(d3.select(xml).select("path").node());	// append to the symbol element the svg path element.
	}
}

// ********** SVG manipulation for move and rotate - faster than calling render() every time

/**
 * SVG transform object
 * @param x
 * @param y
 * @param r
 * @param rx
 * @param ry
 * @constructor
 */
function Tr(x, y, r, rx, ry) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.rx = rx;
	this.ry = ry;
	/**
	 * rewrite rotate svg string building, because d3 sucks
	 * @returns {string}
	 */
	this.rotation = function rotation() {
		return "rotate(" + this.r + "," + this.rx + "," + this.ry + ")";
	};
	/**
	 * d3.svg.transform is WEIRD to say the least, so I rewrite it
	 */
	this.translation = function translation() {
		return "translate(" + this.x + "," + this.y + ")";
	};
	this.stringa = function stringa() {
		return this.translation() + " " + this.rotation();
	};
}

/**
 * parse a transform string to a Tr object (because d3 is broken in this)
 * @param svgElement
 * @returns {Tr} transform transform object
 */
function parseSVGTransform(svgElement) {
	var transforms = svgElement.attr("transform").split(" ");
	var x = 0;
	var y = 0;
	var r = 0;
	var rx = 0;
	var ry = 0;
	for (var t = 0; t < transforms.length; t++) {
		if (transforms[t].indexOf("rotate") !== -1) {
			var rCoords = transforms[t].substring(transforms[t].indexOf("(") + 1, transforms[t].indexOf(")")).split(",");
			r = (+rCoords[0]);
			rx = (+rCoords[1]);
			ry = (+rCoords[2]);
		} else if (transforms[t].indexOf("translate") !== -1) {
			var coords = transforms[t].substring(transforms[t].indexOf("(") + 1, transforms[t].indexOf(")")).split(",");
			x = (+coords[0]);
			y = (+coords[1]);
		}
	}
	return new Tr(x, y, r, rx, ry);
}

/**
 *
 * @param svgElement aircraft dom svg element
 * @param dx
 * @param dy
 */
function moveSVG(svgElement, dx, dy) {
	var transform = parseSVGTransform(d3.select(svgElement));
	transform.x += dx;
	transform.y += dy;
	d3.select(svgElement).attr("transform", transform.stringa());
}

/**
 * Rotate an aircraft to a relative value
 * @param svgElement aircraft svg element
 * @param rotationDelta relative rotation in degrees
 */
function rotateSVG(svgElement, rotationDelta) {
	var transform = parseSVGTransform(d3.select(svgElement).select("use"));
	transform.r += rotationDelta;
	d3.select(svgElement).select("use").attr("transform", transform.stringa());
}

// ******************************* page interaction listeners and callbacks

/**
 * switches from a deck to another in the view, storing deck configurations before switching
 * @param newDeckId
 */
function changeDeckListener(newDeckId) {

	saveViewToDeck();	// save current deck configuration
	clearView();				//clear the view
	setViewImage(config.decksPath + decks[newDeckId].image);
	populateHotspotsSelector(decks[newDeckId].hotspots);	//load new deck hotspots
	activeDeckId = newDeckId;	// set current deck id
	loadDeckConfigIntoView(activeDeckId);
}

/**
 * handler for the "add aircraft" button
 */
function addAircraftButton() {
	var model = document.getElementById('aircraftSelector').value;
	var qty = document.getElementById('quantity').value;
	var x = document.getElementById('inputX').value;
	var y = document.getElementById('inputY').value;
	var r = document.getElementById('inputR').value;
	var label = document.getElementById('aircraft_id').value;
	addAircraftToView(model, "default", +qty, +x, +y, +r, "default", label);
	saveViewToDeck();
}

/**
 * add a complete US carrier wing to the view
 */
function addUSNCVWButton() {
	addAircraftToView('F18', 'default', 4, 100, 100, 0, 'olive', "10X");
	addAircraftToView('F18', 'default', 4, 100, 150, 0, 'green', "20X");
	addAircraftToView('F18', 'default', 4, 100, 200, 0, 'red', "30X");
	addAircraftToView('C2', 'default', 2, 100, 250, 0, 'purple', "50X");
	addAircraftToView('SH60', 'default', 12, 100, 300, 0, 'teal', "60X");
	addAircraftToView('EA6', 'default', 4, 100, 350, 0, 'brown', "40X");
	addAircraftToView('E2', 'default', 4, 100, 400, 0, 'yellow', "70X");
	addAircraftToView('CRANE', 'default', 1, 500, 100, 0, 'red', "CRANE");
	addAircraftToView('FORKLIFT_LARGE', 'default', 1, 550, 100, 0, 'red', "FORK");
	addAircraftToView('FORKLIFT_SMALL', 'default', 1, 600, 100, 0, 'red', "FORK");
	addAircraftToView('TOWBAR', 'default', 2, 650, 100, 0, 'red', "TOW");
	addAircraftToView('TOWTRACTOR', 'default', 1, 500, 200, 0, 'red', "TOW");
	addAircraftToView('TOWTRACTOR', 'default', 1, 550, 200, 0, 'red', "OXY");
	addAircraftToView('TOWTRACTOR', 'default', 1, 600, 200, 0, 'red', "FIRE");
	addAircraftToView('TOWTRACTOR', 'default', 1, 650, 200, 0, 'red', "CRASH");
	saveViewToDeck();
}

/**
 * adds a test fleet to the view
 */
function addTestFleetButton() {
	addAircraftToView('F18', 'default', 1, 50, 0, 0, 'red', '1');
	addAircraftToView('EH101', 'default', 1, 100, 0, 0, 'orange', '2');
	addAircraftToView('EA6', 'default', 1, 150, 0, 0, 'yellow', '3');
	addAircraftToView('E2', 'default', 1, 200, 0, 0, 'purple', '4');
	addAircraftToView('C2', 'default', 1, 250, 0, 0, 'brown', '5');
	addAircraftToView('SH60', 'default', 1, 300, 0, 0, 'teal', '6');
	addAircraftToView('AV8', 'default', 1, 350, 0, 0, 'green', '7');
	saveViewToDeck();
}

/**
 * adds an italian "Garibaldi" ship air wing
 */
function addITAGaribaldiCVWButton() {
	addAircraftToView('AV8', 'default', 9, 100, 200, 0, 'red', "LUPO 0X");
	addAircraftToView('EH101', 'default', 9, 300, 200, 0, 'green', "SHARK 0X");
	saveViewToDeck();
}

/**
 * adds an italian "Cavour" ship air wing to the view
 */
function addITACavourCVWButton() {
	addAircraftToView('AV8', 'default', 5, 100, 200, 0, 'red', "LUPO 0X");
	addAircraftToView('F35', 'default', 5, 100, 300, 0, 'green', "F35 0X");
	addAircraftToView('EH101', 'default', 12, 100, 400, 0, 'purple', "SHARK 0X");
	saveViewToDeck();
}

/**
 * download a json file in the browser
 * @param json json object to serialize
 * @param fileName file name
 */
function downloadJson(json, fileName) {
	var blob = new Blob([JSON.stringify(json, null, 2)], {type: "application/json"});
	saveAs(blob, fileName);
}

/**
 * download a json file with current deck configuration
 */
function exportCurrentDeckButton() {
	saveViewToDeck();
	downloadJson(exportCurrentDeckConfig(), activeDeckId + ".txt");
}

/**
 * download a json file with all the decks
 */
function exportAllDecksButton() {
	saveViewToDeck();
	downloadJson(exportAllDeckConfigs(), config.defaultExportAllFilename);
}

/**
 * import saved deck configuration from file
 * uses html5 filereader
 * @param file file object from filechooser
 * @param ignoreDeckIDs true if the file contents should be imported into the CURRENT deck, ignoring deck IDs
 */
function importFromFileButton(file, ignoreDeckIDs) {
	var read = new FileReader();
	read.onloadend = function () {
		importConfigsFromJsonButton(JSON.parse(/**@string*/read.result));
	};
	read.readAsBinaryString(file);
}

/**
 * import the selected configuration(s) into the active deck, from a file
 * @param file the selected file
 */
function importToCurrentDeckButton(file) {
	var read = new FileReader();
	read.onloadend = function () {
		addConfigsToCurrentDeck(JSON.parse(/**@string*/read.result));
	};
	read.readAsBinaryString(file);
}

/**
 * Adds without clearing it first the provided configs to the active deck
 * @param configItems array of config items (exported deck configs)
 */
function addConfigsToCurrentDeck(configItems) {
	configItems.forEach(function (configItem) {
		viewAircrafts = viewAircrafts.concat(configItem.config);
	});
	render();
}

/**
 * import an array of deck configuration, in the form of {deckId, config[]}
 * @param configs array of deck configuration objects
 */
function importConfigsFromJsonButton(configs) {
	importDeckConfigs(configs);
	reloadView();
}

/**
 * clear All Decks and the view
 */
function clearAllDecksButton() {
	clearDeckConfigs(Object.keys(decks));
	clearView();
}

/**
 * Move selected aircraft to hotspot
 * @param hotspotIndex
 */
function jumpToHotspotButton(hotspotIndex) {
	var selectedAircraft = d3.select(selectedSVGAircraft).data()[0];
	var hotspot = decks[activeDeckId].hotspots[hotspotIndex];
	moveAircraftToHotspot(selectedAircraft, hotspot);
	//setSVGPosition(selectedSVGAircraft, hotspot.x, hotspot.y);
	//setSVGRotation(selectedSVGAircraft, hotspot.r);
	render();
	saveViewToDeck();
}

/**
 * shows a prompt to let the user choose the color palette header text
 */
function promptColorBoxesHeader(text) {
	var newLabel = prompt("Please enter the new label", text);
	// null=cancel button
	if (typeof newLabel !== "undefined" && newLabel !== null) {
		setColorBoxesHeader(newLabel);
	}
}

/**
 * prompt the label for a specific color box
 * @param HTMLElement color box html element
 * @param oldText the old box label to show in the prompt
 */
function promptColorBoxLabel(HTMLElement, oldText) {
	var newLabel = prompt("Please enter the new label for this color", oldText);
	if (typeof newLabel !== "undefined" && newLabel !== null) {	// null=cancel button
		setColorBoxLabel(HTMLElement, newLabel);
	}
}

/**
 * prompts for a new aircraft label
 */
function promptEditLabelClick(aircraft) {
	var newLabel = prompt("Please enter the new label", aircraft.label);
	// null=cancel button
	if (typeof newLabel !== "undefined" && newLabel !== null) {
		setAircraftLabel(aircraft, newLabel);
		render();
	}
}

/**
 * change color to an aircraft
 * @param {object} aircraft aircraft object in d3.data()
 * @param {number} increment increment or decrement of color index
 */
function cycleActiveAircraftColorClick(aircraft, increment) {
	// get current color
	var currentColor = aircraft.fill;
	//increment and wrap
	var colorIndex = config.colors.indexOf(currentColor);
	colorIndex = ((colorIndex + increment + config.colors.length) % config.colors.length);	//wrap color index
	// set new color
	setAircraftColor(aircraft, config.colors[colorIndex]);
	render();
}

/**
 * cycles between the shapes available for the aircraft
 * @param {object} aircraft aircraft object in d3.data()
 */
function cycleActiveAircraftShapeClick(aircraft) {

	// get current shape
	var currentShape = aircraft.shape;

	// increment and wrap shapes array
	var shapes = aircraft.shapes;
	var shapeIndex = shapes.indexOf(currentShape);
	shapeIndex = ((shapeIndex + 1) % shapes.length);

	//setSVGShape(svgElement, aircraft.model, shapes[shapeIndex]);	//needs model becuse overwrites the svg href
	setAircraftShape(aircraft, shapes[shapeIndex]);
	render();
}

/**
 * drag handler, for move and rotate
 * @param aircraft
 */
function dragHandler(aircraft) {
	var e = d3.event.sourceEvent;
	if (e.buttons === 1) {	// left drag
		$("html").css("cursor", "move");
		moveAircraft(aircraft, d3.event.dx, d3.event.dy);
		moveSVG(this, d3.event.dx, d3.event.dy);	// manipulate svg directly because this is fired too often to update all elements every time
	} else if (e.buttons === 2) {	// right drag
		$("html").css("cursor", "url('res/cursor-rotate.png'), auto");
		rotateAircraft(aircraft, d3.event.dx * config.mouseRotationSensitivity);
		rotateSVG(this, d3.event.dx * config.mouseRotationSensitivity);
	} else {
		console.log('drag button: ' + d3.event.sourceEvent.buttons);
	}
	saveViewToDeck();
}

/** manages alt-click, ctrl-click, shift-click, you get it
 * note that this is called also on drag start
 * @param aircraft aircraft
 */
function leftClickHandler(aircraft) {
	var e = d3.event;
	if (e.ctrlKey === false && e.altKey === true && e.shiftKey === false) {	// alt
		cycleActiveAircraftColorClick(aircraft, +1);
	} else if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false) {	// ctrl
		addAircraftToView(aircraft.model, aircraft.shape, 1, aircraft.x + 20, aircraft.y + 20, aircraft.r, aircraft.fill, aircraft.label);
	} else if (e.ctrlKey === false && e.altKey === false && e.shiftKey === true) {	// shift
		cycleActiveAircraftShapeClick(aircraft);
	} else if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false) {	// simple left click
		selectedSVGAircraft = this;	// simply select this aircraft
	}
	saveViewToDeck();
}

/**
 * right click handler for aircrafts - shift right click is never fired and opens browser context menu
 * @param aircraft selected aircraft
 */
function rightClickHandler(aircraft) {
	var e = d3.event;
	if (e.ctrlKey === false && e.altKey === true && e.shiftKey === false) {	// alt
		cycleActiveAircraftColorClick(aircraft, -1);
	} else if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false) {	// ctrl
		removeAircraftFromView(aircraft);
	} else if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false) {	// simple right click
		selectedSVGAircraft = this;	// simply select this aircraft
	}
	saveViewToDeck();
}

/**
 * manages double click
 * @param aircraft aircraft object
 */
function dblClickHandler(aircraft) {
	var event = d3.event;
	if (event.ctrlKey === false && event.altKey === false && event.shiftKey === false) {
		promptEditLabelClick(aircraft);
	}
	saveViewToDeck();
}