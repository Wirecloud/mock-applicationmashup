"use strict";

const spyOn = window.spyOn;

export default class Http {
    constructor() {
        this.setSpies();
    }

    setSpies() {
        spyOn(this, "buildProxyURL").and.callThrough();
        spyOn(this, "makeRequest").and.callThrough();
    }

    reset() {
        this.buildProxyURL.calls.reset();
        this.makeRequest.calls.reset();
    }

    resetData() { // To not break, but maybe useful in some way

    }

    buildProxyURL(url) {
        return url;
    }

    makeRequest() {
    }
}
