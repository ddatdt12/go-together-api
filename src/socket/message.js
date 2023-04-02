const chatService = require('../services/chatService');

module.exports = (io) => {
	io.on('connection', (socket) => {
		///Handle khi có connect từ client tới
		console.log('New client connect Chat socket ' + socket.id);
		socket.join(socket.userId);

		// data: {groupId, content, sender}
		socket.on('new_message', async (data) => {
			if (!data.groupId) {
				throw new Error('Group id is required');
			}

			const group = await chatService.getGroupById(data.groupId);

			if (
				!group ||
				group.members.find((m) => m.userId === socket.userId) == null
			) {
				throw new Error('Group not found');
			}

			const message = {
				content: data.content,
				sender: socket.userId,
				group: data.groupId,
			};

			const newMessage = await chatService.saveMessage(message);
			const memberIds = group.members
				.map((member) => member.userId)
				.filter((id) => id !== socket.userId);

			const senderInfo = group.members.filter(
				(member) => member.userId === socket.userId
			)[0];

			socket.to(memberIds).emit('receive_message', {
				...newMessage._doc,
				sender: {
					id: senderInfo.userId,
					name: senderInfo.name,
					avatar: senderInfo.avatar,
				},
			});
		});

		socket.on('disconnect', () => {
			console.log('Client disconnect: ' + socket.id);
		});
	});
};
