const { mongoose } = require('../models');
const Group = require('../models/Group');
const User = require('../models/User');

const userService = {
	getUserById: async (userId) => {
		const user = await User.findById(userId);

		if (!user) {
			throw new mongoose.Error.DocumentNotFoundError('User not found');
		}

		return user;
	},

	updateProfile: async (userId, data) => {
		const VALID_FIELDS = ['name', 'avatar', 'phoneNumber'];
		let updatedData = {};
		let updateGroupQuery = {};
		Object.keys(data).forEach((key) => {
			if (VALID_FIELDS.includes(key) && data[key] !== null) {
				updatedData[key] = data[key];
				updateGroupQuery[`members.$.${key}`] = data[key];
			}
		});

		await User.findByIdAndUpdate(userId, updatedData, {
			new: true,
			runValidators: true,
		});

		Group.updateMany({ 'members.userId': userId }, updateGroupQuery).then(
			(...res) => console.log(res)
		);
	},
};

module.exports = userService;
