import {SimpleCallback} from "./Callback";

const spyOn = window.spyOn;

export default class Context extends SimpleCallback {
    constructor(context = {}) {
        super();
        this._defaultcontext = context;
        this.context = {};
        this.setSpies();
    }

    setSpies() {
        spyOn(this, "get").and.callThrough();
        spyOn(this, "getAvailableContext").and.callThrough();
        spyOn(this, "registerCallback").and.callThrough(); // from SimpleCallback
    }

    reset() {
        this.get.calls.reset();
        this.getAvailableContext.calls.reset();
        this.registerCallback.calls.reset();
    }

    resetData() {
        this.context = Object.assign({}, this._defaultcontext) || {};
    }

    get(name) {
        return this.context[name];
    }

    getAvailableContext() {
        return this.context;
    }

    /*
     * Auxiliar
     */

    setContext(context) {
        this.context = context;
    }

    setDefaultContext(context) {
        this._defaultcontext = context;
        this.context = context;
    }
}
