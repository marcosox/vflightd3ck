# Adding new objects
## Ship decks
1. Create a png image of the deck, top down, scaled to 2.8 px/m.
Place it in the `res/decks` folder
2. Add a deck info object to `installedDecks.js`:
	```
	myShipDeck: {
		image: "filename.png",
		title: "Title shown in the decks selection menu",
		hotspots: [
			{
				title: 'Catapult 1',
				x: 848, // coordinates
				y: 260, // coordinates
				r: 85 // rotation
			}
		]
	},
	```
3. The new deck should be available in the deck selection dropdown

## Aircrafts/objects
1. Create one or more SVG images with the desired aircraft shapes
	- The shape should have no style set for fill and stroke,
	in order to let the app override its color.
	- In order to let the app recognize the aircraft, use a
	 filename pattern like `<aircraftmodel>_<shape variation>.svg` (e.g. `F18_wingsFold.svg`)
	 The [DEVELOP](DEVELOP.md) file contains informations about how the filename is
	 built starting from the aircraft information in the configuration.
2. Add the aircraft info in `installedAircrafts.js`:
	```
	F18: {
			title: "F18 Hornet",	// aircraft title
			heigth: 65,	// in pixels, scaled at 2.8 px/m
			width: 39,	// same
			defaultX: 0.20,	// default initial X position, between 0.0(full left) and 1.0(full right)
			defaultY: 200,	// default initial Y position, in pixels (yes)
			fontSize: 15,	// text label font size
			shapes: [
				"wingsFold", "wingsSpread"]	// registered shape variations (same as filenames)
		},
	```
3. Now the aircraft should be available in the "add object" dialog