const http = require('http');
const crypto = require('crypto');
const express = require('express');
//const session = require('express-session');
const webSockets = require('ws');

const PORT = process.env.PORT || 3000;

var mongoDB;
const mongoClient = require('./mongoClient.js');
const ObjectID = require("mongodb").ObjectID;

mongoClient.connect()
    .then(
        client=>{
            mongoDB = client.db();
            console.log('Conected to Mongo Atlas');
            createWatchers();
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

async function sendMessagesUpdateNotification (updateObject) {
    
    const chats = mongoDB.collection('chats');

    var peers = [];

    const update = {
        type: updateObject.ns.coll,
        doc: updateObject.fullDocument,
    };

    const destination = updateObject.fullDocument.destination;
    const destinationChat = updateObject.fullDocument.chat;
    const destType = updateObject.fullDocument.destType;
    const sender = updateObject.fullDocument.user;
    const chat = await chats.findOne({id: destinationChat});

    switch (destType) {
        case 'm2m':
            peers = [...chat.peers, chat.owner];
            break;
        case 'p2p':
            peers = [sender, chat.owner, destination];
            break;
        default:
            console.error('*** Unknown message destination type on push update');
    }

    const involvedSessions = new Set()

    sessions.forEach(
        (id,ws)=>{
            if ( peers.includes(id) ) {
                involvedSessions.add( ws );
            }
        }
    )

    const message = {
        code: 'updates',
        obj: update,
    }

    involvedSessions.forEach(
        (ws)=>{
            ws.objSend(message);
        }
    )

    console.log('-> Background notification');
    console.log(` |-> Message to chat: ${destinationChat} `);

}

async function sendChatsUpdateNotification (updateObject) {

    var peers = [];
    var logMessageChatId = '';

    const update = {
        type: 'chats',
    };

    switch (updateObject.operationType) {
        case 'insert':
            logMessageChatId = updateObject.fullDocument.id;
            peers = [
                updateObject.fullDocument.owner,
                ...updateObject.fullDocument.peers,
                ...updateObject.fullDocument.peerRequests
            ];
            update.doc = updateObject.fullDocument;
            break;
    
        case 'update':
            const chats = mongoDB.collection('chats');
            const chat = await chats.findOne({_id: ObjectID(updateObject.documentKey._id)});
            logMessageChatId = chat.id;
            peers = [
                chat.owner,
                ...chat.peers,
                ...chat.peerRequests
            ];
            update.doc = chat;
            break;
        
        default:
            console.error('*** Unknown operation type in chats');
            break;
    }

    const involvedSessions = new Set()

    sessions.forEach(
        (id,ws)=>{
            if ( peers.includes(id) ) {
                involvedSessions.add( ws );
            }
        }
    )

    const message = {
        code: 'updates',
        obj: update,
    }

    involvedSessions.forEach(
        (ws)=>{
            ws.objSend(message);
        }
    )

    console.log('-> Background notification');
    console.log(` |-> Chat: ${logMessageChatId} `);

}

async function createWatchers () {
    console.log('Creating watchers');
    try {
        const messages = mongoDB.collection('messages');
        const chats = mongoDB.collection('chats');
        const messagesUpdates = messages.watch();
        const chatsUpdates = chats.watch();
        messagesUpdates.on('change',(data)=>sendMessagesUpdateNotification(data));
        chatsUpdates.on('change',(data)=>sendChatsUpdateNotification(data));
    } catch (err) {
        console.error(err.message)
    }
}

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
            messages: [],
            peerRequests: [],
            bannedIds: [],
            isPublic: true,
        };
        const user = {
            nameHash: obj.nameHash,
            chats: [chat.id],
        };
        await chats.insertOne(chat);
        await users.insertOne(user);
        response = { 
            code,
            obj: {
                message: {
                    chats: [
                        chat,
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


async function chatAccessHandler (ws,obj,code) {

    console.log('-> Chat Access request');

    try {

        if ( ! sessions.has(ws) ) {
            console.log('  |-> User is not identified.');
            response = {
                code,
                obj: {
                    message: 'You are not identified',
                    ok: false,
                }
            };
            ws.objSend(response);
            return;
        };

        const chats = mongoDB.collection('chats');
        const messages = mongoDB.collection('messages');
        var response = {code}
        const nameHash = sessions.get(ws);

        console.log(`  |-> nameHash: ${nameHash}`);

        const chat = await chats.findOne({id: obj.chat},{projection: {_id: 0}});

        if ( chat === null ) {
            console.log(`  |-> Nonexistent chat`);
            response.obj = {
                message: `unknown`,
                ok: true,
            };
            ws.objSend(response);
            return;
        };

        console.log(`  |-> chat: ${obj.chat}`);

        if ( chat.bannedIds.includes(nameHash) ) {
            console.log(`  |-> Banned id`);
            response.obj = {
                message: `You are banned in ${obj.chat}.`,
                ok: false,
            };
            ws.objSend(response);
            return;
        }

        if ( chat.owner === nameHash || chat.peers.includes(nameHash)) {
            response.obj = {
                message: `granted`,
                ok: true,
            };
            ws.objSend(response);
            return;
        } else if (chat.isPublic === true) {
            const peers = [...chat.peers, nameHash];
            const update = await chats.updateOne({id:chat.id},{ $set:{peers} });
            if ( update.result.nModified === 1 ) {
                response.obj = {
                    message: `granted`,
                    ok: true,
                };
                ws.objSend(response);
                console.log(`  |-> Access granted to public group.`);
                return;
            }
        } else {
            if ( ! chat.peerRequests.includes(nameHash) ) {
                const peerRequests = [...chat.peerRequests, nameHash];
                const update = await chats.updateOne({id:chat.id},{ $set:{peerRequests} });
                if ( update.result.nModified === 1 ) {
                    console.log(`  |-> Access request added. Await.`);
                }
            } else {
                console.log(`  |-> Allready in access requests list.`);
            };
            response.obj = {
                message: `await`,
                ok: true,
            };
            ws.objSend(response);
            return;
        }
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

    response.obj = {
        message: '...',
        ok: true,
    };
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
                message: 'You are not identified',
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

        //user = await users.findOne({nameHash},{projection: {_id: 0}});
        const ownedChats = await chats.find({owner: nameHash}).toArray();
        const authorizedChats = await chats.find({peers: nameHash}).toArray();
        const userChats = [...ownedChats, ...authorizedChats];
        userChatsPromises = userChats.map(
            async chat => {
                var chatMessages;
                switch (chat.type) {
                    case 'p2p':
                        if (chat.owner === nameHash) {
                            chatMessages = await messages.find({chat: chat.id},{projection: {_id: 0}}).toArray();
                        } else {
                            chatMessages = await messages.find({chat: chat.id, $or: [{destination: nameHash}, {user: nameHash}]},{projection: {_id: 0}}).toArray();
                        }
                        break;
                    case 'm2m':
                        chatMessages = await messages.find({chat: chat.id},{projection: {_id: 0}}).toArray();
                        break;
                    default:
                        break;
                }
                chat.messages = chatMessages;
                return chat;
            }
        );
        const chatsAndMessages = [...await Promise.all(userChatsPromises)];

        response = {
            code,
            obj: {
                message: chatsAndMessages,
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

async function putHandler (ws,obj,code) {

    console.log('-> Put');

    var response = {};

    try {

        const messages = mongoDB.collection('messages');

        const document = {...obj.msg}
        document.user = sessions.get(ws);
        document.time = Date.now();

        messages.insertOne(document);

        response = {
            message: null,
            ok: true,
        };

        console.log(` |-> ${document.chat}`);
        console.log(` |-> ${document.user}`);

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

    ws.objSend({ code, response });
}

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
    chatAccess: chatAccessHandler,
    get: getHandler,
    put: putHandler,
    logout: logoutHandler,
}

const expressApp = express();

expressApp.use('/static/',express.static(__dirname + '/public/static/'));
expressApp.use('/css/',express.static(__dirname + '/public/css/'));
expressApp.use('/fonts/',express.static(__dirname + '/public/fonts/'));
expressApp.use('/js/',express.static(__dirname + '/public/js/'));

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


expressApp.get('/index.html', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
expressApp.get('/manifest.json', function(req, res) {
    res.sendFile(__dirname + '/public/manifest.json');
});
expressApp.get('/service-worker.js', function(req, res) {
    res.sendFile(__dirname + '/public/service-worker.js');
});
expressApp.get('/service-worker.js.map', function(req, res) {
    res.sendFile(__dirname + '/public/service-worker.js.map');
});
expressApp.get(/^\/.*\/js\/app\.js$/, function(req, res) {
    res.sendFile(__dirname + '/public/js/app.js');
});
expressApp.get(/^\/.*\/js\/app\.js\.map$/, function(req, res) {
    res.sendFile(__dirname + '/public/js/app.js.map');
});
expressApp.get(/^\/.*\/css\/app\.css$/, function(req, res) {
    res.sendFile(__dirname + '/public/css/app.css');
});
expressApp.get(/^\/.*\/css\/app\.css\.map$/, function(req, res) {
    res.sendFile(__dirname + '/public/css/app.css.map');
});
expressApp.get(/^\/.*\/fonts\/Framework7Icons-Regular\.ttf$/, function(req, res) {
    res.sendFile(__dirname + '/public/fonts/Framework7Icons-Regular.ttf');
});
expressApp.get(/^\/.*\/fonts\/Framework7Icons-Regular\.woff$/, function(req, res) {
    res.sendFile(__dirname + '/public/fonts/Framework7Icons-Regular.woff');
});
expressApp.get(/^\/.*\/fonts\/Framework7Icons-Regular\.woff2$/, function(req, res) {
    res.sendFile(__dirname + '/public/fonts/Framework7Icons-Regular.woff2');
});
expressApp.get(/^\/.*\/fonts\/MaterialIcons-Regular\.ttf$/, function(req, res) {
    res.sendFile(__dirname + '/public/fonts/MaterialIcons-Regular.ttf');
});
expressApp.get(/^\/.*\/fonts\/MaterialIcons-Regular\.woff$/, function(req, res) {
    res.sendFile(__dirname + '/public/fonts/MaterialIcons-Regular.woff');
});
expressApp.get(/^\/.*\/fonts\/MaterialIcons-Regular\.woff2$/, function(req, res) {
    res.sendFile(__dirname + '/public/fonts/MaterialIcons-Regular.woff2');
});
expressApp.get(/.*/, function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

httpServer.listen( PORT , ()=>{
    const connection = httpServer.address()
    console.log(`Address: ${connection.address} Port:${connection.port}`);
}) ;