const { Server } = require('socket.io');
const User = require('../models/User');

const authHandler = async (socket, next) => {
	if (
		(socket.handshake.auth && socket.handshake.auth.token) ||
		socket.handshake.headers.auth
	) {
		const token =
			socket.handshake.auth.token || socket.handshake.headers.auth;

		try {
			socket.userId = token;
			const user = await User.findById(socket.userId);

			if (!user) {
				return next(new Error('Please login to continue'));
			}

			return next();
		} catch (error) {
			next(new Error('Please login to continue'));
		}
	}

	next(new Error('Please login to continue'));
};

const ConnectMessageSocketServer = (server) => {
	const io = new Server(server, {
		cors: { origin: '*', credentials: true },
		path: '/message',
	});
	io.use(authHandler);

	require('./message')(io);
};

const ConnectLocationSocketServer = (server) => {
	const io = new Server(server, {
		cors: { origin: '*', credentials: true },
		path: '/location',
	});

	io.use(authHandler);

	require('./location')(io);
};

module.exports = { ConnectMessageSocketServer, ConnectLocationSocketServer };
