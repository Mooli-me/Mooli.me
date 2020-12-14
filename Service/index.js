const http = require('http');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const webSockets = require('ws');

const PORT = process.env.PORT || 3000;

var mongoDB
const mongoClient = require('./mongoClient.js');
mongoClient.connect()
    .then(
        client=>{
            mongoDB = client.db();
            console.log('Conected to Mongo Atlas');
        }
    ).catch(
        err=>{
            console.error(err);
        }
    );

const serviceSecret = 'tm20kQAQnv9MbEah0daZIwPW8xTrgcTSW3C/namhw2/7';

const sessionOptions = {
    secret: serviceSecret,
    resave: true,
    saveUninitialized: false,
    cookie: {},
}

/*
async function requestTemplateHandler (ws,request) {
    console.log('-> Only a template');
    const response = {
        message: '-> Only a template',
        ok: true,
    }
    ws.objSend(response);
}
*/

async function loginHandler (ws,obj,code) {
    console.log('-> Logging on');
    var object = {}
    if ( obj.hasOwnProperty('nameHash') && obj.nameHash !== null ) {
        try {
            const users = mongoDB.collection('users');
            const nameHash = obj.nameHash;
            const existentUser = await users.findOne({nameHash: nameHash});
            if ( existentUser ) {
                ws.nameHash = nameHash;
                object = {
                    message: 'Welcome!',
                    ok: true,
                }
            } else {
                object = {
                    message: 'Inexistent nameHash.',
                    ok: false,
                }
            }
        } catch (err) {
            console.error(err)
            object = {
                message: err.message,
                ok: false,
            }
        }
    } else {
        object = {
            message: 'Login request must have a "nameHash"',
            ok: false,
        }
    }
    const response = {
        code,
        obj: object,
    }
    ws.objSend(response);
}

async function signonHandler (ws,obj,code) {
    console.log('-> Signing on');
    var response = {};
    try {
        const users = mongoDB.collection('users');
        const user = {
            nameHash: obj.nameHash,
            p2pChats: [],
            m2mChats: [],
        };
        users.insertOne(user);
        response = { 
            code,
            obj: {
                message: null,
                ok: true,
            },
        };
    } catch (err) {
        console.error(err)
        response = { 
            code,
            obj: {
                message: err.message,
                ok: false,
            },
        }
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
    signon: signonHandler,
    challenge: challengeHandler,
    login: loginHandler,
    get: (ws,obj,code) => {
        console.log('-> Get');
    },
    put: (ws,obj,code) => {
        console.log('-> Put');
    },
    logout: logoutHandler,
}

const expressApp = express();

expressApp.use(express.static(__dirname + '/public'));

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

        if ( ! request.hasOwnProperty('code') || ! request.hasOwnProperty('obj')) {
            const response = {
                message: 'Your message must have a "code" and a "obj" property',
                ok: false,
            }
            ws.objSend(response);
            return;
        }

        var code = request.code;
        var obj = request.obj;

        if ( ! obj.hasOwnProperty('msgType')) {
            const response = {
                message: 'Your message must have a "msgType" property',
                ok: false,
            }
            ws.objSend(response);
            return;
        } else if ( ! messageHandlers.hasOwnProperty(obj.msgType) ) {
            const response = {
                message: `"msgType" must be one of: ${Object.keys(messageHandlers)}.`,
                ok: false,
            }
            ws.objSend(response);
            return;
        } else {
            messageHandlers[obj.msgType](ws,obj,code);
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