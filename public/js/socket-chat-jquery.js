var socket = io();

var params = new URLSearchParams(window.location.search);

var name = params.get('name');
var room = params.get('room');

// Referencias de jQuery
var usersContainer = $('#usersContainer');
var sendForm = $('#sendForm');
var inputMessage  = $('#inputMessage');
var chatbox = $('#chatbox');

// Funciones para renderizar usuarios
function renderUsers( users ) {
    console.log(users);
    
    var html = '';
    html+= '<li>';
    html+= '   <a href="javascript:void(0)" class="active"> Chat de <span> '+ room +'</span></a>';
    html+= '</li>';

    for(var i=0; i < users.length; i++){
        html+= '<li>';
        html+= '   <a data-id="'+ users[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ users[i].name +' <small class="text-success">online</small></span></a>';
        html+= '</li>';
    }

    usersContainer.html(html);
}

usersContainer.on('click', 'a', function(){
    var id = $(this).data('id');

    if(id){
        console.log(id);
    }
});

sendForm.on('submit', function(e) {
    e.preventDefault();
    // console.log(inputMessage.val());
    if(inputMessage.val().trim().length === 0){
        return;
    }

    // Enviar información
    socket.emit('sendMessage', {
        msg: inputMessage.val()
    }, function(msg) {
        inputMessage.val('').focus();
        renderMessages(msg, true);
        scrollBotom();
    });
});

function renderMessages(msg, me){
    var html = '';
    var date = new Date(msg.date);
    var hour = date.getHours() + ':' + date.getMinutes();
    var adminClass = 'info';
    if(msg.name === 'Administrador'){
        adminClass = 'danger';
    }

    if(me){
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+ msg.name +'</h5>';
        html += '        <div class="box bg-light-inverse">'+ msg.msg +'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+ hour +'</div>';
        html += '</li>';
    }else{
        html += '<li class="animated fadeIn">';
        if(msg.name != 'Administrador'){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>'+ msg.name +'</h5>';
        html += '        <div class="box bg-light-'+ adminClass +'">'+ msg.msg +'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+ hour +'</div>';
        html += '</li>';
    }

    chatbox.append(html);
}

function scrollBotom(){
    var newMessage = chatbox.children('li:last-child');
    var clientHeight = chatbox.prop('clientHeight');
    var scrollTop = chatbox.prop('scrollTop');
    var scrollHeight = chatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        chatbox.scrollTop(scrollHeight);
    }
}