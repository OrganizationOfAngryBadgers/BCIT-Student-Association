// Lambda Node.JS
'use strict';

var Alexa = require("alexa-sdk");
var requester = require('request-promise');
const FB_API_URL = "fb-events-alexa.herokuapp.com";
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

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

	'GetEvents': function() {
		var sns = new AWS.SNS();

		sns.publish(
			{
	        	Message: 'UpdateDatabase',
	        	TopicArn: 'arn:aws:sns:us-west-2:923010755332:updateDatabase'
    		}, 
    		function(err, data) {
        		if (err) {
            		console.log(err.stack);
            		return;
       			}
		        console.log('push sent');
		        console.log(data);
		        context.done(null, 'Function Finished!');  
		    });
	
		this.emit(':tell', "Updating Database");
		/*
		const getEventsAPI = function getEventsAPI () {
			console.log("API START GET EVENTS");
			return requester('https://fb-events-alexa.herokuapp.com/getEvents', function (error, response, eventsJSON) {
				console.log("API CALLBACK");
			});
		}

		getEventsAPI().then(
			(response) => {
		      	storage.saveEvents(eventsJSON, (eventsJSON) => {
					//this.emit(':tell', "It Worked");
				});
			},
			(error) => {
				//this.emit(':tell', "It failed");
			}

		);
		*/

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


