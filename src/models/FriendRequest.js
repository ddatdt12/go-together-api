const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema(
	{
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		receiver: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
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

FriendRequestSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);
