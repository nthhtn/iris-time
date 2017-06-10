'use strict';

const config = require('../config/index');
const log = config.log();
const service = require('../server/service')(config);
const http = require('http');
const server = http.createServer(service);

const request = require('superagent');

server.on('listening', () => {
	log.info(`IRIS-Time is listening on ${server.address().port} in ${service.get('env')}`);
	const announce = function() {
		request.put(`http://127.0.0.1:3000/service/time/${server.address().port}`)
			.end((err, resp) => {
				if (err) {
					log.debug(err);
					log.info('Error connecting to Iris');
					return;
				}
				log.info(resp.body);
			});
	};
	announce();
	setInterval(announce, 15 * 1000);
});

server.listen();