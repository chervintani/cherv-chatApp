$(document).ready(function () {
	
	const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login' };
	const me = messageTypes.RIGHT.avatar = "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";
	const you = messageTypes.LEFT.avatar = "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";
	//Chat stuff
	const chatWindow = $('#chat');
	const messagesList = $('#messagesList');
	const messageInput = $('#messageInput');
	const sendBtn = $('#sendBtn');

	//login stuff
	let username = '';
	const usernameInput = $('#usernameInput');
	const loginBtn = $('#loginBtn');
	const loginWindow = $('#login');


	const messages = []; // { author, date, content, type }

	//Connect to socket.io - automatically tries to connect on same port app was served from
	var socket = io();

	socket.on('message', function (message) {
		//Update type of message based on username
		if (message.type !== messageTypes.LOGIN) {
			if (message.author === username) {
				message.type = messageTypes.RIGHT;
			} else {
				message.type = messageTypes.LEFT;
			}
		}

		messages.push(message);
		displayMessages();

		//scroll to the bottom
		chatWindow.scrollTop() = chatWindow.height();
	});

	createMessageHTML = function (message) {
		if (message.type === messageTypes.LOGIN) {
			return `
			<p class="secondary-text text-center mb-2">${
				message.author
				} joined the chat...</p>
		`;
		}

		//I STOPPED RIGHT HERE
		return `
	<div class="messages ${
			message.type === messageTypes.LEFT ? 'yours messages' : 'mine messages'
			}">
		
		<div class="mine messages" style="flex-direction: column;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;">
    	<div class="message last">
     		${message.content} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
			 <p>${message.date}</p>
			 </div>
  		</div>
	</div>
	`;
	};

	displayMessages = function () {
		const messagesHTML = messages
			.map(message => createMessageHTML(message))
			.join('');
		messagesList.html(messagesHTML);
	};

	sendBtn.on("click", function (e) {
		e.preventDefault();
		if (!$('#messageInput').val()) {
			return console.log('Invalid input');
		}

		function formatAMPM(date) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'PM' : 'AM';
			var month = date.getMonth();
			var day = date.getDate();
			var year = date.getFullYear();
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm + '  ' + month + '/' + day + '/' + year;
			return strTime;
		}

		const message = {
			author: username,
			date: formatAMPM(new Date()),
			content: messageInput.val()
		};
		sendMessage(message);
		//clear input
		messageInput.val("");
	});

	loginBtn.on("click", function (e) {
		e.preventDefault();

		if (!usernameInput.val()) {
			return console.log('Must supply a username');
		}

		//set the username and create logged in message
		username = usernameInput.val();
		sendMessage({ author: username, type: messageTypes.LOGIN });

		loginWindow.addClass('hidden');
		chatWindow.removeClass('hidden');
	})

	sendMessage = function (message) {
		socket.emit('message', message);
	};
})