//help me dear god
const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const {
  newUser,
  currentUsers,
  userLeft,
  getRoomsUsers
} = require('./Additional/users.js');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  //A user connects to the chatroom
  socket.on('joinRoom', ({username, room}) => {
    const user = newUser(socket.id, username, room);

    socket.join(user.room);
    console.log('User ' + user.username + ' has connected');
    socket.broadcast.to(user.room).emit('chat message', "a user has connected");
    
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomsUsers(user.room)
    });
  });
  
  socket.on('chat message', msg => {
    const user = currentUsers(socket.id);
    const Name = user.username;
    const Msg = ' at ' + msg;
    const theMessage = {Name, Msg};
    io.to(user.room).emit('chat message', theMessage); 
    console.log(user.room + ' ' +  'message: ' + user.username + ' at ' + msg);
  });
  
  //A user disconnects from the chatroom
  socket.on('disconnect', () => {
    const user = userLeft(socket.id);

    if(user) {
      io.to(user.room).emit('chat message', "a user has disconnected");
      console.log('user disconnected');
    };

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomsUsers(user.room)
    });

  });
});

server.listen(3000, () => {console.log('listening on localhost:3000')});