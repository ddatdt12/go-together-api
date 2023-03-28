const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const AppError = require('../utils/AppError');

//@desc
//@route        GET /api/auth
//@access       PUBLIC
const authenicate = catchAsync(async (req, res, next) => {
	res.status(200).json({
		data: req.user,
	});
});

//@desc         FOR TESTING: Login = uid
//@route        POST /api/auth/login
//@access       PUBLIC
const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	let user = await User.findOne({ email });

	if (!user || !(await user.comparePassword(password))) {
		return next(new AppError('Invalid email or password', 401));
	}

	createSendToken(user, 200, res);
});

const register = catchAsync(async (req, res, next) => {
	const { email, password, confirmPassword, name, photoUrl } = req.body;

	if (password !== confirmPassword) {
		return next(new AppError('Password do not match', 400));
	}

	//check email exist
	const user = await User.findOne({ email });
	console.log(user);
	if (user) {
		return next(new AppError('Email already exist', 400));
	}

	const newUser = await User.create({
		email,
		password,
		name,
		photoUrl,
	});

	createSendToken(newUser, 200, res);
});

const createSendToken = (user, statusCode, res) => {
	const accessToken = user.generateToken();

	res.status(statusCode).json({
		accessToken,
		data: user,
	});
};

module.exports = { login, register, authenicate };
