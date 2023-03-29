const { faker } = require('@faker-js/faker');
const connectDB = require('../../database');
const User = require('../models/User');
const bcrypt = require('bcrypt');

faker.locale = 'de';
//Seed User and friend
const seed = async () => {
	const password = '123456';
	const passwordHash = await bcrypt.hash(password, 10);

	// Create 10 user
	let newUsers = [];
	for (let i = 0; i < 10; i++) {
		const user = new User({
			email: faker.internet.email('user_' + i, 'test', 'example.com'),
			password: passwordHash,
			name: faker.name.firstName(),
			photoUrl: faker.image.avatar(),
			phoneNumber: faker.phone.number('0987#######'),
			address: faker.address.streetAddress(),
		});
		newUsers.push(user);
	}
	console.log(newUsers);
	await User.insertMany(newUsers);
};
(async () => {
	await connectDB();
	await seed();

	process.exit();
})();
