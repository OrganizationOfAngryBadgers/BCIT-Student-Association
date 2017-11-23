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
				TableName: 'favoriteColorListExample',
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
				TableName: 'favoriteColorListExample',
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
