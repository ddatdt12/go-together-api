const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema(
	{
		members: [
			{
				userId: String,
				name: String,
				avatar: String,
			},
		],
		lastMessage: {
			content: String,
			createdAt: Date,
			senderId: String,
		},
	},
	{
		timestamps: true,
		typeKey: '$type',
	}
);

GroupSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

// sender virtual for last message in room filter from members array
GroupSchema.virtual('lastMessage.sender').get(function () {
	return this.members.find(
		(member) => member.userId === this.lastMessage.senderId
	);
});

module.exports = mongoose.model('Group', GroupSchema);
