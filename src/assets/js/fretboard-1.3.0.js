//FretboardJs - simple JavaScript guitar-fretboard API
//Copyright (C) simon le serve
//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//GNU General Public License for more details.
//You should have received a copy of the GNU General Public License
//along with this program.  If not, see http://www.gnu.org/licenses/.
var Fretboard = {};

Fretboard.NS = "http://www.w3.org/2000/svg";

Fretboard.GetQueryParameterByName = function (name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
Fretboard.Metrics = function () {
	var width = 0;
	var height = 0;

	var highestFret = 13;
	var barPosition = 0;

	function Calibrate(svg) {
		var fretboardApp = svg.parentNode;

		self.Width = Math.round(.95 * fretboardApp.clientWidth);
		self.Height = Math.round(0.2275 * self.Width);

		svg.setAttribute('width', self.Width + "px");
		svg.setAttribute('height', self.Height + "px");

		barPosition = self.Width * 0.0375;
	}

	function FretPosition(n) {
		///<summary cref="http://liutaiomottola.com/formulae/fret.htm">Fret length spacing for n-th fret</summary>
		///<param name="n" type="Number">Fret number</param>
		var length = self.Width * 1.85;
		var position = barPosition + length - (length / Math.pow(2, (n / 12)));
		return position;
	}

	function FingerPosition(n) {
		if (n < 0 || n > highestFret) {
			throw "Argument out of range: N-th Fret must be between 0 and 9 inclusive. n = " + n;
		}
		var p = FretPosition(n - 1);
		var q = FretPosition(n);

		var position = p + (q - p) / 2;

		return position;
	}

	function StringPosition(n) {
		if (n < 1 || n > 7) {
			throw "Argument out of range: N-th String must be between 1 and 6 inclusive. n = " + n;
		}
		var result = 0.086 * self.Height + (n - 1) * 0.165 * self.Height;
		return result;
	}

	function StringGague(n) {
		if (n < 1 || n > 6) {
			throw "Argument out of range: N-th String must be between 1 and 6 inclusive. n = " + n;
		}
		var result = 0.018 * self.Height / 6 * (n - 1) + 1.5;
		return result;
	}

	var self = {
		BarPosition: barPosition,
		Calibrate: Calibrate,
		FingerPosition: FingerPosition,
		FretPosition: FretPosition,
		Height: height,
		HighestFret: highestFret,
		StringGague: StringGague,
		StringPosition: StringPosition,
		Width: width
	};

	return self;
}();
function Finger(fret, string, finger, degree) {
	var Finger = finger || 0;
	var Fret = fret;
	var String = string;
	var Degree = degree || 0;
	var OpenOnly = false;

	var self = {
		Degree: Degree,
		Finger: Finger,
		Fret: Fret,
		String: String,
		OpenOnly: OpenOnly
	};

	return self;
}

function Chord(def) {
	var Name = def.name;
	var Inversion = def.inversion || 1;
	var Fingering = def.fingering;
	var Difficulty = def.difficulty || 0;
	var OpenOnly = def.OpenOnly || false;
	var CanonicalName = def.canonicalName || '';

	function Copy() {
		var copy = JSON.parse(JSON.stringify(this));
		var result = new Chord({ name: copy.Name, fingering: copy.Fingering });
		result.OpenOnly = this.OpenOnly;
		return result;
	}
	function GetLowestFingering() {
		var result = 100;
		this.Fingering.forEach(function (a) {
			if (a.Fret < result) {
				result = a.Fret;
			}
		});
		return result;
	}
	function GetHighestFingering() {
		var result = -1;
		this.Fingering.forEach(function (a) {
			if (a.Fret > result) {
				result = a.Fret;
			}
		});
		return result;
	}
	function IsOpen() {
		var result = false;
		self.Fingering.forEach(function (a) {
			if (a.Fret == 0) {
				result = true;
				return;
			}
		});
		return result;
	}
	function Sharpen5th() {
		var result = self.Copy();
		var altered = false;
		result.Fingering.forEach(function (a) {
			if (a.Degree == 5) {
				a.Fret++;
				altered = true;
			}
		});
		if (altered) { result.Fingering.forEach(function (a) { a.Finger = 0; }); }
		return result;
	}
	function Flaten5th() {
		var result = self.Copy();
		var altered = false;
		result.Fingering.forEach(function (a) {
			if (a.Degree == 5) {
				a.Fret--;
				altered = true;
			}
		});
		if (altered) { result.Fingering.forEach(function (a) { a.Finger = 0; }); }
		return result;
	}
	function Flaten7th() {
		var result = self.Copy();
		result.Fingering.forEach(function (a) {
			if (a.Degree == 7) {
				a.Fret--;
			}
		});
		return result;
	}
	function Sharpen9th() {
		var result = self.Copy();
		var altered = false;
		result.Fingering.forEach(function (a) {
			if (a.Degree == 9) {
				a.Fret++;
				altered = true;
			}
		});
		if (altered) { result.Fingering.forEach(function (a) { a.Finger = 0; }); }
		return result;
	}
	function Flaten9th() {
		var result = self.Copy();
		var altered = false;
		result.Fingering.forEach(function (a) {
			if (a.Degree == 9) {
				a.Fret--;
				altered = true;
			}
		});
		if (altered) { result.Fingering.forEach(function (a) { a.Finger = 0; }); }
		return result;
	}
	function Flaten3rd() {
		var result = self.Copy();
		result.Fingering.forEach(function (a) {
			if (a.Degree == 3) {
				a.Fret--;
			}
		});
		return result;
	}
	function Sharpen3rd() {
		var result = self.Copy();
		result.Fingering.forEach(function (a) {
			if (a.Degree == 3) {
				a.Fret++;
			}
		});
		return result;
	}
	function Span() {
		///<summary>Return the number of frets accross which the chord spans</summary>
		var lowestFret = Fretboard.Metrics.HighestFret;
		var highestFret = 0;
		for (var i = 0; i < self.Fingering.length; i++) {
			var a = self.Fingering[i];
			if (a.Fret < lowestFret) {
				lowestFret = a.Fret;
			}
			if (a.Fret > highestFret) {
				highestFret = a.Fret;
			}
		}
		var span = 1 + highestFret - lowestFret;
		return span;
	}
	function Transpose(n) {
		var result = self.Copy();
		result.Fingering.forEach(function (a) {
			a.Fret += n;
		});
		return result;
	}
	function Validate() {
		var result = true;

		if (self.OpenOnly) {
			result = IsOpen();
		}

		return result;
	}

	var self = {
		CanonicalName: CanonicalName,
		Copy: Copy,
		Fingering: Fingering,
		Flaten9th: Flaten9th,
		Flaten5th: Flaten5th,
		Flaten3rd: Flaten3rd,
		Flaten7th: Flaten7th,
		GetLowestFingering: GetLowestFingering,
		GetHighestFingering: GetHighestFingering,
		Inversion: Inversion,
		IsOpen: IsOpen,
		Name: Name,
		OpenOnly: OpenOnly,
		Sharpen3rd: Sharpen3rd,
		Sharpen9th: Sharpen9th,
		Sharpen5th: Sharpen5th,
		Span: Span,
		Transpose: Transpose,
		Validate: Validate
	};

	return self;
}

Fretboard.Notes = function () {
	function GetDifference(a, b) {
		if (!/^([a-gA-G][b#]{0,1}).*$/.test(a) || !/^([a-gA-G][b#]{0,1}).*$/.test(b)) {
			throw "Argument out of range: notes must be standard enharmonically spelled notes.";
		}
		var result = 3;

		var aGroups = a.match(/^([a-gA-G][b#]{0,1}).*$/);
		var bGroups = b.match(/^([a-gA-G][b#]{0,1}).*$/);

		var a = aGroups[1].replace('#', 's');
		var b = bGroups[1].replace('#', 's');

		var numa = Fretboard.Notes[a];
		var numb = Fretboard.Notes[b];

		result = numb - numa;

		return result;
	}

	var self = {
		GetDistance: GetDifference,

		Ab: 12,
		A: 1,
		As: 2,

		Bb: 2,
		B: 3,
		Bs: 4,

		Cb: 3,
		C: 4,
		Cs: 5,

		Db: 5,
		D: 6,
		Ds: 7,

		Eb: 7,
		E: 8,
		Es: 9,

		Fb: 8,
		F: 9,
		Fs: 10,

		Gb: 10,
		G: 11,
		Gs: 12,
	};

	return self;
}();
/// <reference path="chord.js" />
Fretboard.Chords = {};

// TRIADS
Fretboard.Chords.MajorTriad = function () {
	var self = [
	new Chord({
		name: 'C',
		fingering: [
			new Finger(3, 5, 4, 1),
			new Finger(2, 4, 3, 3),
			new Finger(0, 3, 1, 5),
			new Finger(1, 2, 2, 1),
			new Finger(0, 1, 1, 3),
		],
	}),
	new Chord({
		name: 'A',
		fingering: [
			new Finger(0, 6, 1, 5),
			new Finger(0, 5, 1, 1),
			new Finger(2, 4, 3, 5),
			new Finger(2, 3, 3, 1),
			new Finger(2, 2, 3, 3),
			new Finger(0, 1, 1, 5),
		]
	}),
	new Chord({
		name: 'G',
		fingering: [
			new Finger(3, 6, 3, 1),
			new Finger(2, 5, 2, 3),
			new Finger(0, 4, 1, 5),
			new Finger(0, 3, 1, 1),
			new Finger(0, 2, 1, 3),
			new Finger(3, 1, 4, 1),
		]
	}),
	new Chord({
		name: 'E',
		fingering: [
			new Finger(0, 6, 1, 1),
			new Finger(2, 5, 3, 5),
			new Finger(2, 4, 4, 1),
			new Finger(1, 3, 2, 3),
			new Finger(0, 2, 1, 5),
			new Finger(0, 1, 1, 1),
		],
	}),
	new Chord({
		name: 'D',
		fingering: [
			new Finger(0, 4, 1, 1),
			new Finger(2, 3, 2, 5),
			new Finger(3, 2, 4, 1),
			new Finger(2, 1, 3, 3),
		],
		OpenOnly: true
	})
	];

	return self;
}();

Fretboard.Chords.MinorTriad = function () {
	//var self = [];
	//for (var i = 0; i < Fretboard.Chords.MajorTriad.length; i++) {
	//	var chord = Fretboard.Chords.MajorTriad[i].Flaten3rd();

	//	if (chord.Span() > 4)
	//	{
	//		continue;
	//	}

	//	self.push(chord);
	//}
	//return self;
	var self = [
	new Chord({
		name: 'Em',
		fingering: [
			new Finger(0, 6, 1),
			new Finger(2, 5, 3),
			new Finger(2, 4, 4),
			new Finger(0, 3, 1),
			new Finger(0, 2, 1),
			new Finger(0, 1, 1),
		]
	}),
	new Chord({
		name: 'Am',
		fingering: [
			new Finger(0, 6, 1),
			new Finger(0, 5, 1),
			new Finger(2, 4, 3),
			new Finger(2, 3, 4),
			new Finger(1, 2, 2),
			new Finger(0, 1, 1),
		]
	}),
	new Chord({
		name: 'Dm',
		fingering: [
			new Finger(0, 4, 1),
			new Finger(2, 3, 2),
			new Finger(3, 2, 3),
			new Finger(1, 1, 4),
		],
		OpenOnly: true
	})
	];

	self.CanonicalName = 'm';

	return self;
}();

Fretboard.Chords.DiminishedTriad = function () {
	var self = [
	new Chord({
		name: 'Eb',
		fingering: [
			new Finger(1, 5, 1),
			new Finger(2, 4, 2),
			new Finger(3, 3, 4),
			new Finger(2, 2, 3),
		]
	}),
	];
	self.CanonicalName = 'dim';
	return self;
}();

Fretboard.Chords.AugmentedTriad = function () {
	return [
	new Chord({
		name: 'D',
		fingering: [
			new Finger(5, 5, 3),
			new Finger(4, 4, 2),
			new Finger(3, 3, 1),
		]
	}),
	];
}();

Fretboard.Chords.Suspended4thTriads = function () {
	var self = [
	new Chord({
		name: 'Asus4',
		fingering: [
			new Finger(0, 6, 1, 5),
			new Finger(0, 5, 1, 1),
			new Finger(2, 4, 2, 5),
			new Finger(2, 3, 3, 1),
			new Finger(3, 2, 4, 4),
			new Finger(0, 1, 1, 5),
		]
	}),
	new Chord({
		name: 'Dsus4',
		fingering: [
			new Finger(0, 4, 1, 1),
			new Finger(2, 3, 2, 5),
			new Finger(3, 2, 3, 1),
			new Finger(3, 1, 4, 4),
		]
	}),
	new Chord({
		name: 'Esus4',
		fingering: [
			new Finger(0, 6, 1, 1),
			new Finger(2, 5, 2, 5),
			new Finger(2, 4, 3, 1),
			new Finger(2, 3, 4, 4),
			new Finger(0, 2, 1, 5),
			new Finger(0, 1, 1, 1),
		]
	})
	];
	return self
}();

Fretboard.Chords.Triad6th = function () {
	var self = [
	new Chord({
		name: 'E6',
		fingering: [
			new Finger(7, 5, 4, 1),
			new Finger(6, 4, 3, 3),
			new Finger(6, 3, 2, 6),
			new Finger(5, 2, 1, 1),
		]
	}),
	new Chord({
		name: 'A6',
		fingering: [
			new Finger(0, 6, 1, 5),
			new Finger(0, 5, 1, 1),
			new Finger(2, 4, 3, 5),
			new Finger(2, 3, 3, 1),
			new Finger(2, 2, 3, 3),
			new Finger(2, 1, 1, 6),
		]
	})

	];
	return self
}();

// 7th CHORDS
Fretboard.Chords.Major7th = function () {
	return [
	new Chord({
		name: 'AM7',
		fingering: [
			new Finger(5, 6, 1),
			new Finger(5, 2, 2),
			new Finger(6, 3, 3),
			new Finger(6, 4, 4),
		]
	}),
	new Chord({
		name: 'CM7',
		fingering: [
			new Finger(3, 5, 1),
			new Finger(5, 4, 3),
			new Finger(4, 3, 2),
			new Finger(5, 2, 4),
		]
	}),
	new Chord({
		name: 'EM7',
		fingering: [
			new Finger(2, 4, 1),
			new Finger(4, 3, 3),
			new Finger(4, 2, 3),
			new Finger(4, 1, 3),
		]
	}),
	new Chord({
		name: 'EM7',
		fingering: [
			new Finger(7, 5, 4, 1),
			new Finger(6, 4, 3, 3),
			new Finger(4, 3, 1, 5),
			new Finger(4, 2, 3, 7),
		]
	})
	];
}();

Fretboard.Chords.Minor7th = function () {
	return [
	new Chord({
		name: 'Am7',
		fingering: [
			new Finger(5, 6, 1, 1),
			new Finger(7, 5, 3, 5),
			new Finger(5, 4, 1, 7),
			new Finger(5, 3, 1, 3),
			new Finger(5, 2, 1, 5),
			new Finger(5, 1, 1, 1),
		]
	}),
	new Chord({
		name: 'Cm7',
		fingering: [
			new Finger(3, 5, 1, 1),
			new Finger(5, 4, 4, 5),
			new Finger(3, 3, 2, 7),
			new Finger(4, 2, 3, 3),
		]
	}),
	new Chord({
		name: 'Cm7',
		fingering: [
			new Finger(3, 5, 1, 1),
			new Finger(3, 3, 2, 7),
			new Finger(4, 2, 4, 3),
			new Finger(3, 1, 3, 5),
		]
	}),
	new Chord({
		name: 'Em7',
		fingering: [
			new Finger(2, 4, 1, 1),
			new Finger(4, 3, 4, 5),
			new Finger(3, 2, 3, 7),
			new Finger(3, 1, 2, 3),
		]
	})
	];
}();

Fretboard.Chords.Dominant7th = function () {
	return [
	new Chord({
		name: 'A7',
		fingering: [
			new Finger(5, 6, 1, 1),
			new Finger(5, 4, 2, 7),
			new Finger(6, 3, 4, 3),
			new Finger(5, 2, 3, 5),
		]
	}),
	new Chord({
		name: 'C7',
		fingering: [
			new Finger(3, 5, 3, 1),
			new Finger(2, 4, 2, 3),
			new Finger(3, 3, 4, 7),
			new Finger(1, 2, 1, 1),
		]
	}),
	new Chord({
		name: 'C7',
		fingering: [
			new Finger(3, 5, 1, 1),
			new Finger(5, 4, 3, 5),
			new Finger(3, 3, 1, 7),
			new Finger(5, 2, 4, 3),
		],
		difficulty: 1
	}),
	new Chord({
		name: 'F7',
		fingering: [
			new Finger(3, 4, 1, 1),
			new Finger(5, 3, 2, 5),
			new Finger(4, 2, 4, 7),
			new Finger(5, 1, 3, 3),
		]
	})
	];
}();

Fretboard.Chords.Diminished7th = function () {
	return [
	new Chord({
		name: 'Adim7',
		fingering: [
			new Finger(5, 6, 3),
			new Finger(4, 4, 1),
			new Finger(5, 3, 2),
			new Finger(4, 2, 4),
		]
	}),
	new Chord({
		name: 'Adim7',
		fingering: [
			new Finger(7, 4, 1),
			new Finger(8, 3, 3),
			new Finger(7, 2, 2),
			new Finger(8, 1, 4),
		]
	}),
	new Chord({
		name: 'Cdim7',
		fingering: [
			new Finger(3, 5, 2),
			new Finger(4, 4, 3),
			new Finger(2, 3, 1),
			new Finger(4, 2, 4),
		]
	})
	];
}();

Fretboard.Chords.Minor7b5 = function () {
	return [
	new Chord({
		name: 'AØ',
		fingering: [
			new Finger(5, 6, 2),
			new Finger(5, 4, 3),
			new Finger(5, 3, 4),
			new Finger(4, 2, 1),
		]
	}),
	new Chord({
		name: 'EØ',
		fingering: [
			new Finger(2, 4, 1),
			new Finger(3, 3, 2),
			new Finger(3, 2, 2),
			new Finger(3, 1, 2),
		]
	}),
	new Chord({
		name: 'CØ',
		fingering: [
			new Finger(3, 5, 1),
			new Finger(4, 4, 3),
			new Finger(3, 3, 2),
			new Finger(4, 2, 4),
		]
	})
	];
}();

Fretboard.Chords.MinorMajor7 = function () {
	return [
	new Chord({
		name: 'AmM7',
		fingering: [
			new Finger(5, 6, 1),
			new Finger(6, 4, 2),
			new Finger(5, 3, 3),
			new Finger(5, 2, 4),
		]
	}),
	new Chord({
		name: 'CmM7',
		fingering: [
			new Finger(3, 5, 1),
			new Finger(5, 4, 4),
			new Finger(4, 3, 3),
			new Finger(4, 2, 2),
		]
	}),
	new Chord({
		name: 'EmM7',
		fingering: [
			new Finger(2, 4, 1),
			new Finger(4, 3, 4),
			new Finger(4, 2, 3),
			new Finger(3, 1, 2),
		]
	})
	];
}();

// 9th CHORDS
Fretboard.Chords.Dominant9th = function () {
	return [
	new Chord({
		name: 'A9',
		fingering: [
			new Finger(5, 6, 1, 1),
			new Finger(5, 4, 1, 7),
			new Finger(6, 3, 2, 3),
			new Finger(7, 1, 4, 9),
		]
	}),
	new Chord({
		name: 'E9',
		fingering: [
			new Finger(7, 5, 2, 1),
			new Finger(6, 4, 1, 3),
			new Finger(7, 3, 3, 7),
			new Finger(7, 2, 3, 9),
			new Finger(7, 1, 3, 5),
		]
	})
	];
}();

// 13th CHORDS
Fretboard.Chords.Dominant13th = function () {
	return [
	new Chord({
		name: 'A13',
		fingering: [
			new Finger(5, 6, 1, 1),
			new Finger(5, 4, 2, 7),
			new Finger(6, 3, 3, 3),
			new Finger(7, 2, 4, 13),
			new Finger(7, 1, 4, 9),
		]
	}),
	new Chord({
		name: 'E13',
		fingering: [
			new Finger(7, 5, 2, 1),
			new Finger(6, 4, 1, 3),
			new Finger(7, 3, 3, 7),
			new Finger(7, 2, 3, 9),
			new Finger(9, 1, 4, 13),
		]
	})
	];
}();

Fretboard.Chords.Minor6th = function () {
	var self = [];

	self.push(Fretboard.Chords.Minor7th[1].Flaten7th());
	self.push(Fretboard.Chords.Minor7th[2].Flaten7th());
	self.push(Fretboard.Chords.Minor7th[3].Flaten7th());

	return self;
}();
function Scale(def) {
	var Name = def.name;
	var Fingering = def.Fingering;

	var self = {
		Fingering: Fingering,
	};

	return self;
}

Fretboard.Scales = {};

Fretboard.Scales.Major = function () {
	var self = [
		new Scale({
			Name: 'A Major',
			Fingering: [
				new Finger(4, 6, 1, 7),
				new Finger(5, 6, 2, 1),
				new Finger(7, 6, 4, 2),

				new Finger(4, 5, 1, 3),
				new Finger(5, 5, 2, 4),
				new Finger(7, 5, 4, 5),

				new Finger(4, 4, 1, 6),
				new Finger(6, 4, 3, 7),
				new Finger(7, 4, 4, 1),

				new Finger(4, 3, 1, 2),
				new Finger(6, 3, 3, 3),
				new Finger(7, 3, 4, 4),

				new Finger(5, 2, 2, 5),
				new Finger(7, 2, 4, 6),

				new Finger(4, 1, 1, 7),
				new Finger(5, 1, 2, 1),
				new Finger(7, 1, 4, 2),
			],
		})
	];

	return self;
}();
/// <reference path="_namespace.js" />
/// <reference path="metrics.js" />
/// <reference path="chord.js" />
/// <reference path="scale.js" />
Fretboard.Neck = function () {
	var app = {};
	var fretboardLayer = {};
	var fingeringLayer = {};

	var width = 0;
	var height = 0;

	var fingeringText = [];

	var audio = document.getElementById('audio');
	var volume = document.getElementById('volume-range');

	function AddDot(finger, ghost) {
		///<summary>Place a circle representing a fingered position on the fretboardLayer.</summary>
		///<param name="finger" type="Finger"></param>
		var dot = document.createElementNS(Fretboard.NS, "circle");
		dot.Finger = finger;
		dot.setAttributeNS(null, "cx", Fretboard.Metrics.FingerPosition(finger.Fret));
		dot.setAttributeNS(null, "cy", Fretboard.Metrics.StringPosition(finger.String));
		dot.setAttributeNS(null, "r", .017 * width);

		if (ghost) {
			dot.setAttributeNS(null, "fill", "white");
			dot.setAttributeNS(null, "opacity", ".1");
		}
		else {
			dot.setAttributeNS(null, "fill", "url(#fingering-dot-gradient)");
		}

		if (finger.Fret == 0) {
			dot.setAttributeNS(null, "cx", .011 * width + width * 0.004);
			dot.setAttributeNS(null, "r", .008 * width);
			dot.setAttributeNS(null, "fill", "transparent");
			dot.style.stroke = '#0090ff';
			dot.style.strokeWidth = width * 0.004;
		}

		fingeringLayer.appendChild(dot);

		if (!ghost && !!finger.Fret && !!finger.Finger) {
			var text = document.createElementNS(Fretboard.NS, "text");
			text.setAttribute('x', Fretboard.Metrics.FingerPosition(finger.Fret) - width * 0.006);
			text.setAttribute('y', Fretboard.Metrics.StringPosition(finger.String) + width * 0.007);
			text.textContent = finger.Finger;
			text.setAttributeNS(null, "fill", "white");
			text.style.fontSize = width * .0225 + 'px';
			text.style.fontWeight = 'lighter';
			fingeringLayer.appendChild(text);
			fingeringText.push(text);
		}

		dot.addEventListener('click', OnClickDot);

		return dot;
	}
	function AddChord(chord, ghost) {
		///<summary>Draw the fingered chored. If chost is true then fingered positions will be partially transparent.</summary>
		///<param name="finger" type="Chord"></param>	
		chord.Fingering.forEach(function (a) {
			AddDot(a, ghost);
		});
	}
	function AddFrets() {
		for (var i = 1; i <= Fretboard.Metrics.HighestFret; i++) {
			var position = Fretboard.Metrics.FretPosition(i);
			DrawFret(position, 2, position, height - 2);
		}
	}
	function AddNeckDetail(n) {
		var secondFret = Fretboard.Metrics.FretPosition(n - 1);
		var thirdfret = Fretboard.Metrics.FretPosition(n);
		var top = Fretboard.Metrics.StringPosition(2);
		var bottom = Fretboard.Metrics.StringPosition(5);

		var marginleft = width * 0.0125;
		var paddingtop = height * 0.131578947;
		if (n == 7 || n == 12) {
			r1 = {
				x: secondFret + marginleft,
				y: top - paddingtop,
				w: thirdfret - secondFret - marginleft * 2,
				h: (bottom - top + paddingtop * 2) / 2 - 10
			}

			r2 = {
				x: secondFret + marginleft,
				y: top - paddingtop + r1.h + 20,
				w: thirdfret - secondFret - marginleft * 2,
				h: (bottom - top + paddingtop * 2) / 2 - 10
			}

			DrawInlay(r1);
			DrawInlay(r2);
		}
		else {
			var r =
			{
				x: secondFret + marginleft,
				y: top - paddingtop,
				w: thirdfret - secondFret - marginleft * 2,
				h: bottom - top + paddingtop * 2
			};

			DrawInlay(r);
		}
	}
	function AddScale(scale) {
		///<summary>Add the notes for a scale</summary>
		///<param name="note" type="Scale">The scale to be played</param>
		scale.Fingering.forEach(function (a) {
			AddDot(a);
		});
	}
	function AddStrings() {
		for (var i = 1; i < 7; i++) {
			var position = Fretboard.Metrics.StringPosition(i);
			DrawString(Fretboard.Metrics.BarPosition, position, width, position, Fretboard.Metrics.StringGague(i));
		}
	}
	function DrawFretboard(svg) {
		app = svg.parentNode;
		fretboardLayer = svg.getElementById('fretboard-layer');
		fingeringLayer = svg.getElementById('fingering-layer');

		Fretboard.Metrics.Calibrate(svg);

		width = svg.width.baseVal.value;
		height = svg.height.baseVal.value;

		Fretboard.Metrics.BarPosition = .04 * width;
		Fretboard.Metrics.BarWidth = .015 * width;

		DrawNeck();

		AddNeckDetail(3);
		AddNeckDetail(5);
		AddNeckDetail(7);
		AddNeckDetail(9);
		AddNeckDetail(12);

		AddFrets();
		AddStrings();
		DrawNut();
	}
	function DrawFret(x1, y1, x2, y2) {
		var shape = document.createElementNS(Fretboard.NS, "line");
		shape.x1.baseVal.value = x1;
		shape.x2.baseVal.value = x2;
		shape.y1.baseVal.value = y1;
		shape.y2.baseVal.value = y2;
		shape.style.stroke = 'white';
		shape.style.strokeWidth = width * 0.0035;
		fretboardLayer.appendChild(shape);
		return shape;
	}
	function DrawInlay(r) {
		var shape = document.createElementNS(Fretboard.NS, "rect");
		shape.x.baseVal.value = r.x;
		shape.y.baseVal.value = r.y;
		shape.width.baseVal.value = r.w;
		shape.height.baseVal.value = r.h;
		shape.setAttribute("height", r.h);
		shape.style.fill = 'url(#pearl-inlay)';
		shape.style.stroke = 'black';
		shape.style.strokeWidth = .5;
		fretboardLayer.appendChild(shape);
		return shape;
	}
	function DrawNeck() {
		var shape = document.createElementNS(Fretboard.NS, "rect");
		shape.x.baseVal.value = Fretboard.Metrics.BarPosition;
		shape.y.baseVal.value = 3;
		shape.width.baseVal.value = width;
		shape.height.baseVal.value = height - 6;
		shape.setAttribute("height", height - 6);
		shape.style.stroke = 'black';
		shape.style.strokeWidth = 2;
		shape.style.fill = 'url(#fretboard-gradient)';
		fretboardLayer.appendChild(shape);
		return shape;
	}
	function DrawNut() {
		var shape = document.createElementNS(Fretboard.NS, "rect");
		shape.x.baseVal.value = 1;
		shape.y.baseVal.value = 1;
		shape.width.baseVal.value = Fretboard.Metrics.BarPosition;
		shape.height.baseVal.value = height - 2;
		shape.style.fill = 'url(#head-gradient)';
		shape.style.stroke = 'black';
		shape.style.strokeWidth = 1;
		fretboardLayer.appendChild(shape);
		return shape;
	}
	function DrawString(x1, y1, x2, y2, guage) {
		var shape = document.createElementNS(Fretboard.NS, "line");
		shape.x1.baseVal.value = x1;
		shape.x2.baseVal.value = x2;
		shape.y1.baseVal.value = y1;
		shape.y2.baseVal.value = y2;
		shape.style.stroke = '#cbcbcb';
		shape.style.strokeWidth = guage;
		fretboardLayer.appendChild(shape);
		return shape;
	}
	function EraseFingerings() {
		fingeringLayer.textContent = '';
	}
	function EraseFretboard() {
		fretboardLayer.textContent = '';
		fingeringText = [];
	}
	function GetAudioFile(note) {
		///<summary>Get the audio filename associated with the given note.</summary>
		///<param name="note" type="Finger">The tone to be played</param>
		var result = '';
		var root = '/audio/';

		switch (note.String) {
			case 1:
				result = 'E-';
				break;
			case 2:
				result = 'B-';
				break;
			case 3:
				result = 'G-';
				break;
			case 4:
				result = 'D-';
				break;
			case 5:
				result = 'A-';
				break;
			case 6:
				result = 'E-';
				break;
			default:
				throw 'Invalid string number: ' + note.String;
		}

		result += note.String + '-' + note.Fret + '.mp3';

		return root + result;
	}
	function OnClickDot(e) {
		var dot = e.srcElement;
		if (!dot.Finger) {
			return;
		}

		audio.volume = volume.value / 100;
		audio.src = GetAudioFile(dot.Finger);
		audio.play();
	}
	function ShowFingering(visibility) {
		fingeringText.forEach(function (a) { a.style.visibility = visibility; });
	}

	var self = {
		AddDot: AddDot,
		AddChord: AddChord,
		AddScale: AddScale,
		EraseFretboard: EraseFretboard,
		Draw: DrawFretboard,
		EraseFingerings: EraseFingerings,
		GetAudioFile: GetAudioFile,
		ShowFingering: ShowFingering
	};

	return self;
}();