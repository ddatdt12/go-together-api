const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			default: 'New Group',
		},
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
		type: {
			type: String,
			enum: ['private', 'group'],
			default: 'private',
		},
	},
	{
		timestamps: true,
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

GroupSchema.pre('save', function (next) {
	if (this.members.length > 2) {
		this.type = 'group';

		if (this.name === 'New Group') {
			this.name = this.members
				.map((member) => member.name)
				.join(', ')
				.replace(/,(?!.*,)/gim, ' & ');
		}
	}

	next();
});

module.exports = mongoose.model('Group', GroupSchema);
