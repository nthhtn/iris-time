'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm = null;
let nlp = null;

module.exports.init = (token, logLevel, nlpClient) => {
	rtm = new RtmClient(token, { logLevel: logLevel });
	nlp = nlpClient;
	addAuthenticatedHandler(rtm, handleOnAuthenticated);
	rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
	return rtm;
};

function handleOnAuthenticated(rtmStartData) {
	console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
};

function handleOnMessage(message) {
	if (message.text.toLowerCase().includes('iris')) {
		nlp.ask(message.text, (err, resp) => {
			if (err) {
				console.log(err);
				return;
			}
			try {
				if (!resp.intent || !resp.intent[0] || !resp.intent[0].value) {
					throw new Error('Could not extract intent.');
				}
				const intent = require('./intents/' + resp.intent[0].value + 'Intent');
				intent.process(resp, (error, response) => {
					if (error) {
						console.log(error.message);
						return;
					}
					return rtm.sendMessage(response, message.channel);
				});
			} catch (error) {
				console.log(error);
				console.log(resp);
				rtm.sendMessage('Sorry, I do not know what you are talking about', message.channel);
			}
		});
	}
};

function addAuthenticatedHandler(rtm, handler) {
	rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
