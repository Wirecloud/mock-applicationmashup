"use strict";

import Context from "./Context";
import Operator from "./Operator";
import Widget from "./Widget";

const spyOn = window.spyOn;

export default class Mashup {
    constructor() {
        this.context = new Context();
        this.setSpies();
    }

    setSpies() {
        spyOn(this, "addWidget").and.callThrough();
        spyOn(this, "addOperator").and.callThrough();
        spyOn(this, "createWorkspace").and.callThrough();
    }

    reset() {
        this.addWidget.calls.reset();
        this.addOperator.calls.reset();
        this.createWorkspace.calls.reset();
        this.context.reset();
    }

    resetData() {
        this.context.resetData();
    }

    addWidget(ref, options = {}) {
        return new Widget(options, this.addWidget.configure);
    }

    addOperator(ref, options = {}) {
        return new Operator(options, this.addOperator.configure);
    }

    createWorkspace() {

    }
}
