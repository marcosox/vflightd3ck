/*
 * Created by sox on 29/06/2017.
 */
var installedDecks = {
	nimitzDeck: {
		image: "nimitz_deck.png",
		title: "CVN68 USS Nimitz - Flight Deck",
		hotspots: [
			{
				title: 'CAT 1',
				x: 848,
				y: 260,
				r: 85
			}, {
				title: 'CAT 2',
				x: 827,
				y: 184,
				r: 89
			}, {
				title: 'CAT 3',
				x: 470,
				y: 124,
				r: 86
			}, {
				title: 'CAT 4',
				x: 414,
				y: 77,
				r: 90
			}]
	},
	nimitzDeckSimple: {
		image: "nimitz_deck_simple.png",
		title: "CVN68 USS Nimitz - Flight Deck (no details)",
		hotspots: [
			{
				title: 'CAT 1',
				x: 848,
				y: 260,
				r: 85
			}, {
				title: 'CAT 2',
				x: 827,
				y: 184,
				r: 89
			}, {
				title: 'CAT 3',
				x: 470,
				y: 124,
				r: 86
			}, {
				title: 'CAT 4',
				x: 414,
				y: 77,
				r: 90
			}]
	},
	nimitzHangar: {
		image: "nimitz_hangar.png",
		title: "CVN68 USS Nimitz - Hangar Bay",
		hotspots: []
	},
	nimitzDual: {
		image: "nimitz_dual.png",
		title: "CVN68 USS Nimitz - Dual Deck view",
		hotspots: [
			{
				title: 'CAT 1',
				x: 838,
				y: 217,
				r: 85
			}, {
				title: 'CAT 2',
				x: 830,
				y: 142,
				r: 89
			}, {
				title: 'CAT 3',
				x: 469,
				y: 80,
				r: 86
			}, {
				title: 'CAT 4',
				x: 401,
				y: 33,
				r: 90
			}]
	},
	nimitzDualSimple: {
		image: "nimitz_dual_simple.png",
		title: "CVN68 USS Nimitz - Dual Deck view (no details)",
		hotspots: [
			{
				title: 'CAT 1',
				x: 845,
				y: 200,
				r: 85
			}, {
				title: 'CAT 2',
				x: 828,
				y: 124,
				r: 89
			}, {
				title: 'CAT 3',
				x: 471,
				y: 63,
				r: 86
			}, {
				title: 'CAT 4',
				x: 403,
				y: 17,
				r: 90
			}]
	},
	garibaldi: {
		image: "garibaldi.png",
		title: "C551 Garibaldi - Flight Deck",
		hotspots: [
			{
				title: "Elevator 1",
				x: 498,
				y: 221,
				r: 90
			},
			{
				title: "Elevator 2",
				x: 814,
				y: 223,
				r: 270
			}, {
				title: "Takeoff position 1",
				x: 496,
				y: 168,
				r: 92
			}, {
				title: "Takeoff position 2",
				x: 395,
				y: 166,
				r: 92
			}
		]
	},
	cavourDeck: {
		image: "Cavour_deck.png",
		title: "C550 Cavour - Flight Deck",
		hotspots: [
			{
				title: "Elevator 1",
				x: 420,
				y: 287,
				r: 0
			}, {
				title: "Elevator 2",
				x: 775,
				y: 218,
				r: 270
			}, {
				title: "Takeoff position 1",
				x: 536,
				y: 154,
				r: 90
			}, {
				title: "Takeoff position 2",
				x: 419,
				y: 156,
				r: 90
			}]
	},
	cavourHangar: {
		image: "Cavour_hangar.png",
		title: "C550 Cavour - Hangar Bay",
		hotspots: [{
			title: "Elevator 2",
			x: 775,
			y: 218,
			r: 270
		}]
	},
	cavourDual: {
		image: "Cavour_dual.png",
		title: "C550 Cavour - Dual deck view",
		hotspots: [
			{
				title: "Elevator 1 (flight deck)",
				x: 411,
				y: 177,
				r: 0
			}, {
				title: "Elevator 2 (flight deck)",
				x: 769,
				y: 112,
				r: 270
			}, {
				title: "Takeoff position 1",
				x: 536,
				y: 46,
				r: 90
			}, {
				title: "Takeoff position 2",
				x: 419,
				y: 48,
				r: 90
			}, {
				title: "Elevator 2 (hangar deck)",
				x: 759,
				y: 314,
				r: 270
			}, {
				title: "Elevator 1 (hangar deck)",
				x: 406,
				y: 381,
				r: 0
			}]
	},
	USSWasp: {
		image: "USS_Wasp.png",
		title: "LHD USS Wasp - Flight Deck",
		hotspots: [
			{
				title: "Elevator 1",
				x: 225,
				y: 296,
				r: 0
			}, {
				title: "Elevator 2",
				x: 417,
				y: 103,
				r: 180
			}]
	},
	queenElizabeth: {
		image: "Queen_elizabeth.png",
		title: "HMS Queen Elizabeth - Flight Deck",
		hotspots: []
	},
	clemenceauDeck: {
		image: "Clemenceau_deck.png",
		title: "RS98 Clemenceau - Flight Deck",
		hotspots: [
			{
				title: 'CAT 1',
				x: 904,
				y: 148,
				r: 88
			}, {
				title: 'CAT 2',
				x: 561,
				y: 116,
				r: 80
			}]
	},
	cdgDeck: {
		image: "CharlesDeGaulle_deck.png",
		title: "R91 Charles de Gaulle - Flight Deck",
		hotspots: [
			{
				title: 'CAT 1',
				x: 792,
				y: 171,
				r: 90
			}, {
				title: 'CAT 2',
				x: 544,
				y: 124,
				r: 86
			}]
	},
	cdgHangar: {
		image: "CharlesDeGaulle_hangar.png",
		title: "R91 Charles de Gaulle - Hangar Bay",
		hotspots: []
	},
	cdgDual: {
		image: "CharlesDeGaulle_dual.png",
		title: "R91 Charles de Gaulle - Dual Deck view",
		hotspots: [
			{
				title: 'CAT 1',
				x: 792,
				y: 141,
				r: 90
			}, {
				title: 'CAT 2',
				x: 545,
				y: 94,
				r: 86
			}
		]
	},
	caseI: {
		image: "day-pattern.png",
		title: "CASE I pattern",
		hotspots: [
			{
				title: 'Commencing',
				x: 1163,
				y: 379,
				r: 90
			}, {
				title: 'Initial',
				x: 1031,
				y: 58,
				r: 270
			}, {
				title: 'Break',
				x: 438,
				y: 58,
				r: 270
			}, {
				title: 'Abeam',
				x: 738,
				y: 236,
				r: 90
			}, {
				title: 'Ball',
				x: 814,
				y: 100,
				r: 261
			}]
	},
	caseIII: {
		image: "CASE_III.png",
		title: "CASE III pattern",
		hotspots: [
			{
				title: 'Marshall',
				x: 1268,
				y: 97,
				r: 270
			}, {
				title: 'Platform',
				x: 1004,
				y: 214,
				r: 245
			}, {
				title: 'Dirty up',
				x: 794,
				y: 277,
				r: 270
			}, {
				title: 'Ball',
				x: 415,
				y: 347,
				r: 235
			}, {
				title: 'Tank high',
				x: 393,
				y: 42,
				r: 270
			}, {
				title: 'Tank low',
				x: 267,
				y: 142,
				r: 270
			}]
	},
	ccz: {
		image: "Radar_Screen.png",
		title: "CCZ Radar map",
		hotspots: []
	}
};