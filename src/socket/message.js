module.exports = (io) => {
	io.on('connection', (socket) => {
		///Handle khi có connect từ client tới
		console.log('New client connect message ' + socket.id);

		socket.on('new_message', (data) => {
			console.log('New message: ' + data);
			io.emit('receive_message', data);
		});

		socket.on('disconnect', () => {
			console.log('Client disconnect: ' + socket.id);
		});
	});
};
