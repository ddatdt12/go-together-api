const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

module.exports = (app) => {
	router.get('/', protect, authController.authenicate);
	router.post('/login', authController.login);
	router.post('/register', authController.register);

	app.use('/api/auth', router);
};
