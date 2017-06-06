'use strict';

module.exports.process = (intentData, callback) => {
	if (intentData.intent[0].value !== 'time') {
		return callback(new Error(`Expected time intent, got ${intentData.intent[0].value}`));
	}
	if (!intentData.location) {
		return callback(new Error('Missing location in time intent'));
	}
	return callback(null, `I don't yet know time in ${intentData.location[0].value}`);
};
