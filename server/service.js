'use strict';

const express = require('express');
const service = express();

const request = require('superagent');
const moment = require('moment');

service.get('/service/:location', (req, res, next) => {
	request.get('https://maps.googleapis.com/maps/api/geocode/json')
		.query({ address: req.params.location, key: 'AIzaSyBZrOk7mTVvUeNGg63hzJ62kyXbzfhGCRU' })
		.end((err, resp) => {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}
			const location = resp.body.results[0].geometry.location;
			const timestamp = +moment().format('X');
			request.get('https://maps.googleapis.com/maps/api/timezone/json')
				.query({ location: location.lat + ',' + location.lng, timestamp: timestamp, key: 'AIzaSyByd8tBvOc32IYHLNssOewwesqohRWhqPs' })
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
