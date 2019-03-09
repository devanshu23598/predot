const http = require('http'); 
const app = require('./app');

const port = process.env.PORT || 3001;
const server = http.createServer(app).listen(port);

const io = require('socket.io')(server);
io.on('connection', socket => {
    app.set('socketio',socket);
});
