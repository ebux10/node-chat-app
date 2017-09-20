const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const {generateMessage , generateLocationMessage} = require("./utils/message");
const publicPath = path.join(__dirname , "../public");
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection" , (socket) => {
  console.log("New user connected");
  
  socket.emit("newMessage" , generateMessage("Admin" , "Welcome to the Chat App"));
  
  socket.broadcast.emit("newMessage" , generateMessage("Admin" , "A New user just joined"));
  
  socket.on("createMessage" , function(message , callback){
    console.log("This is the message" , message);
    
    io.emit("newMessage" , generateMessage(message.from , message.text));
    callback("This is from the server");
  });
  
  socket.on("createLocationMessage" , (coords)=>{
    io.emit("newLocationMessage" , generateLocationMessage("Admin" , coords.latitude ,coords.longitude));
  });
  
  socket.on("disconnect" , ()=>{
    console.log("User Disconnected");
  });
});

server.listen(port , () => {
  console.log(`The server is up and running on ${port}`);
});