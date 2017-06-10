require('dotenv').config();

const bunyan = require('bunyan');
const log = {
	development: () => {
		return bunyan.createLogger({ name: 'IRIS-TIME-development', level: 'debug' })
	},
	production: () => {
		return bunyan.createLogger({ name: 'IRIS-TIME-production', level: 'info' })
	},
	test: () => {
		return bunyan.createLogger({ name: 'IRIS-TIME-test', level: 'fatal' })
	}
};

module.exports = {
	googleGeoApiKey: process.env.GOOGLE_GEO_API_KEY,
	googleTimeApiKey: process.env.GOOGLE_TIME_API_KEY,
	witToken: process.env.WIT_TOKEN,
	slackToken: process.env.SLACK_TOKEN,
	slackLogLevel: 'verbose',
	serviceTimeout: 30,
	log: (env) => {
		if (env) {
			return log[env]();
		}
		return log[process.env.NODE_ENV || 'development']();
	}
};
