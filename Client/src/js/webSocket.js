import { get } from 'svelte/store';
import { randomString } from './aux.js';
import { newIdentity, signOn, login } from '../js/aux.js';
import { identity, session } from '../js/store.js';



var socketURL;

const pongDelay = 500;
const heartbeatDelay = 5000;
const reconnectDelay = 3000;
const loginDelay = 1000;


if (window.location.hostname === "localhost") {
    socketURL = 'ws://localhost:3000/';
} else {
    socketURL = `wss://${window.location.hostname}/`;
}

function WS (url,nameSeed) {

    url = url || `wss://${window.location.hostname}/`;

    const ws = {};

    ws.heartbeat;
    ws.pendingPong;
    ws.queue = {};
    ws.tryingToConnect = false;

    ws.pushHandlers = {
        set pong(data) {
            //console.log('||| Pong arrives.');
            clearTimeout(ws.pendingPong);
            ws.heartbeat = setTimeout(ws.sendPing,heartbeatDelay);
        },
    };

    ws.connect = async function () {
        if ( ws.tryingToConnect != true ) {

            console.log('||| Connecting...');
            ws.tryingToConnect = true;
            if (ws.pendingPong) clearTimeout(ws.pendingPong);

            try {

                ws.socket = new WebSocket(url);

                ws.socket.addEventListener(
                    'open',
                    () => {
                        console.log('||| Connected.');
                        ws.tryingToConnect = false;
                        ws.sendPing();
                        ws.login();
                    }
                );

                ws.socket.addEventListener(
                    'message',
                    (msg) => {
                        const data = JSON.parse(msg.data);
                        if ( ws.queue.hasOwnProperty(data.code) ) {
                            ws.queue[data.code] = data.obj;
                            delete ws.queue[data.code];
                        } else if ( ws.pushHandlers.hasOwnProperty(data.code) ){
                            ws.pushHandlers[data.code] = data.obj;
                        } else {
                            console.error(`Unhandled message from server: ${msg.data}`)
                        }
                    }
                )
            
                ws.socket.addEventListener(
                    'error',
                    (ev) => {
                        console.log('||| ws.error: ',ev);
                        ws.socket.close();
                    }
                );
            
                ws.socket.addEventListener(
                    'close',
                    (ev) => {
                        console.log('||| ws.close: ',ev);
                        clearTimeout(ws.pendingPong);
                        ws.tryingToConnect = false;
                        setTimeout(ws.connect,reconnectDelay);
                    }
                );

            } catch (err) {

                console.error(err);
                ws.tryingToConnect = false;
                setTimeout(ws.connect,reconnectDelay);

            }
        }
    }

    ws.sendPing = async function () {
        if ( ! ws.tryingToConnect ) {
            //console.log('||| Sending ping...')
            const msg = { code: 'ping', obj: null };
            const json = JSON.stringify(msg);
            try {
                ws.socket.send(json);
                if ( ws.pendingPong ) clearTimeout(ws.pendingPong);
                ws.pendingPong = setInterval(ws.close,pongDelay);
            } catch (err) {
                console.error(err);
            }
        }
    }

    ws.sendObj = function (obj) {
        try {
            const code = randomString(20);
            const msg = { code, obj };
            const json = JSON.stringify(msg);
            if ( this.socket.readyState === 0 ) {
                this.socket.onopen = (ev)=>{
                    this.socket.send(json)
                };
            } else {
                this.socket.send(json);
            }
            return new Promise(
                (resolve,reject) => {
                    try {
                        Object.defineProperty(this.queue, code, 
                            {
                                set: function(obj) { resolve(obj) },
                                configurable: true,
                            }
                        );
                    } catch (err) {
                        console.error(err);
                        reject(err);
                    }
                }
            );
        } catch (err) {
            console.error(err);
        }
    }

    ws.addHandler = (handler)=>{
        if ( ! handler.hasOwnProperty('tag') || ! handler.hasOwnProperty('function') ) {
            console.error(`Handler must be a object {tag: string,function: function(obj)}`);
            return;
        }
        Object.defineProperty(ws.pushHandlers, handler.tag, {set: handler.function,configurable: true});
    };

    ws.login = async ()=>{
        var sessionData;
        if ( ! get(identity) ) {
            identity.set(await newIdentity());
            signOn(get(identity));
        }
        const loginResponse =  await login(get(identity));
        if ( loginResponse.ok ) {
            sessionData = get(session);
            sessionData.loggedOn = true;
            sessionData.pubIdentity = get(identity);
            session.set(sessionData);
        } else {
            setTimeout(ws.login,loginDelay);
        }

    };

    ws.connect();
    return ws;
};

export const ws = WS(socketURL);