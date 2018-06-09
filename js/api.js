/*
 * Created by sox on 02/07/2017.
 */

// ******************************** aircraft API functions

function moveAircraftToHotspot(aircraft, hotspot) {
	setAircraftPosition(aircraft, hotspot.x, hotspot.y);
	setAircraftRotation(aircraft, hotspot.r);
}

function setAircraftShape(aircraft, shape) {
	aircraft.shape = shape;
}

function setAircraftColor(aircraft, color) {
	aircraft.fill = color;
}

/**
 * changes the label of the specified aircraft
 * @param aircraft
 * @param label
 */
function setAircraftLabel(aircraft, label) {
	aircraft.label = label;
}

/**
 *
 * @param aircraft aircraft object in d3.data()
 * @param dx
 * @param dy
 */
function moveAircraft(aircraft, dx, dy) {
	aircraft.x += dx;
	aircraft.y += dy;
}

/**
 * move aircraft to absolute position
 * @param aircraft aircraft object in d3.data()
 * @param x
 * @param y
 */
function setAircraftPosition(aircraft, x, y) {
	aircraft.x = x;
	aircraft.y = y;
}

/**
 * Rotate an aircraft to a relative value
 * @param aircraft aircraft object in d3.data()
 * @param rotationDelta relative rotation in degrees
 */
function rotateAircraft(aircraft, rotationDelta) {
	aircraft.r += rotationDelta;
}

/**
 * rotate an aircraft to an absolute rotation
 * @param aircraft aircraft object in d3.data()
 * @param rotation absolute rotation in degrees
 */
function setAircraftRotation(aircraft, rotation) {
	aircraft.r = rotation;
}


// **************************************************** decks API functions

/**
 * imports decks from serialized form (e.g. from file json)
 * configs are in the form {deckId, config}[]
 * @param configs
 */
function importDeckConfigs(configs) {
	configs.forEach(function (configObj) {
		decks[configObj.deckId].config = configObj.config;
	});
}

function clearDeckConfigs(decksKeys) {
	decksKeys.forEach(function (key) {
		decks[key].config = [];
	});
}

function exportCurrentDeckConfig() {
	return exportDeckConfigs([activeDeckId]);
}

function exportAllDeckConfigs() {
	return exportDeckConfigs(Object.keys(decks));
}

/**
 * exports an array of decks into serializable form (the one used by download)
 * @param decksIDs
 * @returns {Array}
 */
function exportDeckConfigs(decksIDs) {
	var result = [];
	decksIDs.forEach(function (key) {
		result.push({
			deckId: key,
			config: decks[key].config
		});
	});
	return result;
}
