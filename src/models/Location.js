const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		lat: {
			type: Number,
			required: true,
		},
		lng: {
			type: Number,
			required: true,
		},
		user: {
			type: String,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Location', LocationSchema);
