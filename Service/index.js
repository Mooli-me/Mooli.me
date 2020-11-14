const http = require('http');
const express = require('express');
const session = require('express-session');
const webSockets = require('ws');

const PORT = process.env.PORT || 3000;

const sessionOptions = {
    secret: 'tm20kQAQnv9MbEah0daZIwPW8xTrgcTSW3C/namhw2/7',
    resave: true,
    saveUninitialized: false,
    cookie: {},
}

async function wsCloseHandler () {
    console.log('Client disconnected')
}

async function wsMessageHandler (msg) {
    console.log(`Mensaje: ${msg}`);
    console.log('Session:', req.session);
    webSocket.send('*-> Tú dices: *********');
    webSocketServer.clients.forEach((cli)=>{
        cli.send(msg);
    })
}

async function wsConnectionHandler (ws) {
    console.log('Client connected');
    ws.on('close', wsCloseHandler);
    ws.on('message', wsMessageHandler);
};


const expressApp = express();
expressApp.use(session(sessionOptions));

const httpServer = http.createServer(expressApp);
const webSocketsServer = new webSockets.Server({ server: httpServer });
webSocketsServer.on('connection', wsConnectionHandler)

httpServer.listen( PORT , ()=>{
    const connection = httpServer.address()
    console.log(`Address: ${connection.address} Port:${connection.port}`);
}) ;

expressApp.get('/',async (req,res)=>{
    res.send('Hi!')
})

/** 
 * Handling sessions
 * req.session.authenticated = validates;
*/
