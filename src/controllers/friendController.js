const catchAsync = require('../utils/catchAsync');
const friendService = require('../services/friendService');

//@desc
//@route        GET /api/friends
//@access       PRIVATE
const getFriends = catchAsync(async (req, res) => {
	res.status(200).json({
		data: await friendService.getFriendUsers(req.user.id),
		message: 'Get friends successfully',
	});
});

module.exports = { getFriends };
