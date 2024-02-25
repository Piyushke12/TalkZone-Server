const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    chatName: { type: String, required: true },
    isGroupChat: { type: Boolean, required: true, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: Object, default:{text:"Message...",_id:'11aa11', user:"You"}},
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    picture:{ type:String, required:true, 
        default:'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    }
},
    { timestamps: true }
)

const Chat = mongoose.model("Chat", ChatSchema)

module.exports = Chat;