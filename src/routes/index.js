const express = require('express');
const router = express.Router();

module.exports = (app) => {
	// router.use('/auth', authRoute);
	app.use('/api', router);
};
