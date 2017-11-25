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
		requester('https://fb-events-alexa.herokuapp.com/getEvents', function (error, res, eventsJSON) {
			console.log(JSON.stringify(eventsJSON));
		    if (!error) {
		      	storage.saveEvents(JSON.stringify(eventsJSON), (eventsJSON) => {
					console.log('Database updated');
				});
		    } else {
		    	console.log(error);

		    }
		});

		
	},

	'SetMyFavoriteColor': function() {
		var color = this.event.request.intent.slots.color.value;
		var response = '';

		storage.save(color, this.event.session, (color) => {
			response = 'Ok ' + color + ' is your favorite color. I got it.';
			this.emit(':ask', response);
		});
	},

	'GetEvents': function() {
		console.log("API START GET EVENTS");
		this.emit(':ask', "Updating Database");
		requester('https://fb-events-alexa.herokuapp.com/getEvents', function (error, res, eventsJSON) {
			console.log(JSON.stringify(eventsJSON));
		    if (!error) {
		      	storage.saveEvents(JSON.stringify(eventsJSON), (eventsJSON) => {
					console.log('Database updated');
				});
		    } else {
		    	console.log(error);

		    }
		});
		
	},
	
	/*'GetEvent': function () {
		var name = this.event.request.intent.slots.name.value;
		var response = '';

		storage.getEvent(name, (name) => {
			response = name + ' is the event name';
			this.emit(':ask', response);
		});
	},*/

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
