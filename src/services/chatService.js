const Group = require('../models/Group');
const Message = require('../models/Message');

const chatService = {
	getGroupById: async (groupId) => {
		const group = await Group.findById(groupId);
		return group;
	},
	updateLastMessage: async (groupId, message) => {
		await Group.findByIdAndUpdate(
			groupId,
			{ lastMessage: message },
			{ new: true }
		);
	},
	saveMessage: async (message) => {
		const newMessage = new Message(message);

		await newMessage.save();
		chatService.updateLastMessage(newMessage.group, {
			content: newMessage.content,
			createdAt: newMessage.createdAt,
			senderId: newMessage.sender,
		});

		return newMessage;
	},
};

module.exports = chatService;
