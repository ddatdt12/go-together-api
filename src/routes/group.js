const express = require('express');

const router = express.Router();

const groupController = require('../controllers/groupController');
const { protect } = require('../middlewares/auth');

module.exports = (app) => {
	router.use(protect);
	router.get('/', groupController.getGroups);
	router.post('/', groupController.createGroup);

	app.use('/api/groups', router);
};
