var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
// Invoked when a user connects (On client side - index.html)
io.on('connection', function(socket){
    console.log('a user connected');
    
    // io.emit('user connected', 'User connected');

    function getOnlineNicknames(){
        var clients = Object.keys(io.sockets.sockets);
        var onlineNicknames = [];
        clients.forEach(function(key){
            onlineNicknames.push(io.sockets.sockets[key].nickname);
        });
        return onlineNicknames;
    }

    socket.on('user connected', function(nickname){
        socket.nickname = nickname;
        console.log(io.sockets.sockets);
        var onlineNn = getOnlineNicknames();
        io.emit('user connected', nickname);
        io.emit('user sync', JSON.stringify(onlineNn));
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function(reason){
      console.log('user disconnected reason: ' +  reason);
      var onlineNn = getOnlineNicknames();
      io.emit('user sync', JSON.stringify(onlineNn));
      io.emit('user disconnect', socket.nickname)
    });

    // socket.on('user disconnect', function(nickname){
    //     console.log('user disconnected');
    //     ;
    // });

});

http.listen(app.get('port'), function(){
  console.log('listening on port ' + app.get('port'));
});
    