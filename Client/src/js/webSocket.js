var socketURL;

if (window.location.hostname === "localhost") {
    socketURL = 'ws://localhost:3000/';
} else {
    socketURL = `wss://${window.location.hostname}/`;
}

function randomString(len) {
    const randomData = new Uint8Array(20);
    crypto.getRandomValues(randomData);
    const randomBuffer = Buffer.from(randomData);
    const code = randomBuffer.toString('hex');
    return code;
}

/*function pushMessagesHandler (obj) {
    const handlers = {};
    console.log(obj) 
    // Add push handler to ws object with personalizable handler object list/events
}*/

function WS (url,nameSeed) {
    const ws = {};
    url = url || `wss://${window.location.hostname}/`;
    /*ws.queue = {
        set updates(obj) { 
            pushMessagesHandler(obj);
        },
    };*/
    ws.queue = {};
    ws.pushHandlers = {};
    ws.addHandler = (handler)=>{
        
        if ( ! handler.hasOwnProperty('tag') || ! handler.hasOwnProperty('function') ) {
            console.error(`Handler must be a object {tag: string,function: function(obj)}`);
            return;
        }

        Object.defineProperty(ws.pushHandlers, handler.tag, 
            {
                set: handler.function,
            }
        );
    };
    ws.socket = new WebSocket(url);
    ws.socket.onmessage = function (msg) {
        /*async function saveResponse (msg,ws) {
            const data = JSON.parse(msg.data);
            ws.queue[data.code] = data.obj;
        }*/
        const data = JSON.parse(msg.data);
        if ( ws.queue.hasOwnProperty(data.code) ) {
            //saveResponse(msg,ws);
            ws.queue[data.code] = data.obj;
        } else if ( ws.pushHandlers.hasOwnProperty(data.code) ){
            ws.pushHandlers[data.code] = data.obj;
        } else {
            console.error(`Unhandled message from server: ${msg.data}`)
        }
    };
    ws.sendObj = function (obj) {
        try {
            const code = randomString(20);
            const msg = { code, obj };
            const json = JSON.stringify(msg);
            this.socket.send(json);
            return new Promise(
                (resolve,reject) => {
                    try {
                        Object.defineProperty(this.queue, code, 
                            {
                                set: function(obj) { resolve(obj) },
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

    return ws;
};

export const ws = WS(socketURL);
