export class WS {
    constructor (url) {
        this.url = url || `wss://${window.location.hostname}/`;
        this.socket = new WebSocket(this.url);
    }
    sendObj (obj) {
        try {
            const json = JSON.stringify(obj);
            this.socket.send(json);
        } catch (err) {
            console.error(err);
        }
    }
};

