'use strict';

const request = require('superagent');

function handleWitResponse(resp) {
	return resp.entities;
};

module.exports = (token) => {
	const ask = function(message, callback) {
		request.get('https://api.wit.ai/message')
			.set('Authorization', 'Bearer ' + token)
			.query({ v: '31/05/2017', q: message })
			.end((err, resp) => {
				if (err) {
					return callback(err);
				}
				if (resp.statusCode != 200) {
					return callback('Expected status 200 but got ' + resp.statusCode);
				}
				const witResponse = handleWitResponse(resp.body);
				return callback(null, witResponse);
			});
	};
	return {
		ask: ask
	};
};
