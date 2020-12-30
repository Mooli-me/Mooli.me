const http = require('http');
const crypto = require('crypto');
const express = require('express');
//const session = require('express-session');
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

const sessions = new Map();

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
            if ( existentUser !== null ) {
                sessions.set(ws, nameHash);
                console.log('  |-> Welcome');
                console.log(`  |-> nameHash: ${nameHash}`)
                object = {
                    message: 'Welcome!',
                    ok: true,
                }
            } else {
                console.log('  |-> Provides inexistent nameHash')
                object = {
                    message: 'Inexistent nameHash',
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
        console.log('  |-> Provides not nameHash')
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
        const chats = mongoDB.collection('chats');
        const chat = {
            id: crypto.createHash('sha1').update(`${Date.now().toString()}${serviceSecret}`).digest('base64').slice(0,5),
            owner: obj.nameHash,
            type: 'p2p',
            peers: [],
            peerRequests: [],
            bannedIds: [],
        };
        const user = {
            nameHash: obj.nameHash,
            chats: [chat.id],
        };
        chats.insertOne(chat);
        users.insertOne(user);
        response = { 
            code,
            obj: {
                message: {
                    chats: [
                        {
                            id: user.chats,
                            messages: [],
                            type: 'p2p',
                        },
                    ],
                },
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

async function challengeHandler (ws,obj,code) {
    console.log('-> Challenge request');
    const challenge = crypto.createHash('sha1').update(`${Date.now().toString()}${serviceSecret}`).digest('base64');
    const object = {
        message: challenge,
        ok: true,
    };
    const response = { code, object };
    ws.objSend(response);
}

async function getHandler (ws,obj,code) {

    var response = {};
    var user = null;
    var userChatsPromises = [];
    var userChats = [];
    var nameHash = null;

    console.log('-> Get');

    if ( ! sessions.has(ws) ) {
        console.log('  |-> User is not identified.');
        response = {
            code,
            obj: {
                messeage: 'You are not identified',
                ok: false,
            }
        };
        ws.objSend(response);
        return;
    };

    try {
        nameHash = sessions.get(ws);
        console.log(`  |-> nameHash: ${nameHash}`)

        const users = mongoDB.collection('users');
        const chats = mongoDB.collection('chats');
        const messages = mongoDB.collection('messages');
        
        user = await users.findOne({nameHash},{projection: {chats: 1, _id: 0}});
        userChatsPromises = user.chats.map(
            async chatId => {
                const chat = await chats.findOne({id: chatId},{projection: {type: 1, _id: 0, }})
                const chatType = chat.type;
                const chatMessages = await messages.find({chat: chatId},{projection: {user:1, time: 1, content: 1, type: 1, _id: 0}}).toArray();
                return {
                    id: chatId,
                    messages: chatMessages,
                    type: chatType,
                };
            }

        );
        userChats = await Promise.all(userChatsPromises);

        response = {
            code,
            obj: {
                message: userChats,
                ok: true,
            }
        };

    } catch (err) {

        console.error(err);

        response = { 
            code,
            obj: {
                message: err.message,
                ok: false,
            },
        }
    }

    ws.objSend(response);
};

async function logoutHandler (ws,request,code) {
    console.log('-> Logout');
    const object = {
        message: null,
        ok: true,
    };
    const response = { code, object };
    ws.objSend(response);
    console.log('<- Closing socket');
    ws.close();
}

const messageHandlers = {
    signon: signonHandler,
    challenge: challengeHandler,
    login: loginHandler,
    get: getHandler,
    put: (ws,obj,code) => {
        console.log('-> Put');
    },
    logout: logoutHandler,
}

const expressApp = express();

expressApp.use(express.static(__dirname + '/public'));

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