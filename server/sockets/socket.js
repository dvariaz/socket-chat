const { io } = require('../server');
const { Users } = require('../classes/users');
const { sendMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {

    client.on('enterChat', (data, callback) => {
        console.log(data);
        if(!data.name || !data.room){
            return callback({
                err: true,
                msg: 'El nombre y la sala son necesarios'
            });
        }

        client.join(data.room);

        let newUsers = users.addUser( client.id, data.name, data.room );
        
        client.broadcast.to(data.room).emit('usersList', users.getUsersByRoom(data.room));
        client.broadcast.to(data.room).emit('sendMessage', sendMessage('Administrador', `${ data.name } entro a la sala`) );

        callback(users.getUsersByRoom(data.room));
        //console.log(newUsers);
    });

    client.on('sendMessage', (data, callback) => {
        //console.log(data);
        let user = users.getUser(client.id);
        let msg = sendMessage(user.name, data.msg);
        
        client.broadcast.to(user.room).emit('sendMessage', msg);
        callback(msg);
    });

    client.on('disconnect', () => {
        let removedUser = users.removeUser(client.id);

        client.broadcast.to(removedUser.room).emit('sendMessage', sendMessage('Administrador', `${ removedUser.name } salió`) );
        client.broadcast.to(removedUser.room).emit('usersList', users.getUsersByRoom(removedUser.room));
    });

    //Mensajes privados
    client.on('privateMessage', data => {
        let user = users.getUser(client.id);

        client.broadcast.to(data.to).emit('privateMessage', sendMessage(user.name, data.msg));
    })
});
