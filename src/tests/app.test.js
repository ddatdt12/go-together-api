const request = require('supertest');
const app = require('../../app');

describe('Test the root path', () => {
	it('should return Hello World!', async () => {
		const res = await request(app).get('/');
		expect(res.statusCode).toEqual(200);

		expect(res.text).toEqual('Hello World!');
	});
});
