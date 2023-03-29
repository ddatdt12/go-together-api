const { faker } = require('@faker-js/faker');
const connectDB = require('../../database');
const Friend = require('../models/Friend');
const User = require('../models/User');

//Seed User and friend
const seed = async () => {
	//Create 10 user
	// let newUsers = [];
	// for (let i = 0; i < 10; i++) {
	// 	const user = new User({
	// 		email: faker.internet.email('user_' + i, 'test', 'example.com'),
	// 		password: '123456',
	// 		name: faker.name.firstName(),
	// 		photoUrl: faker.image.avatar(),
	// 		phoneNumber: faker.phone.phoneNumber(),
	// 		address: faker.address.streetAddress(),
	// 	});
	// 	newUsers.push(user);
	// }
	// console.log(newUsers);
	// await User.insertMany(newUsers);
};
(async () => {
	await connectDB();
	await seed();

	process.exit();
})();
