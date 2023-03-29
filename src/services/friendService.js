const Friend = require('../models/Friend');
const User = require('../models/User');

const friendService = {
	getFriendUsers: async (userId) => {
		console.log('userId: ', userId);

		const friends = await Friend.find({
			$or: [{ user1: userId }, { user2: userId }],
		});

		console.log('friends: ', friends);

		const friendUserIds = friends.map((friend) => {
			let friendUserId = null;
			if (friend.user1.toString() == userId) {
				friendUserId = friend.user2;
			} else {
				friendUserId = friend.user1;
			}

			return friendUserId;
		});

		console.log('friendUserIds: ', friendUserIds);

		const friendUsers = await User.find({
			_id: { $in: friendUserIds },
		});

		return friendUsers;
	},
};

module.exports = friendService;
