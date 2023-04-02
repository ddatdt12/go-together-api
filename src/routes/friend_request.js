const express = require('express');

const router = express.Router();

const friendRequestController = require('../controllers/friendRequestController');
const { protect } = require('../middlewares/auth');

module.exports = (app) => {
	router.get('/', protect, friendRequestController.getFriendRequests);
	router.post('/', protect, friendRequestController.addFriend);
	router.put(
		'/:friendReqId',
		protect,
		friendRequestController.updateFriendRequest
	);

	app.use('/api/friend-requests', router);
};
