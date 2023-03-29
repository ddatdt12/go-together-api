const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

module.exports = (app) => {
	router.get('/users', userController.getUsers);

	app.use('/api', router);
};
