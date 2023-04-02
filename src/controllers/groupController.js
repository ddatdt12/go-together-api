const catchAsync = require('../utils/catchAsync');
const Group = require('../models/Group');
const User = require('../models/User');
const AppError = require('../utils/AppError');

//@desc
//@route        GET /api/groups
//@access       PRIVATE
const getGroups = catchAsync(async (req, res) => {
	const groups = await Group.find({
		members: { $elemMatch: { userId: req.user.id } },
	});

	res.status(200).json({
		data: groups,
		message: 'Get groups successfully',
	});
});

//@desc
//@route        POST /api/groups
//@access       PRIVATE
const createGroup = catchAsync(async (req, res, next) => {
	const { name, memberIds } = req.body;

	if (!Array.isArray(memberIds) || memberIds.length === 0) {
		return next(new AppError('Invalid members', 400));
	}
	const members = await User.find({ _id: { $in: memberIds } });

	if (!members || members.length === 0) {
		return next(new AppError('Invalid members', 400));
	}

	if (members.length != memberIds.length) {
		return next(new AppError('Some members are not found', 400));
	}

	if (members.some((member) => member.id === req.user.id)) {
		return next(new AppError('Cannot add yourself as a member', 400));
	}

	memberIds.push(req.user.id);
	members.push({
		id: req.user.id,
		name: req.user.name,
		avatar: req.user.avatar,
	});

	//Verify members is array of idc
	const group = await Group.findOne({
		'members.userId': {
			$all: memberIds,
		},
	});

	if (group) {
		return next(new AppError('Group already exists', 400));
	}

	const newGroup = await Group.create({
		name,
		members: members.map((member) => ({
			userId: member.id,
			name: member.name,
			avatar: member.avatar,
		})),
	});

	res.status(200).json({
		data: newGroup,
		message: 'Create group successfully',
	});
});

module.exports = { getGroups, createGroup };
