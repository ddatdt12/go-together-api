const jwt = require('jsonwebtoken');

const AuthService = {
	verifyToken: (token) => {
		return new Promise((resolve, reject) => {
			jwt.verify(
				token,
				process.env.JWT_SECRET_KEY,
				(err, decodedToken) => {
					if (err || !decodedToken) {
						return reject(err);
					}
					resolve(decodedToken);
				}
			);
		});
	},
};

module.exports = AuthService;
