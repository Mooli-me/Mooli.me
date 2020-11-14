/*
    var chatMessages = [];
    var msg = '';

    const url = 'ws://localhost:3000/'
    const connection = new WebSocket(url)
    connection.onopen = () => {
        connection.send('*** Nueva conexión ***')
    }

    function send(txt){
        connection.send(txt)
    }

    connection.onmessage = msg => {
        console.log(msg.data)
        chatMessages = [...chatMessages, msg.data];
    }
*/