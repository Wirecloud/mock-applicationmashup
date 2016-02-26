export class SimpleCallback {
    constructor() {
        this.calls = [];
    }

    setSpies() {
        window.spyOn(this, "registerCallback").and.callThrough();
    }

    reset() {
        this.registerCallback.calls.reset();
    }

    resetData() {
        this.calls = [];
    }

    registerCallback(f) {
        this.calls = [...this.calls, f];
    }

    simulate(...args) {
        this.calls.forEach(f => f(...args));
    }
}

export class MultipleCallback {
    constructor() {
        this.calls = {};
    }

    setSpies() {
        window.spyOn(this, "registerCallback").and.callThrough();
    }

    registerCallback(name, f) {
        if (f === undefined || !(f instanceof Function)) {
            return;
        }
        if (this.calls[name] === undefined) {
            this.calls[name] = new SimpleCallback();
        }
        this.calls[name].registerCallback(f);
    }

    simulate(name, ...args) {
        if (this.calls[name] !== undefined) {
            this.calls[name].simulate(...args);
        }
    }
}
