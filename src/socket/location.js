const { default: mongoose } = require('mongoose');
const ULocation = require('../models/ULocation');
const User = require('../models/User');
const friendService = require('../services/friendService');

module.exports = (io) => {
	io.on('connection', (socket) => {
		///Handle khi có connect từ client tới
		console.log('New client connect message ' + socket.id);
		socket.join(socket.userId);

		(async () => {
			const user = await User.findById(socket.userId);

			if (user) {
				user.isOnline = true;
				user.save();
			}
		})();

		socket.on('user_move', async (data) => {
			const updatedLocation = {
				lat: data.lat,
				lng: data.lng,
			};

			const friendIds = (
				await friendService.getFriendUsers(socket.userId, {
					// isOnline: true,
				})
			).map((friend) => friend.id);

			console.log('friendIds: ', friendIds);
			const newLocation = await updateLocation(
				socket.userId,
				updatedLocation
			);

			socket.to(friendIds).emit('friend_move', newLocation);
		});

		socket.on('update_location', (data) => {
			updateLocation(data);
			io.emit('receive_location', data);
		});

		socket.on('disconnect', () => {
			console.log('Client disconnect: ' + socket.id);

			(async () => {
				const user = await User.findById(socket.userId);

				if (user) {
					user.isOnline = false;
					user.save();
				}
			})();
		});
	});
};

const updateLocation = async (userId, data) => {
	try {
		let location = await ULocation.findOne({ user: userId });

		if (location) {
			location.lat = data.lat;
			location.lng = data.lng;
		} else {
			const locationId = new mongoose.Types.ObjectId();
			location = new ULocation({
				_id: locationId,
				lat: data.lat,
				lng: data.lng,
				user: userId,
			});
		}
		location.save();

		return location;
	} catch (error) {
		console.log(error);
	}
};
