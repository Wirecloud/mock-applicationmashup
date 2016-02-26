import Context from "./Context";
import Mashup from "./Mashup";
import Preferences from "./Preferences";
import Operator from "./Operator";
import Wiring from "./Wiring";
import Http from "./Http";
import Widget from "./Widget";

export default class MockMP {
    constructor(options = {}) {
        this.http = new Http();
        this.prefs = new Preferences();
        this.mashup = new Mashup();
        this.wiring = new Wiring();
        this.context = new Context();
        this.log = {
            ERROR: 0,
            WARN: 1,
            INFO: 2
        };

        let obj;

        // Decide if the MP will be for an operator or a widget
        if ("type" in options && options.type === "operator") {
            this.operator = new Operator();
            this.__allReseteable = [this.operator];
            obj = this.operator;
        } else {  // By default widget
            this.widget = new Widget();
            this.__allReseteable = [this.widget];
            obj = this.widget;
        }

        // Set default options
        if ("inputs" in options) {
            this.wiring.setDefaultInputEndpoints(options.inputs);
            obj.setDefaultInputEndpoints(options.inputs);
        }

        if ("outputs" in options) {
            this.wiring.setDefaultOutputEndpoints(options.outputs);
            obj.setDefaultOutputEndpoints(options.outputs);
        }

        if ("prefs" in options) {
            this.prefs.setDefaultPreferences(options.prefs);
        }

        if ("context" in options) {
            this.context.setDefaultContext(options.context);
        }

        this.__allReseteable = [...this.__allReseteable, this.http, this.prefs, this.mashup, this.wiring, this.context];
    }

    reset() {
        this.__allReseteable.forEach(x => x.reset());
    }

    resetData() {
        this.__allReseteable.forEach(x => x.resetData());
    }

    resetAll() {
        this.__allReseteable.forEach(x => {
            x.reset();
            x.resetData();
        });
    }
}

window.MockMP = MockMP;

// const namespace = {
//     MockMP
// };

// window.MockMP = namespace;

// export default namespace;
