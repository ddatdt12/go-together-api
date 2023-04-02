const { mongoose } = require('../models');
const User = require('../models/User');

const userService = {
	getUserById: async (userId) => {
		const user = await User.findById(userId);

		if (!user) {
			throw new mongoose.Error.DocumentNotFoundError('User not found');
		}

		return user;
	},
};

module.exports = userService;
