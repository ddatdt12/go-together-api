const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const Friend = require('../models/Friend');
const FriendRequest = require('../models/FriendRequest');
const { mongoose } = require('../models');
const Group = require('../models/Group');

//@desc
//@route        GET /api/friends
//@access       PRIVATE
const getFriendRequests = catchAsync(async (req, res) => {
	const { status } = req.query;

	const friendRequests = await FriendRequest.find({
		$or: [{ receiver: req.user.id }],
		status,
	}).populate('sender');

	res.status(200).json({
		data: friendRequests,
		message: 'Get friend requests successfully',
	});
});

const SUPPORTED_ADDING_METHODS = ['email', 'phoneNumber', 'id'];

//@desc
//@route        POST /api/friends/email
//@access       PRIVATE
const addFriend = catchAsync(async (req, res, next) => {
	const { type } = req.body;

	if (!SUPPORTED_ADDING_METHODS.includes(type)) {
		return next(new AppError('Invalid type', 400));
	}

	const data = req.body[type];

	if (!data) {
		return next(new AppError('Invalid data', 400));
	}

	if (req.user[type] === req.body[type]) {
		return next(
			new AppError('Cannot add yourself as a friend request', 400)
		);
	}

	const filter = {
		[type]: data,
	};

	if (type === 'id') {
		filter._id = data;
	}

	const newFriend = await User.findOne(filter);

	if (!newFriend) {
		return next(new AppError('User not found', 404));
	}

	const friendRequest = await FriendRequest.findOne({
		$or: [
			{ sender: req.user.id, receiver: newFriend.id },
			{ sender: newFriend.id, receiver: req.user.id },
		],
	});

	if (friendRequest) {
		if (friendRequest.status == 'accepted') {
			return next(new AppError('Friend already exists', 400));
		} else if (friendRequest.status == 'pending') {
			if (friendRequest.sender.toString() == req.user.id) {
				return next(new AppError('Friend request already sent', 400));
			}

			friendRequest.status = 'accepted';
			return res.status(204).json({
				data: friendRequest,
				message: 'Accepted friend request successfully',
			});
		} else if (friendRequest.status == 'rejected') {
			return next(new AppError('Friend request already rejected', 400));
		}
	}

	await FriendRequest.create({
		sender: req.user.id,
		receiver: newFriend.id,
	});

	res.status(201).json({
		message: 'Friend request sent successfully',
	});
});

//@desc
//@route        PUT /api/friendRequest-request/:friendReqId
//@access       PUBLIC
const updateFriendRequest = catchAsync(async (req, res, next) => {
	const { friendReqId } = req.params;
	const { status } = req.body;

	const friendRequest = await FriendRequest.findById(friendReqId);

	if (!friendRequest) {
		return next(new AppError('Friend request not found', 404));
	}

	if (friendRequest.receiver.toString() != req.user.id) {
		return next(new AppError('Not authorized', 401));
	}

	if (friendRequest.status != 'pending') {
		return next(
			new AppError(
				`Friend request is already ${friendRequest.status}`,
				400
			)
		);
	}

	const ALLOWED_STATUSES = ['accepted', 'rejected'];

	if (!ALLOWED_STATUSES.includes(status)) {
		return next(new AppError('Invalid status', 400));
	}

	friendRequest.status = status;

	const session = await mongoose.startSession();
	session.startTransaction();
	let sessionError;
	try {
		if (status == 'accepted') {
			const friend = new Friend({
				user1: friendRequest.sender,
				user2: friendRequest.receiver,
			});

			await friend.save({ session });

			const friendUsers = await User.find(
				{
					$or: [
						{ _id: friendRequest.sender },
						{ _id: friendRequest.receiver },
					],
				},
				{ _id: 1, name: 1, avatar: 1 },
				{ session }
			);

			const group = new Group({
				members: friendUsers.map((user) => {
					return {
						user: user._id,
						name: user.name,
						avatar: user.avatar,
					};
				}),
			});

			await group.save({ session });
		}

		await friendRequest.save({ session });

		await session.commitTransaction();
	} catch (error) {
		await session.abortTransaction();
		sessionError = error;
	} finally {
		session.endSession();
	}

	if (sessionError) {
		return next(sessionError);
	}

	return res.status(204).json({
		data: friendRequest,
		message: 'Update status friend request successfully',
	});
});

module.exports = { getFriendRequests, addFriend, updateFriendRequest };
