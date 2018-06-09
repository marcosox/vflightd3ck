# Usage
Click on the "Add objects" button to show the aircrafts menu,
then select "US Carrier Wing" in the "quick add fleet" section.
Now a complete US Carrier wing has just been loaded in the current deck tab. 

#### Move and rotate aircrafts
- Move an object: **Left-drag**
- Rotate an object: **Right-drag**
- Change shape variation (wings fold/spread): **Alt-click**
- Change color: **Shift-click** (left click: forward, right click: backward)
- Duplicate an object: **Ctrl-click** with _left_ button
- Delete an object: **Ctrl-click** with _right_ button

#### Other actions
- Rename an aircraft: **Double click**
- Edit a palette color: **Double click** on the color box
- Quickly position an aircraft on catapult/elevator/other hot spot:
    1. Click on aircraft
    2. select the desired spot in the "Jump to hotspot" dropdown
    3. Click the "GO" button

#### Add a specific aircraft
- Click on the "Add objects" button to show the aircrafts menu
- Select aircraft model and quantity
- Optionally, select a callsign.
	- If the callsign ends with an uppercase `X` character preceded by
	a digit or an underscore,
	it will be substituted with a sequential number starting from 0.
	This is useful to quickly assign names to an entire flight squadron.
	For example, for 10 aircraft named `ECHO 20X`, the resulting aircraft
	will have callsigns `ECHO 200` through `ECHO 209`.
- Optionally, select initial x, y, and rotation in the corresponding input boxes
- Click on the "Add object" button.

#### Saving and importing deck configurations
After positioning all the aircrafts, you can save the current deck configuration
or even the complete configuration of all decks.
Clicking on `EXPORT ACTIVE DECK` or `EXPORT ALL DECKS`
will store for the corresponding decks, the deck ID and the deck configuration

When importing, you can choose to import every configuration of the file in its corresponding deck,
or you can ignore the deck IDs and choose to import all the files into the currently active deck.
This will let you add or merge existing configurations to the active deck,
and move configurations from one deck to another.
