//  http://conwet.fi.upm.es/docs/display/wirecloud/Javascript+API

// set namespace
var MockMP = {};

(function (namespace) {

    "use strict";


    var EndpointTypeError = function EndpointTypeError(message) {
        this.name = "EndpointTypeError";
        this.message = message || "";
    };
    EndpointTypeError.prototype = new Error();
    EndpointTypeError.prototype.constructor = EndpointTypeError;

    var EndpointValueError = function EndpointValueError(message) {
        this.name = "EndpointValueError";
        this.message = message || "";
    };
    EndpointValueError.prototype = new Error();
    EndpointValueError.prototype.constructor = EndpointValueError;


    var ConstantStrategy = function ConstantStrategy(value) {
        return function () {
            return value;
        };
    };

    var DictStrategy = function DictStrategy(dict) {
        if (typeof dict !== 'object') {
            throw new TypeError('dict must be an object');
        }

        return function (key) {
            return dict[key];
        };
    };

    var ExceptionStrategy = function ExceptionStrategy(ExceptionClass) {
        return function (msg) {
            if (typeof msg !== "undefined") {
                throw new ExceptionClass(msg);
            } else {
                throw new ExceptionClass();
            }
        };
    };



    namespace.strategy = Object.freeze({
        constant: ConstantStrategy,
        dict: DictStrategy,
        exception: ExceptionStrategy
    });

    namespace.MockMP = function MockMP(methodValues) {
        this.spySet = [];
        this.defaultValues = methodValues || {};
        this.callbacks = {
            'prefs': {'': []},
            'widget': {'': []},
            'wiring':  {'': []}
        };
        this.map = {
            attributes: [],
            objects: {
                http: {
                    attributes: [],
                    objects: {},
                    spies: ["buildProxyURL", "makeRequest"]
                },
                wiring: {
                    attributes: [],
                    objects: {},
                    spies: ["pushEvent", "registerCallback", "getReachableEndpoints", "EndpointTypeError", "EndpointValueError"]
                },
                prefs: {
                    attributes: [],
                    objects: {},
                    spies: ["get", "set", "registerCallback"]
                },
                widget: {
                    attributes: ['id'],
                    objects: {
                        'context': {
                            attributes: [],
                            objects: {},
                            spies: ['get', 'registerCallback']
                        }
                    },
                    spies: ["getVariable", "drawAttention", "log"]
                },
                context: {
                    attributes: [],
                    objects: {},
                    spies: ["get"]
                },
                log: {
                    attributes: ['ERROR', 'WARN', 'INFO'],
                    objects: {},
                    spies: []
                },
                mashup: {
                    attributes: [],
                    objects: {
                        "context": {
                            attributes: [],
                            objects: {},
                            spies: ['get']
                        }
                    },
                    spies: []
                }
            },
            spies: []
        };
        this.setStrategy.call(this, methodValues);
    };

    namespace.MockMP.prototype.reset = function reset(spyList) {
        // Get back to the default values

        // Clean callbacks
        this.callbacks = {
            'prefs': {'': []},
            'widget': {'': []},
            'wiring': {'': []}
        };
        if (typeof this.defaultValues === 'undefined' || typeof this.defaultValues !== 'object') {
            this.defaultValues = {};
        }
        var defaultValues = this.defaultValues;
        this.setStrategy.call(this, defaultValues);
    };

    namespace.MockMP.prototype.setStrategy = function setStrategy(methodValues) {
        mergeDefault.call(this, methodValues);
        createMocks.call(this);
    };

    namespace.MockMP.prototype.simulateReceiveEvent = function simulateReceiveEvent(name, value) {
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        _call_callbacks.call(this, 'wiring', name, value, true);
    };

    namespace.MockMP.prototype.simulateReceiveContext = function simulateReceiveContext(name, values) {
        var single_o = false;
        if (typeof values === 'undefined') {
            values = name;
            name = '';
            single_o = true;
        }
        _call_callbacks.call(this, 'widget', name, values, single_o);
    };

    namespace.MockMP.prototype.simulateReceivePrefs = function simulateReceivePrefs(name, values) {
        var single_o = false;
        if (typeof values === 'undefined') {
            values = name;
            name = '';
            single_o = true;
        }
        _call_callbacks.call(this, 'prefs', name, values, single_o);
    };


    /*****************************************************************************/
    /********************************** Private **********************************/
    /*****************************************************************************/

    var default_preferences_set = function default_preferences_set(name, value) {
        /* istanbul ignore next: This function is private, shouldn't be called outside */
        if (this.methodValues && this.methodValues['prefs.get']) {
            var old_f = this.methodValues['prefs.get'];
            this.methodValues['prefs.get'] = function (name2) {
                if (name2 === name) {
                    return value;
                } else {  // fallback
                    return old_f.call(this, name2);
                }
            };
            this.spySet = [];
            _createSpies.call(this, "", this, this.map);
        } else {
            var newdict = {};
            newdict[name] = value;
            this.methodValues['prefs.get'] = namespace.strategy.dict(newdict);
        }
        _call_callbacks.call(this, 'prefs', name, value);
        return null;
    };

    var default_register_callback = function default_register_callback(name) {
        var valid_names = ['prefs', 'widget', 'wiring'];
        /* istanbul ignore next: This function is private, shouldn't be called outside */
        if (valid_names.indexOf(name) == -1) {
            throw new TypeError('You are trying to register in a non existant name: ' + name);
        }

        return function (setted, cb) {
            _initialize_callbacks.call(this);

            if (typeof cb === 'undefined' || !cb) {
                cb = setted;
                setted = '';
            }

            if (typeof cb !== 'function') {
                throw new TypeError('callback must be a function');
            }

            if (typeof this.callbacks[name][setted] === 'undefined') {
                this.callbacks[name][setted] = [];
            }
            this.callbacks[name][setted].push(cb);
            return null;
        };
    };

    var _initialize_callbacks = function _initialize_callbacks() {
        if (typeof this.callbacks === 'undefined' || !this.callbacks) {
            this.callbacks = {
                'prefs': {'': []},
                'widget': {'': []},
                'wiring': {'': []}
            };
        }
    };

    var _call_callbacks = function _call_callbacks(cname, vname, value, onlyValue) {
        if (typeof onlyValue === 'undefined') {
            onlyValue = false;
        }
        var toget = vname;
        if (!onlyValue) {
            var nv = {};
            nv[vname] = value;  // Send as object
            value = nv;
            toget = '';
        }

        var calls = _get_callbacks.call(this, cname, toget);

        for (var c in calls) {
            /* istanbul ignore else: The callback initializer ensures that this will be a function */
            if (typeof calls[c] == 'function') {
                calls[c](value);
            }
        }
    };

    var _get_callbacks = function _get_callbacks(name, sname) {
        _initialize_callbacks.call(this);
        /* istanbul ignore next: This function is private, shouldn't be called outside */
        if (!this.callbacks[name]) {
            return [];
        }
        var callsn = this.callbacks[name];

        var allcalls = callsn[''] || /* istanbul ignore next: We've already initialized before */ [];
        if (typeof sname !== 'undefined' && sname !== '') {
            var speccalls = callsn[sname] || [];
            allcalls = allcalls.concat(speccalls);
        }

        return allcalls;
    };

    var default_functionality = {
        'prefs.set': default_preferences_set,
        'prefs.registerCallback': default_register_callback.call(this, 'prefs'),
        'widget.context.registerCallback': default_register_callback.call(this, 'widget'),
        'wiring.registerCallback': default_register_callback.call(this, 'wiring')
    };

    var mergeDefault = function mergeDefault(methodValues) {
        var defaultValues = {
            "context.get": namespace.strategy.constant("not set yet"),
            "http.buildProxyURL": namespace.strategy.constant(null),
            "http.makeRequest": namespace.strategy.constant(null),
            "log.ERROR": 1,
            "log.WARN": 2,
            "log.INFO": 3,
            "mashup.context.get": namespace.strategy.constant(null),
            "prefs.get": namespace.strategy.constant("value"),
            "prefs.set": default_functionality['prefs.set'].bind(this),
            "prefs.registerCallback": default_functionality['prefs.registerCallback'].bind(this),
            "widget.getVariable": namespace.strategy.constant("value"),
            "widget.drawAttention": namespace.strategy.constant(null),
            "widget.id": "id33",
            "widget.log": namespace.strategy.constant("something"),
            "widget.context.get": namespace.strategy.constant(null),
            "widget.context.registerCallback": default_functionality['widget.context.registerCallback'].bind(this),
            "wiring.getReachableEndpoints": namespace.strategy.constant([]),
            "wiring.pushEvent": namespace.strategy.constant(null),
            "wiring.EndpointTypeError": EndpointTypeError,
            "wiring.EndpointValueError": EndpointValueError,
            "wiring.registerCallback": default_functionality['wiring.registerCallback'].bind(this)
        };

        if (methodValues) {
            for (var value in methodValues) {
                defaultValues[value] = methodValues[value];
                // if (typeof methodValues[value] === 'function') {
                //     defaultValues[value] = methodValues[value];
                // } else {
                //     defaultValues[value] = namespace.strategy.constant(value);
                // }
            }
        }

        this.methodValues = defaultValues;
    };

    var _createSpies = function _createSpies(prefix, parentObject, info) {
        var methodTemp, spy, i;

        if (info.spies.length > 0) {
            for (i = 0; i < info.spies.length; i++) {
                var spyName = info.spies[i];
                methodTemp = prefix + spyName;
                spy = jasmine.createSpy(spyName).and.callFake(this.methodValues[methodTemp]);
                parentObject[spyName] = spy;
                this.spySet.push(spy);
            }
        }

        for (i = 0; i < info.attributes.length; i++) {
            methodTemp = prefix + info.attributes[i];
            parentObject[info.attributes[i]] = this.methodValues[methodTemp];
        }

        for (var objAttr in info.objects) {
            parentObject[objAttr] = {};
            _createSpies.call(this, prefix + objAttr + ".", parentObject[objAttr], info.objects[objAttr]);
        }
    };

    var createMocks = function createMocks() {
        this.spySet = [];
        _createSpies.call(this, "", this, this.map);
    };

})(MockMP);
