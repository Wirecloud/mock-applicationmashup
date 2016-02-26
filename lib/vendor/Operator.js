import Context from "./Context";
import Endpoint from "./Endpoint";

const spyOn = window.spyOn;

export default class Operator {
    constructor(options = {}, extra = {}) {
        this._extra = extra;
        this.context = new Context();
        this.resetData();
        this.setSpies();
    }

    setSpies() {
        spyOn(this, "createInputEndpoint").and.callThrough();
        spyOn(this, "createOutputEndpoint").and.callThrough();
        spyOn(this, "log").and.callThrough();
    }

    reset() {
        this.createInputEndpoint.calls.reset();
        this.createOutputEndpoint.calls.reset();
        this.log.calls.reset();
    }

    resetData() {
        this.id = this._extra.id || "";
        if (this._extra.inputs !== undefined) {
            this.inputs = this._createEndpointFromNames(this._extra.inputs);
        } else {
            this.inputs = {};
        }

        if (this._extra.outputs !== undefined) {
            this.outputs = this._createEndpointFromNames(this._extra.outputs);
        } else {
            this.outputs = {};
        }
    }

    createInputEndpoint() {
        // Does this return an endpoint?
        // If don't I don't see it useful, because it can't be connected programatically
    }

    createOutputEndpoint() {
        // Can this be connected programatically?
    }

    log(msg, level) {
        window.console.log(msg, level);
    }

    /*
     * Auxiliars
     */

    _createEndpointFromNames(names) {
        return names.map(x => {
            return {name: x, value: new Endpoint(x)};
        }).reduce((acc, ac) => {
            acc[ac.name] = ac.value;
            return acc;
        }, {});
    }


    setId(id = "") {
        this.id = id;
    }

    setInputEndpoints(endps) {
        this.inputs = this._createEndpointFromNames(endps);
    }

    setDefaultInputEndpoints(endps) {
        this._extra.inputs = endps;
        this.setInputEndpoints(endps);
    }

    setOutputEndpoints(endps) {
        this.outputs = this._createEndpointFromNames(endps);
    }

    setDefaultOutputEndpoints(endps) {
        this._extra.outputs = endps;
        this.setOutputEndpoints(endps);
    }
}
