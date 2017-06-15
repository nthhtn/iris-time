'use strict';

const config = require('../../config/index');
const should = require('should');
const request = require('supertest');
const service = require('../../server/service')(config);

describe('The Express service', () => {

	describe('GET /foo', () => {
		it('should return HTTP 404', (done) => {
			request(service)
				.get('/foo')
				.expect(404, done);
		});
	});

	describe('GET /service/:location', () => {
		it('should return HTTP 200 with a valid result', (done) => {
			request(service)
				.get('/service/vienna')
				.set('X-IRIS-SERVICE-TOKEN', config.serviceAccessToken)
				.expect(200)
				.end((err, resp) => {
					if (err) {
						return done(err);
					}
					resp.body.result.should.exist;
					return done();
				});
		});
		it('should return HTTP 403 if not valid token was passed', (done) => {
			request(service)
				.get('/service/vienna')
				.set('X-IRIS-SERVICE-TOKEN', 'Wrong token')
				.expect(403)
				.end(done);
		});
	})

});
