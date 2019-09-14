const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
var userCount = 0;
//Serve public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, +'public/index.html'));
});

io.on('connection', socket => {
	console.log('a user connected');

	userCount++;
	io.sockets.emit('userCount', { userCount: userCount });
	socket.on('disconnect', function () {
		userCount--;
		io.sockets.emit('userCount', { userCount: userCount });
	});
	// socket.on('disconnect', () => {
	// 	console.log('user disconnected');
	// });

	socket.on('typing',function(data){
		socket.broadcast.emit('typing',{username : socket.username});
	})

	socket.on('message', message => {
		console.log('message: ' + message);
		//Broadcast the message to everyone
		io.emit('message', message);
	});
});





http.listen(3000, () => {
	console.log('listening on port 3000');
});
