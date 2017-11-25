import {SimpleCallback} from "./Callback";

const spyOn = window.spyOn;

export default class Endpoint extends SimpleCallback {
    constructor() {
        super();
        this.setSpies();
        this.resetData();
    }

    setSpies() {
        spyOn(this, "connect").and.callThrough();
        spyOn(this, "disconnect").and.callThrough();
        spyOn(this, "pushEvent").and.callThrough();
    }

    reset() {
        this.connect.calls.reset();
        this.disconnect.calls.reset();
        this.pushEvent.calls.reset();
        this.resetData();
    }

    resetData() {
        this._connections = [];
    }

    get connected() {
        return this._connections.length > 0;
    }

    connect(endp) {
        this._connections = [...this._connections, endp];
    }

    disconnect(endp) {
        if (endp === undefined) {
            this._connections = [];
        } else {
            this._connections = this._connections.filter(x => x !== endp);
        }
    }

    pushEvent(data) {
        this._connections.forEach(x => x.simulate(data));
    }
}
