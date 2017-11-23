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
		saveEvents: function(color, session, callback) {
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
