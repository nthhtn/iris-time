'use strict';

const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);

const request = require('superagent');

server.on('listening', () => {
	console.log(`IRIS-Time is listening on ${server.address().port} in ${service.get('env')}`);
	const announce = function() {
		request.put(`http://127.0.0.1:3000/service/time/${server.address().port}`)
			.end((err, resp) => {
				if (err) {
					console.log(err);
					console.log('Error connecting to Iris');
					return;
				}
				console.log(resp.body);
			});
	};
	announce();
	setInterval(announce, 15 * 1000);
});

server.listen();