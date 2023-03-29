const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');

//@desc
//@route        GET /api/users
//@access       PUBLIC
const getUsers = catchAsync(async (req, res) => {
	const users = await User.find();

	res.status(200).json({
		data: users,
		message: 'Get users successfully',
	});
});

module.exports = { getUsers };
