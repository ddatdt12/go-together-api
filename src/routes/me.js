const express = require('express');

const router = express.Router();

const meController = require('../controllers/meController');
const { protect } = require('../middlewares/auth');

module.exports = (app) => {
	router.put('/', protect, meController.updateProfile);

	app.use('/api/me', router);
};
