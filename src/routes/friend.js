const express = require('express');

const router = express.Router();

const friendController = require('../controllers/friendController');
const { protect } = require('../middlewares/auth');

module.exports = (app) => {
	router.get('/', protect, friendController.getFriends);

	app.use('/api/friends', router);
};
