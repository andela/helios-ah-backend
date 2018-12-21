const socket = io.connect('http://localhost:4001');

socket.on('inAppNotifications', message => console.log(message));
