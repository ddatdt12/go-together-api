const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: function (v) {
					return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
				},
				message: (props) => `${props.value} không phải là email`,
			},
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		name: {
			type: String,
			required: [true, 'Vui lòng nhập tên'],
			maxlength: 80,
			trim: true,
		},
		photoUrl: {
			type: String,
			default: null,
		},
		phoneNumber: {
			type: String,
			validate: {
				validator: function (v) {
					return !v || /^0[0-9]{9,10}$/.test(v);
				},
				message: (props) =>
					`${props.value} không phải là số điện thoại`,
			},
			trim: true,
			index: true,
			unique: true,
			sparse: true,
			default: null,
		},
		address: String,
		isOnline: {
			type: Boolean,
			default: false,
		},
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
