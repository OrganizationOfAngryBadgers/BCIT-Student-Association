// Lambda Node.JS
'use strict';

var Alexa = require("alexa-sdk");
var requester = require('request-promise');
const FB_API_URL = "fb-events-alexa.herokuapp.com";
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var moment = require('moment');

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
		var this_ptr = this;
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
		        this_ptr.emit(':tell', "Updating Database");
		        //context.done(null, 'Function Finished!');  
		    });
	
		
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


	'GetEventsToday': function() {
		var this_ptr = this;
		var from = moment().startOf('day');
		var to = moment().endOf('day');
		console.log(from.format());
		console.log(to.format());

		getEventsBetweenTime(from, to, function (err, data) {
			if (err) {
				console.log(err);
				this_ptr.emit(':tell', "Error Getting Events");
			} else {
				console.log(data);
				this_ptr.emit(':tell', "Success");
			}
		});
	},
	
	'GetEventsThisWeek': function() {
		var this_ptr = this;
		var from = moment().startOf('day');
		var to = from.add(7, 'days'); 
		console.log(from.format());
		console.log(to.format());

		getEventsBetweenTime(from, to, function (err, data) {
			if (err) {
				console.log(err);
				this_ptr.emit(':tell', "Error Getting Events");
			} else {
				console.log(data);
				this_ptr.emit(':tell', "Success");
			}
		});
	},

	'GetEventsNextWeek': function() {
		var this_ptr = this;
		var from = moment().endOf('week');
		var to = from.add(7, 'days'); 
		console.log("From: " + from.unix());
		console.log("To: " + to.unix());

		getEventsBetweenTime(from, to, function (err, data) {
			if (err) {
				console.log(err);
				this_ptr.emit(':tell', "Error Getting Events");
			} else {
				console.log(data);
				this_ptr.emit(':tell', "Success");
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

function getEventsBetweenTime(from, to, callback) {
	var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName:"BCIT_SA_Events",
        ProjectionExpression: "eventID",
        FilterExpression:"#startTime BETWEEN :from AND :to",
        ExpressionAttributeNames: {
            "#startTime":"startTime"
        },
        ExpressionAttributeValues: {
            ":from": from.unix(),
            ":to": to.unix()
        }
    };

    var items = []
    var scanExecute = function(callback) {
        docClient.scan(params, function(err,result) {
            if(err) {
                callback(err);
            } else {
            console.log(result)
            items = items.concat(result.Items);
            if(result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
                scanExecute(callback);
                } else {
                    callback(err,items);
                }
            }
        });
    }
    scanExecute(callback);
}


