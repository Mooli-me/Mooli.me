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

function WS (url,nameSeed) {
    const ws = {};
    url = url || `wss://${window.location.hostname}/`;
    ws.queue = {};
    ws.socket = new WebSocket(url);
    ws.socket.onmessage = function (msg) {
        async function saveResponse (msg,ws) {
            const data = JSON.parse(msg.data);
            ws.queue[data.code] = data.obj;
        }
        saveResponse(msg,ws);
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
