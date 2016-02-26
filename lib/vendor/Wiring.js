import {SimpleCallback} from "./Callback";
import Endpoint from "./Endpoint";

const spyOn = window.spyOn;

class EndpointTypeError extends Error {
    constructor(message = "") {
        super(message);
        this.message = message;
        this.name = "EndpointTypeError";
    }
}

class EndpointValueError extends Error {
    constructor(message = "") {
        super(message);
        this.message = message;
        this.name = "EndpointValueError";
    }
}

class EndpointDoesNotExistError extends Error {
    constructor(message = "") {
        super(message);
        this.message = message;
        this.name = "EndpointDoesNotExistError";
    }
}

export default class Wiring {
    constructor() {
        this.EndpointTypeError = EndpointTypeError;
        this.EndpointValueError = EndpointValueError;
        this.EndpointDoesNotExistError = EndpointDoesNotExistError;

        this._statuscalls = new SimpleCallback();

        this._defaultIns = [];
        this._defaultOuts = [];

        this.setSpies();
        this.resetData();
    }

    setSpies() {
        spyOn(this, "hasInputConnections").and.callThrough();
        spyOn(this, "hasOutputConnections").and.callThrough();
        spyOn(this, "pushEvent").and.callThrough();
        spyOn(this, "registerCallback").and.callThrough();
        spyOn(this, "registerStatusCallback").and.callThrough();
        this._statuscalls.setSpies();
    }

    reset() {
        this.hasInputConnections.calls.reset();
        this.hasOutputConnections.calls.reset();
        this.pushEvent.calls.reset();
        this.registerCallback.calls.reset();
        this.registerStatusCallback.calls.reset();
        this._statuscalls.reset();
    }

    resetData() {
        this.ins = {};
        /* istanbul ignore else: sanity check */
        if (this._defaultIns !== undefined) {
            this.setInputEndpoints(this._defaultIns);
        }


        this.outs = {};
        /* istanbul ignore else: sanity check */
        if (this._defaultOuts !== undefined) {
            this.setOutputEndpoints(this._defaultOuts);
        }

        this._statuscalls.resetData();
    }

    hasInputConnections(name) {
        if (this.ins[name] === undefined) {
            throw new EndpointDoesNotExistError();
        }
        return this.ins[name].connected;
    }

    hasOutputConnections(name) {
        if (this.outs[name] === undefined) {
            throw new EndpointDoesNotExistError();
        }
        return this.outs[name].connected;
    }

    pushEvent(name, data) {
        if (this.outs[name] === undefined) {
            throw new EndpointDoesNotExistError();
        }
        this.outs[name].pushEvent(data);
    }

    registerCallback(name, f) {
        if (this.ins[name] === undefined) {
            throw new EndpointDoesNotExistError();
        }
        this.ins[name].registerCallback(f);
    }

    registerStatusCallback(f) {
        this._statuscalls.registerCallback(f);
    }

    /*
     * Auxiliar
     */

    simulate(name, ...args) {
        if (this.ins[name] === undefined) {
            window.console.log(`Input endpoint ${name} does not exist`);
            return;
        }
        this.ins[name].simulate(...args);
    }

    setInputEndpoints(enps) {
        let x;

        for (x of enps) {
            this.ins[x] = new Endpoint();
        }
    }

    setDefaultInputEndpoints(enps) {
        this._defaultIns = enps;
        this.setInputEndpoints(enps);
    }

    setOutputEndpoints(enps) {
        let x;

        for (x of enps) {
            this.outs[x] = new Endpoint();
        }
    }

    setDefaultOutputEndpoints(enps) {
        this._defaultOuts = enps;
        this.setOutputEndpoints(enps);
    }

    connectInput(name, endp) {
        if (this.ins[name] === undefined) {
            throw new EndpointDoesNotExistError();
            // this.ins[name] = new Endpoint(); // ignore?
        }
        this.ins[name].connect(endp);
        this._statuscalls.simulate();
    }

    connectOutput(name, endp) {
        if (this.outs[name] === undefined) {
            throw new EndpointDoesNotExistError();
            // this.outs[name] = new Endpoint(); // throw EndpointDoesNotExistError?
        }
        this.outs[name].connect(endp);
        this._statuscalls.simulate();
    }

    disconnectInput(name) {
        if (this.ins[name] === undefined) {
            throw new EndpointDoesNotExistError();
            // this.ins[name] = new Endpoint(); // throw EndpointDoesNotExistError?
        }
        this.ins[name].disconnect();
        this._statuscalls.simulate();
    }

    disconnectOutput(name) {
        if (this.outs[name] === undefined) {
            throw new EndpointDoesNotExistError();
            // this.outs[name] = new Endpoint(); // throw EndpointDoesNotExistError?
        }
        this.outs[name].disconnect();
        this._statuscalls.simulate();
    }
}
