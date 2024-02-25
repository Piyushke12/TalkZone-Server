const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required:true}
},
    { timestamps: true }
)

const Message = mongoose.model("Message",MessageSchema)

module.exports = Message;