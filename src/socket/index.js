const { Server } = require('socket.io');

const ConnectMessageSocketServer = (server) => {
	const io = new Server(server, {
		cors: { origin: '*', credentials: true },
		path: '/message',
	});

	require('../controllers/messageController')(io);
};

const ConnectLocationSocketServer = (server) => {
	const io = new Server(server, {
		cors: { origin: '*', credentials: true },
		path: '/location',
	});

	require('../controllers/locationController')(io);
};

module.exports = { ConnectMessageSocketServer, ConnectLocationSocketServer };
