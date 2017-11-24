'use strict'
var AWS = require("aws-sdk");

AWS.config.update({
	region: "us-west-2",
	endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

var storage = (function() {
	var dynamodb = new AWS.DynamoDB.DocumentClient();
	return {
		save: function(color, session, callback) {
			var params = {
				TableName: 'BCIT_SA_Events',
				Item: {
					eventID: session.user.userId,
					name: color
				}
			};
			dynamodb.put(params, function(err, data) {
				callback(color);
			})
		},
		saveTest: function(eventsJSON, callback) {
			var params = {
				TableName: 'BCIT_SA_Events',
				Item: {
					description: "eventsJSON[i].description",
					endTime: "eventsJSON[i].end_time",
					name:" eventsJSON[i].name",
					pname: "eventsJSON[i].pname",
					city: "eventsJSON[i].city",
					country: "eventsJSON[i].country",
					latitude: "eventsJSON[i].latitude",
					longitude: "eventsJSON[i].longitude",
					state: "eventsJSON[i].state",
					street: "eventsJSON[i].street",
					zip: "eventsJSON[i].zip",
					startTime: "eventsJSON[i].start_time",
					eventID: "eventsJSON[i].id"
				}
			};
			dynamodb.put(params, function(err, data) {
				callback(eventsJSON);
			})
		},
		saveEvents: function(eventsJSON, callback) {
			var items = [];
			for (var i = 0; i < eventsJSON.length; i++) {
				var event = eventsJSON[i];
				var request = {
					PutRequest: {
						Item: {
/*							description: eventsJSON[i].description,
							endTime: eventsJSON[i].end_time,
							name: eventsJSON[i].name,
							pname: eventsJSON[i].pname,
							city: eventsJSON[i].city,
							country: eventsJSON[i].country,
							latitude: eventsJSON[i].latitude,
							longitude: eventsJSON[i].longitude,
							state: eventsJSON[i].state,
							street: eventsJSON[i].street,
							zip: eventsJSON[i].zip,
							startTime: eventsJSON[i].start_time,
							eventID: eventsJSON[i].id
							*/


							description: "2",
							endTime: "2",
							name: "2",
							pname: "2",
							city: "2",
							country: "2",
							latitude: "2",
							longitude: "2",
							state: "2",
							street: "2",
							zip: "2",
							startTime: "2",
							eventID: "2"
						}
					}
				}
				items.push(request);
			}

			var params = {
				RequestItems: {
					"BCIT_SA_Events": items
				}
			}
			dynamodb.batchWrite(params, function(err, data) { 
				callback(eventsJSON);
			});
		},
		getColor: function(session, callback) {
			var params = {
				TableName: 'BCIT_SA_Events',
				Key: {
					eventID: session.user.userId,
				}
			};
			dynamodb.get(params, function(err, data) {
				callback(data.Item.name);
			});
		}
	}
})();

module.exports = storage;
