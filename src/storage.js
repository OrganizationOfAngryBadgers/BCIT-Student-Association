'use strict'
var AWS = require("aws-sdk");

AWS.config.update({
	region: "us-east-1",
	endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var storage = (function() {
	var dynamodb = new AWS.DynamoDB.DocumentClient();
	return {
		save: function(color, session, callback) {
			var params = {
				TableName: 'faveColorList',
				Item: {
					UserId: session.user.userId,
					Color: color
				}
			};
			dynamodb.put(params, function(err, data) {
				callback(color);
			})
		},
		getColor: function(session, callback) {
			var params = {
				TableName: 'faveColorList',
				Key: {
					UserId: session.user.userId,
				}
			};
			dynamodb.get(params, function(err, data) {
				callback(data.Item.Color);
			});
		}
	}
})();

module.exports = storage;
