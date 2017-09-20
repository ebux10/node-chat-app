var socket = io();

socket.on("connect" , function(){
  console.log("Connected to the server");
});
    
socket.on("disconnect" , function(){
  console.log("Disonnected from the server");
});

socket.on("newMessage" , function(message){
  console.log("New Message" , message);
});

socket.emit("createMessage" , {from : "Frank", text : "Hi"},(data) =>{
  console.log("Got it",data); 
});