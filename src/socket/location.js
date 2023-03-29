const { default: mongoose } = require('mongoose');
const ULocation = require('../models/ULocation');
const User = require('../models/User');

module.exports = (io) => {
	io.on('connection', (socket) => {
		///Handle khi có connect từ client tới
		console.log('New client connect message ' + socket.id);
		socket.join(socket.userId);

		const user = User.findById(socket.userId);
		user.isOnline = true;
		user.save();

		socket.on('user_move', async (data) => {
			const updatedLocation = {
				lat: data.lat,
				lng: data.lng,
			};

			const newLocation = await updateLocation(
				socket.userId,
				updatedLocation
			);

			io.emit('friend_move', newLocation);
		});

		socket.on('update_location', (data) => {
			updateLocation(data);
			io.emit('receive_location', data);
		});

		socket.on('disconnect', () => {
			console.log('Client disconnect: ' + socket.id);
		});
	});
};

const updateLocation = async (userId, data) => {
	try {
		let location = await ULocation.findOne({ user: userId });

		if (location) {
			location.lat = data.lat;
			location.lng = data.lng;
			location.save();
		} else {
			const locationId = new mongoose.Types.ObjectId();

			location = new ULocation({
				_id: locationId,
				lat: data.lat,
				lng: data.lng,
				user: data.userId,
			});

			location.save();
		}

		return location;
	} catch (error) {
		console.log(error);
	}
};
