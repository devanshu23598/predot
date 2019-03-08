const http = require('http'); 
const app = require('./app');

const port = process.env.PORT || 3001;
const server = http.createServer(app).listen(port);

app.set('socketio', require('socket.io')(server));
