const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ULocation = require('../models/ULocation');
const userService = require('../services/userService');

//@desc
//@route        PUT /api/me
//@access       PRIVATE
const updateProfile = catchAsync(async (req, res, next) => {
	const { name, avatar, phoneNumber } = req.body;
	await userService.updateProfile(req.user.id, { name, avatar, phoneNumber });
	res.status(200).json({
		message: 'Update profile successfully',
	});
});

module.exports = { updateProfile };
