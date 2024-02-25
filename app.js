const express = require("express")
const app = express()
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
const cors = require("cors")
const http = require('http').Server(app);
const connectDB = require('./config/Db')
const PORT = process.env.PORT || 4000;
const userRoutes = require('./routes/UserRoutes')
const chatRoutes = require('./routes/ChatRoutes')
const messageRoutes = require('./routes/MessageRoutes')
const { addUser, removeUser, getRoomUsers, getCurrentUser } = require('./controllers/SocketController')


dotenv.config()
connectDB();

const io = require('socket.io')(http, {
  cors: {
      origin: process.env.CLIENT_URL
  }
});

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(cors())

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message', messageRoutes);

app.get("/api", (req, res) => {
  res.json({ CreatedBy: "Piyush Kesharwani" })
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



//Socket
io.on('connection', (socket) => {
  socket.on("joinRoom", ({ userId, roomId }) => {
    socket.join(roomId)
    const user = { userId, roomId }

    socket.on("messageupdate", () => {
      io.to(roomId).emit("messageupdate")
    }) 

    socket.on("typing", (typerName) => {
      io.to(roomId).emit("typing",typerName)
    })

    socket.on("stoptyping", () => {
      io.to(roomId).emit("stoptyping")
    })
  });

  socket.on('disconnect',()=>{
        socket.leave()
        socket.disconnect(true);
  })

});