// Lambda Node.JS
'use strict';
var Alexa = require("alexa-sdk");
var storage = require("./storage");
var requester = require('request');
const FB_API_URL = "fb-events-alexa.herokuapp.com";

exports.handler = function (event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.appId = "amzn1.ask.skill.ccdcee39-c120-4b10-bfab-a30a727975ad";
	alexa.APP_ID = "amzn1.ask.skill.ccdcee39-c120-4b10-bfab-a30a727975ad";
	alexa.registerHandlers(handlers);
	alexa.execute();

};


const handlers = {
	'LaunchRequest': function () {
		var welcomeMessage = "B-C-I-T S-A";
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

	/*'GetMyFavoriteColor': function() {
		var color = this.event.request.intent.slots.color.value;
		var response = '';

		storage.getColor(this.event.session, (color) => {
			response = color + ' is your favorite color';
			this.emit(':ask', response);
		});
	},*/


	'GetMyFavoriteColor': function() {
		this.emit(':ask', "Getting Events 1");
		requester(FB_API_URL + '/getEvents', function (error, res, eventsJSON) {
			console.log("API START GET EVENTS")
		    if (!error && res.statusCode == 200) {
		      	storage.saveTest(eventsJSON, (eventsJSON) => {
					response = 'Ok database updated';
					this.emit(':ask', response);
				});
		    } else {
		    	console.log(error);

		    }
		});
		storage.saveTest("eventsJSON", (eventsJSON) => {
			response = 'Ok your saycks usgot it.';
			this.emit(':ask', response);
		});

	},
	'GetEvents': function() {
		this.emit(':ask', "Getting Events");
		requester(FB_API_URL + '/getEvents', function (error, res, eventsJSON) {
		    if (!error && res.statusCode == 200) {
		      	storage.saveEvents(eventsJSON, (eventsJSON) => {
					response = 'Ok database updated.';
					this.emit(':ask', response);
				});
		    }
		});

	},
	'GetEventDescription': function() {

	},
	'GetEventTimes': function() {

	},
	'GetEventLocation': function() {

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
