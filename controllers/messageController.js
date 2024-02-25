const Message = require('../models/MessageModel')
const Chat = require('../models/ChatModel')

const createMessage = async (req, res, next) => {

    const { message, user, chat } = req.body;
    if (!message) {
        return res.status(404).json("Something went wrong");
    }
    var newMessage = new Message({
        text: message,
        user: user,
        chat: chat
    });
    await newMessage.save();

    if (newMessage) {
        res.status(200).json("Sent");
    }
    else {
        res.status(500).status("Something went wrong");
    }
}

const accessMessages = async (req, res, next) => {
    const chatId = req.query.chatId;

    const populatedMessages = await Message.find({
        chat: chatId
    })
        .populate("user", 'name')

    if (populatedMessages.length > 0) {
        const latestMessage = {
            _id: populatedMessages[populatedMessages.length - 1]._id,
            text: populatedMessages[populatedMessages.length - 1].text,
            user: populatedMessages[populatedMessages.length - 1].user.name
        }

        await Chat.findOneAndUpdate({ _id: chatId }, {
            latestMessage: latestMessage
        })
            .catch(err => console.log(err))

        
    }

    if (!populatedMessages) {
        res.status(404).json("Something went wrong");
    }
    else {
        res.status(200).json(populatedMessages);
    }
}

module.exports = { createMessage, accessMessages };