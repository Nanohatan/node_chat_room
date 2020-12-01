const port = process.env.PORT || 5000;
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http);
const url = require('url');

app.use(express.static('static'));
app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/static/index.html');
});

app.get('/createRoom', (req, res) =>{
    const queryObject = url.parse(req.url,true).query
    console.log(queryObject)
    res.render('room',{roomName:queryObject.roomName,userName:queryObject.userName})
});

app.get('/chatRoom', (req, res) => {
    res.sendFile(__dirname+'/static/chat_example.html')
});


io.on('connection', (socket) => {
    var room = '';

    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log(io.sockets.adapter.rooms[room]);
        if (!socket.username==""){
            io.to(room).emit('server_to_client', 'NOTE',socket.username+' left');
        }
        console.log('user disconnected');
    });


    socket.on('client_to_server_join',(id,user) => {
        room = id
        socket.join(id);
        console.log(id+" roomにjoin")
        socket.username=user;
        if (!user==""){
            io.to(room).emit('server_to_client', 'NOTE',user+' joined!');
        }
    });

    socket.on('client_to_server',(user,msg) =>{
        io.to(room).emit('server_to_client', user,msg);
    });

    //お絵かき関係
    socket.on('drawing', (data) => {
        io.to(room).emit('drawing', data)
    });

});
  
http.listen(port, () => {
	console.log('listening on *:'+port);
});