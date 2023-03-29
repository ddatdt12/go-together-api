const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema(
	{
		user1: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		user2: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

FriendSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

module.exports = mongoose.model('Friend', FriendSchema);
