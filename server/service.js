'use strict';

const config = require('../config/index');
const express = require('express');
const service = express();

const request = require('superagent');
const moment = require('moment');

service.get('/service/:location', (req, res, next) => {
	request.get('https://maps.googleapis.com/maps/api/geocode/json')
		.query({ address: req.params.location, key: config.googleGeoApiKey })
		.end((err, resp) => {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}
			const location = resp.body.results[0].geometry.location;
			const timestamp = +moment().format('X');
			request.get('https://maps.googleapis.com/maps/api/timezone/json')
				.query({ location: location.lat + ',' + location.lng, timestamp: timestamp, key: config.googleTimeApiKey })
				.end((err, resp) => {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					}
					const result = resp.body;
					const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');
					res.json({ result: timeString });
				});
		});
});

module.exports = service;
