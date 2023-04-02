const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
	{
		content: String,
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		location: {
			type: Schema.Types.ObjectId,
			ref: 'ULocation',
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: 'Group',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

MessageSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

module.exports = mongoose.model('Message', MessageSchema);
