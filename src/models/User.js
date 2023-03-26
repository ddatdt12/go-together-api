const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: [true, 'Vui lòng nhập tên'],
			maxlength: 80,
		},
		photoUrl: String,
		phoneNumber: String,
		address: String,
	},
	{
		timestamps: true,
	}
);

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// clear password before sending to client
UserSchema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.password;
	obj.id = obj._id;
	return obj;
};

// rename _id to id
UserSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

UserSchema.methods.comparePassword = async function (password) {
	const isMatch = await bcrypt.compare(password, this.password);
	this.password = undefined;
	return isMatch;
};

UserSchema.methods.generateToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

module.exports = mongoose.model('User', UserSchema);
