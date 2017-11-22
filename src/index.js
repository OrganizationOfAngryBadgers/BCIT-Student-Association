// Lambda Node.JS
'use strict';
var Alexa = require("alexa-sdk");
var storage = require("./storage");

exports.handler = function (event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.registerHandlers(handlers);
	alexa.execute();

};

const handlers = {
	'LaunchRequest': function () {
		var welcomeMessage = 'Hello! This is a test.';
		this.emit(':ask', welcomeMessage, 'Try again.');
	},

	'SetMyFavoriteColor': function() {
		var color = this.event.request.intent.slots.color.value;
		var response = '';

		storage.save(color, this.event.session, (color) => {
			response = 'Ok ' + color + ' is your favorite color. I got it.';
			this.emit(':ask', response);
		});
	},

	'GetMyFavoriteColor': function() {
		var color = this.event.request.intent.slots.color.value;
		var response = '';

		storage.getColor(this.event.session, (color) => {
			response = color + ' is your favorite color';
			this.emit(':ask', response);
		});
	},

	'Unhandled': function() {
		this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
	},

	'AMAZON.HelpIntent': function () {
		this.emit(':ask', 'Tell me what your favorite color is. For example, my favorite color is periwinkle.', 'try again');
	},

	'AMAZON.StopIntent': function () {
		var say = 'Goodbye.';

		this.emit(':tell', say );
	}

}
