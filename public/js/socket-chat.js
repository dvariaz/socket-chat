if(!params.has('name') || !params.has('room')){
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function(res){
        console.log('Usuarios conectados', res);
        renderUsers(res);
    });
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Escuchar información
socket.on('sendMessage', function(msg) {
    // console.log('Servidor:', msg);
    renderMessages(msg, false);
    scrollBotom();
});

socket.on('usersList', function(users) {
    console.log(users);
    renderUsers(users);
});

//Mensajes privados
socket.on('privateMessage', function(msg) {
    console.log('Mensaje privado:', msg);
});