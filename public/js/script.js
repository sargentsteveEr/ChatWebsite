const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io();
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room, users}) => {
    roomName.innerText = 'Room: ' + room;
    userList.innerHTML = '';
    users.forEach((user) => {
        const list = document.createElement('li');
        list.innerText = user.username;
        userList.appendChild(list);
    });

});

//sending a message
form.addEventListener('submit', (sub) => {
  let date = Date().slice(16,21);
  let lB = "\n";
  sub.preventDefault();
  if (input.value) {

    socket.emit('chat message', date + ": " + lB + input.value);
    input.value = '';
  };
});

//new message
socket.on('chat message', function(message) {
  let item = document.createElement('li');
  let leName = message.Name;
  let leMessage = message.Msg;
  let username = '<b>' + leName + '</b>';
  let themessage = username + leMessage

  item.innerHTML = themessage;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave?');

  if (leaveRoom) {
    window.location = '../index.html';
  };
});