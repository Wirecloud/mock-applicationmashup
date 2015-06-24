//  http://conwet.fi.upm.es/docs/display/wirecloud/Javascript+API

// set namespace
var MockMP = {};

(function (namespace) {

    "use strict";

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
        return function () {
            throw new ExceptionClass();
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
                    spies: ["pushEvent", "registerCallback", "getReachableEndpoints"]
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
        // Reset the calls.
        var spySet = this.spySet;
        if (spyList) {
            spySet = spyList;
        }
        spySet.forEach(function (spy) {
            spy.calls.reset();
        });

        // And get back to the default values
        var defaultValues = this.defaultValues || {};
        this.setStrategy.call(this, defaultValues);
    };

    namespace.MockMP.prototype.setStrategy = function setStrategy(methodValues) {
        mergeDefault.call(this, methodValues);
        createMocks.call(this);
    };


    /*****************************************************************************/
    /********************************** Private **********************************/
    /*****************************************************************************/

    var default_preferences_set = function default_preferences_set(name, value) {
        if (this.methodValues && this.methodValues['prefs.get']) {
            var old_f = this.methodValues['prefs.get'];
            this.methodValues['prefs.get'] = function(name2) {
                if (name2 === name) {
                    return value;
                } else {  // fallback
                    return old_f.call(this, name2);
                }
            };
            this.spySet = [];
            _createSpies.call(this, "", this, this.map);
        } else {
            this.methodValues['prefs.get'] = namespace.strategy.dict({name: value});
        }
        _call_callbacks.call(this, 'prefs', name, value);
        return null;
    };

    var default_functionality = {
        'prefs.set': default_functionality
    };

    var _call_callbacks = function _call_callbacks(cname, vname, value) {
        var calls = _get_callbacks('prefs');
        for(var c in calls) {
            if (typeof calls[c] == 'function') {
                calls[c]({vname: value});
            }
        }
    };

    var _get_callbacks = function _get_callbacks(name) {
        if (!this.callbacks) {
            this.callbacks = {
                'prefs': [],
                'widget': [],
                'wiring': []
            };
            return [];
        }
        if (!this.callbacks[name]) {
            return [];
        }

        return this.callbacks[name];
    };

    var mergeDefault = function mergeDefault(methodValues) {

        var defaultValues = {
            "context.get": namespace.strategy.constant("not set yet"),
            "http.buildProxyURL": namespace.strategy.constant(null),
            "http.makeRequest": namespace.strategy.constant(null),
            "log.ERROR": 1,
            "log.WARN": 2,
            "log.INFO": 3,
            "mashup.context.get" : namespace.strategy.constant(null),
            "prefs.get": namespace.strategy.constant("value"),
            "prefs.set": default_functionality['prefs.set'].bind(this),  // namespace.strategy.constant(null),
            "prefs.registerCallback": namespace.strategy.constant(null),
            "widget.getVariable": namespace.strategy.constant("value"),
            "widget.drawAttention": namespace.strategy.constant(null),
            "widget.id": "id33",
            "widget.log": namespace.strategy.constant("something"),
            "widget.context.get" : namespace.strategy.constant(null),
            "widget.context.registerCallback": namespace.strategy.constant(null),
            "wiring.getReachableEndpoints": namespace.strategy.constant([]),
            "wiring.pushEvent": namespace.strategy.constant(null),
            "wiring.registerCallback": namespace.strategy.constant(null)
        };

        if (methodValues) {
            for (var value in methodValues) {
                if (typeof methodValues[value] === 'function') {
                    defaultValues[value] = methodValues[value];
                } else {
                    defaultValues[value] = namespace.strategy.constant(value);
                }
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
