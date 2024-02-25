const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');

const accessChat = async (req, res, next) => {

    const { userId, searcheduserId } = req.body;

    if (!searcheduserId) { return res.status(500).json("Internal Server Error") }

    var existingChat = await Chat.findOne({
        $and: [
            { users: { $all: [userId, searcheduserId] } },
            { isGroupChat: false }
        ]
    })
        .populate("users", "-password") // This will populate all info of USER except password

    existingChat = await User.populate(existingChat, {    //This statement will populate sender(User) name in latestMessage of existingChat
        path: "users",
        select: "name picture email"
    })

    if (existingChat) {
        return res.status(200).json(existingChat)
    }
    else {
        var newChat = new Chat({
            chatName: "sender",      //doubt
            isGroupChat: false,
            users: [userId, searcheduserId]
        })

        await newChat.save();

        var populatedChat = await Chat.findOne({
            _id: newChat._id
        })
            .populate("users", "-password") // This will populate all info of USER except password

        if (populatedChat)
            res.status(200).json(populatedChat)
        else
            res.status(501).json("Interal DB Error")
    }
}

const getAllChats = async (req, res, next) => {

    const userId = req.query.userId;

    await Chat.find({
        'users': { $in: userId }
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            return res.status(200).json(results)
        })
        .catch(err => console.log(err))
}

const createGroupChat = async (req, res, next) => {

    const { selectedUsers, groupName } = req.body;

    const newGroupChat = new Chat({
        chatName: groupName,      //doubt
        isGroupChat: true,
        users: [...selectedUsers],
        groupAdmin: selectedUsers.at(selectedUsers.length - 1)
    })

    await newGroupChat.save();

    if (newGroupChat)
        res.status(200).json(newGroupChat);
    else
        res.status(501).json('Cannot create group');
}

const leaveGroup = async (req, res, next) => {

    const { chatId, userId } = req.body;

    const chat = await Chat.findOne({ _id: chatId });

    const index = chat.users.indexOf(userId);
    chat.users.splice(index, 1);

    Chat.findOneAndUpdate({ _id: chatId }, {
        users: chat.users
    })
        .then(result => res.json('success'))
        .catch(err => console.log(err))
}

module.exports = { accessChat, getAllChats, createGroupChat, leaveGroup }