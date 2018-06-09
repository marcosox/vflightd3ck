#DEVELOPING

## Source files organization
- `js`: app code
- `js/lib`: external js libraries
- `css`: style sheet(s)
- `res`: resources (aircraft shapes and deck images)

## API
The code is organized roughly in two different layers.
The aircraft data is managed into a collection named `decks`,
representing available ships decks currently operated.
Operations on the decks are available through the functions in the `api.js` file.
One deck (the active one) is also displayed on the web page, using the view functions.
These functions interface the `decks` collection with the SVG elements on the page,
by keeping reference of a `viewAircrafts` collection, which represents the current deck.

The separation between those two layers makes possible to use this tool as a real time
visualization tool also. An external program (for example an aircraft position data server)
just needs to manipulate the aircrafts data (the `decks` collection) and call `render()` to synchronize the view with the data.

## Aircraft data format
Aircraft models are stored in the `installedAircrafts` file. Each entry looks like this:
```
F18: {
		title: "F18 Hornet",
		heigth: 65,
		width: 39,
		defaultX: 0.20,
		defaultY: 200,
		fontSize: 15,
		shapes: [
			"fold", "spread"]
	}
```
The filename of the object SVG is built from the object key (`F18`),
underscore, and the shapes.
In the above example, the files for the F18 are:
`res/aircrafts/F18_fold.svg`
`res/aircrafts/F18_spread.svg`

## Exported data format
See one of the examples in the [examples](../examples/) folder