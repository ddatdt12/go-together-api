const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Friend = new Schema(
	{
		user1: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		user2: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'accepted', 'rejected'],
			default: 'pending',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Friend', Friend);
