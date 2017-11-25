import {SimpleCallback} from "./Callback";

const spyOn = window.spyOn;

class PreferenceDoesNotExistError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = "PreferenceDoesNotExistError";
    }
}

export default class Preferences extends SimpleCallback {
    constructor() {
        super();
        this.PreferenceDoesNotExistError = PreferenceDoesNotExistError;
        this.resetData();
        this.setSpies();
    }

    setSpies() {
        spyOn(this, "set").and.callThrough();
        spyOn(this, "get").and.callThrough();
        spyOn(this, "registerCallback").and.callThrough();
    }

    reset() {
        this.set.calls.reset();
        this.get.calls.reset();
        this.registerCallback.calls.reset();
        this.resetData();
    }

    resetData() {
        this.prefs = Object.assign({}, this._defaultprefs) || {};
    }

    set(name, value) {
        this.prefs[name] = value;
    }

    get(name) {
        if (this.prefs[name] === undefined) {
            throw new PreferenceDoesNotExistError(`Preference ${name} does not exist`);
        }
        return this.prefs[name];
    }

    /*
     * Overload
     */

    simulate(obj) {
        let k;

        for (k of Object.keys(obj)) {
            this.set(k, obj[k]);
        }
        super.simulate(obj);
    }

    /*
     * Auxiliars
     */

    setPreferences(prefs) {
        this.prefs = prefs;
    }

    setDefaultPreferences(prefs) {
        this._defaultprefs = prefs;
        this.setPreferences(prefs);
    }
}
