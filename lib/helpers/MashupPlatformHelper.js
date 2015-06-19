var MyStrategy = function MyStrategy () {};
MyStrategy.prototype.getImplementation = function getImplementation (method, obj) {
	"use strict";

	return function (arg) {
		if (obj) {
			return obj[arg];
		}

		return obj;
	};
};

// Mock first WebSocket call at main
var mockServer = new MockServer('ws://url');
MashupPlatform.setStrategy(new MyStrategy(), {"MashupPlatform.prefs.get": {"server-url": "ws://url"}});