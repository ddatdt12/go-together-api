const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/User');

const protect = catchAsync(async (req, res, next) => {
	// 1) Getting token and check of it's there
	let accessToken;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		accessToken = req.headers.authorization.split(' ')[1];
	}
	if (!accessToken) {
		return next(new AppError('This api require authentication', 401));
	}

	let decoded;
	// 2) Verification token
	try {
		decoded = await promisify(jwt.verify)(
			accessToken,
			process.env.JWT_SECRET
		);
	} catch (error) {
		return next(new AppError('This api require authentication', 401));
	}

	const currentUser = await User.findById(decoded.id);
	if (currentUser) {
		req.idUser = currentUser._id;
		req.user = currentUser;
	} else return next(new AppError('User not found', 404));

	next();
});

module.exports = {
	protect,
};
