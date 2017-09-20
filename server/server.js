const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const publicPath = path.join(__dirname , "../public");
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection" , (socket) => {
  console.log("New user connected");
  
  socket.emit("newMessage" , {
    from : "Ebuka",
    text : "Hey , you will be the best Node developer",
    createdAt : 123
  });
  
  socket.on("createMessage" , function(message){
    console.log("This is the message" , message);
  });
  
  socket.on("disconnect" , ()=>{
    console.log("User Disconnected");
  });
});

server.listen(port , () => {
  console.log(`The server is up and running on ${port}`);
});