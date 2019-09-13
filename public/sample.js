var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var userCount = -1;
users = [];
io.on('connection', function (socket) {
  console.log('A user connected');
  
  socket.on('setUsername', function (data) {
    console.log(data);

    if (users.indexOf(data) > -1) {
      socket.emit('userExists', data + ' username is taken! Try some other username.');
    } else {
      users.push(data);
      socket.emit('userSet', { username: data });
    }
  });

  socket.on('msg', function (data) {
    //Send message to everyone
    io.sockets.emit('newmsg', data);
  })

  userCount++;

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });

  io.emit('userCount', { userCount: userCount });
  socket.on('disconnect', function () {
    userCount--;
    
    io.emit('userCount', { userCount: userCount });
  });

});

http.listen(port, function () {
  console.log('listening on *:' + port);
});