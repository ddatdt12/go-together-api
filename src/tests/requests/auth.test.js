const request = require('supertest');
const app = require('../../app');

// Login user request test /api/auth/login
describe('POST /api/auth/login', () => {
	test('It should response the POST method', async () => {
		const response = await request(app).post('/api/auth/login').send({
			email: 'test@gmail.com',
			password: '123456',
		});
		expect(response.statusCode).toBe(200);
	});
});
