const express = require('express');

const router = express.Router();

const friendRequestController = require('../controllers/friendRequestController');
const { protect } = require('../middlewares/auth');

module.exports = (app) => {
	router.get('/', protect, friendRequestController.getFriendRequests);
	router.post('/email', protect, friendRequestController.addFriendByEmail);
	router.put(
		'/:friendId',
		protect,
		friendRequestController.updateFriendRequest
	);

	app.use('/api/friend-requests', router);
};
