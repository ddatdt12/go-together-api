const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ULocationSchema = new Schema(
	{
		lat: {
			type: Number,
			required: true,
		},
		lng: {
			type: Number,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('ULocation', ULocationSchema);
