const path = require("path");
const express = require("express");
const http = require("http");
const {isRealString} = require("./utils/validations.js");
const {Users} = require("./utils/users");
const socketIO = require("socket.io");
const {generateMessage , generateLocationMessage} = require("./utils/message");
const publicPath = path.join(__dirname , "../public");
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on("connection" , (socket) => {
  console.log("New user connected");
  
  socket.on('join', (params, callback) => {
    console.log(params.name , params.room);
    if (!(params.name !== "") || !(params.room !== "")) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id , params.name , params.room);
    io.to(params.room).emit("updateUserList" , users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });
  
  
  
  socket.on("createMessage" , function(message , callback){
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
      io.to(user.room).emit("newMessage" , generateMessage(user.name , message.text));
    }
    callback();
  });
  
  socket.on("createLocationMessage" , (coords)=>{
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit("newLocationMessage" , generateLocationMessage(user.name , coords.latitude ,coords.longitude));
    }
  });
  
  socket.on("disconnect" , ()=>{
    var user = users.removeUser(socket.id);
    
    if(user){
      io.to().emit("updateUserList" , users.getUserList(user.room));
      io.to().emit("newMessage" , generateMessage("Admin" , `${user.name} has left the room`));
    }
  });
});

server.listen(port , () => {
  console.log(`The server is up and running on ${port}`);
});