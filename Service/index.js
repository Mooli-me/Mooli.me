const http = require('http');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const webSockets = require('ws');

const PORT = process.env.PORT || 3000;

const serviceSecret = 'tm20kQAQnv9MbEah0daZIwPW8xTrgcTSW3C/namhw2/7';

const sessionOptions = {
    secret: serviceSecret,
    resave: true,
    saveUninitialized: false,
    cookie: {},
}

async function requestTemplateHandler (ws,request) {
    console.log('-> Only a template');
    const response = {
        message: '-> Only a template',
        ok: true,
    }
    ws.objSend(response);
}

async function challengeHandler (ws,request) {
    console.log('-> Challenge request');
    const challenge = crypto.createHash('sha1').update(`${Date.now().toString()}${serviceSecret}`).digest('base64');
    const response = {
        message: challenge,
        ok: true,
    }
    ws.objSend(response);
}

async function logoutHandler (ws,request) {
    console.log('-> Logout');
    const response = {
        message: null,
        ok: true,
    }
    ws.objSend(response);
    console.log('<- Closing socket');
    ws.close();
}

const messageHandlers = {
    signon: (ws,request) => {
        console.log('-> Signing on');
    },
    challenge: challengeHandler,
    login: (ws,request) => {
        console.log('-> Logging in');
    },
    get: (ws,request) => {
        console.log('-> Get');
    },
    put: (ws,request) => {
        console.log('-> Put');
    },
    logout: logoutHandler,
}

const expressApp = express();
expressApp.use(session(sessionOptions));

const httpServer = http.createServer(expressApp);
const webSocketsServer = new webSockets.Server({ server: httpServer });

webSocketsServer.on('connection', async (ws) => {

    ws.objSend = function (response) {
        this.send(JSON.stringify(response));
    }

    console.log('-> Client connected');

    ws.on('close', () =>  console.log('X- Client leaves') );

    ws.on('message', (msg) => {

        var request;

        try {
            request = JSON.parse(msg);
        } catch (err) {
            const response = {
                message: 'Your message is not valid JSON',
                ok: false,
            }
            ws.objSend(response);
            return;
        }

        if ( ! request.hasOwnProperty('msgType')) {
            const response = {
                message: 'Your message must have a "msgType" property',
                ok: false,
            }
            ws.objSend(response);
            return;
        } else if ( ! messageHandlers.hasOwnProperty(request.msgType) ) {
            const response = {
                message: `"msgType" must be one of: ${Object.keys(messageHandlers)}.`,
                ok: false,
            }
            ws.objSend(response);
            return;
        } else {
            messageHandlers[request.msgType](ws,request);
        }
        /**
         * Sending messages:
         * webSocketsServer.clients.forEach((cli)=>{
         *     cli.send(`Every body: ${msg}`);
         * })
         */
    });

})

httpServer.listen( PORT , ()=>{
    const connection = httpServer.address()
    console.log(`Address: ${connection.address} Port:${connection.port}`);
}) ;

expressApp.get('/',async (req,res)=>{
    res.send('Hi!')
})
