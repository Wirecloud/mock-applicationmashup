import Context from "./Context";
import Endpoint from "./Endpoint";

const spyOn = window.spyOn;

class Variable {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    get() {
        return this.value;
    }

    set(val) {
        this.value = val;
    }
}

export default class Widget {

    constructor(extra = {}) {
        this.context = new Context();
        this._extra = extra;

        this.resetData();
        this.setSpies();
    }

    setSpies() {
        spyOn(this, "createInputEndpoint").and.callThrough();
        spyOn(this, "createOutputEndpoint").and.callThrough();
        spyOn(this, "getVariable").and.callThrough();
        spyOn(this, "drawAttention").and.callThrough();
        spyOn(this, "log");
    }

    reset() {
        this.createInputEndpoint.calls.reset();
        this.createOutputEndpoint.calls.reset();
        this.getVariable.calls.reset();
        this.drawAttention.calls.reset();
        this.log.calls.reset();
        this.resetData();
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

        if (this._extra.variables !== undefined) {
            this.variables = this._createVariablesFromValues(this._extra.variables);
        } else {
            this.variables = {};
        }
    }

    createInputEndpoint() {
        // Does this return an endpoint?
        // If don't I don't see it useful, because it can't be connected programatically
    }

    createOutputEndpoint() {
        // Can this be connected programatically?
    }

    getVariable(name) {
        if (this.variables[name] === undefined) {
            this.variables[name] = new Variable("");
        }
        return this.variables[name];
    }

    drawAttention() {
        return;
    }

    log(msg, level) {
        window.console.log(msg, level);
    }

    /*
     * Auxiliar
     */

    _createEndpointFromNames(names) {
        return names.map(x => {
            return {name: x, value: new Endpoint(x)};
        }).reduce((acc, ac) => {
            acc[ac.name] = ac.value;
            return acc;
        }, {});
    }

    _createVariablesFromValues(values) {
        const variables = {};
        let k, v;

        for ([k, v] of Object.entries(values)) {
            variables[k] = new Variable(k, v);
        }
        return variables;
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

    setVariable(name, value) {
        this.getVariable(name).set(value);
    }
}
