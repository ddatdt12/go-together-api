const User = require('../models/User');

module.exports = (io) => {
	io.on('connection', (socket) => {
		///Handle khi có connect từ client tới
		console.log('New client connect message ' + socket.id);

		socket.on('update_location', (data) => {
			updateLocation(data);
			io.emit('receive_location', data);
		});

		socket.on('disconnect', () => {
			console.log('Client disconnect: ' + socket.id);
		});
	});
};

const updateLocation = async (data) => {
	try {
		console.log('Update location: ' + data);
	} catch (error) {
		console.log(error);
	}
};
