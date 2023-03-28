const { faker } = require('@faker-js/faker');
const User = require('../models/User');

//Seed User and friend
const seed = async () => {
	//Create 10 user
	for (let i = 0; i < 10; i++) {
		const user = new User({
			email: faker.internet.email(),
			password: '123456',
			name: faker.name.firstName(),
			photoUrl: faker.image.avatar(),
			phoneNumber: faker.phone.phoneNumber(),
			address: faker.address.streetAddress(),
		});
		await user.save();
	}

	//Create 10 friend for each user

	const users = await User.find();
	for (let i = 0; i < users.length; i++) {
		for (let j = 0; j < 10; j++) {
			const user = await User.findById(users[i]._id);
			const friend = await User.findById(users[j]._id);
			user.friends.push(friend);
			await user.save();
		}
	}
};

seed();
