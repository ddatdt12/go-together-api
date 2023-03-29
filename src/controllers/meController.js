const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ULocation = require('../models/ULocation');

//@desc
//@route        GET /api/me/location
//@access       PUBLIC
const getMyLocation = catchAsync(async (req, res, next) => {
	const ulocation = await ULocation.findOne({ user: req.user._id });

	if (!ulocation) {
		return next(new AppError('No location found', 404));
	}

	res.status(200).json({
		data: ulocation,
		message: 'Location found',
	});
});

module.exports = { getMyLocation };
