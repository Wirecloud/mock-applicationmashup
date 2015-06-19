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
        this.map = {
            objects: {
                http: {
                    objects: {},
                    spies: ["buildProxyURL", "makeRequest"]
                },
                wiring: {
                    objects: {},
                    spies: ["pushEvent", "registerCallback", "getReachableEndpoints"]
                },
                prefs: {
                    objects: {},
                    spies: ["get", "set", "registerCallback"]
                },
                widget: {
                    objects: {
                        'context': {
                            objects: {},
                            spies: ['get']
                        }
                    },
                    spies: ["getVariable", "drawAttention", "log", "context"]
                },
                context: {
                    objects: {},
                    spies: ["get"]
                },
                mashup: {
                    objects: {
                        "context": {
                            objects: {},
                            spies: ['get']
                        }
                    },
                    spies: []
                }
            },
            spies: []
        };

        mergeDefault.call(this, methodValues);
        createMocks.call(this);
    };

    namespace.MockMP.prototype.reset = function reset(spyList) {
        var spySet = this.spySet;
        if (spyList) {
            spySet = spyList;
        }

        spySet.forEach(function (spy) {
            spy.calls.reset();
        });
    };

    namespace.MockMP.prototype.setStrategy = function setStrategy(methodValues) {
        mergeDefault.call(this, methodValues);
        createMocks.call(this);
    };


/*****************************************************************************/
/********************************** Private **********************************/
/*****************************************************************************/

    var mergeDefault = function mergeDefault (methodValues) {
        
        var defaultValues = {
            "context.get" : "not set yet",
            "http.buildProxyURL": null,
            "http.makeRequest": null,
            "mashup.context.get" : "not set yet",
            "prefs.get": "value",
            "prefs.set": null,
            "prefs.registerCallback": null,
            "widget.getVariable": "value",
            "widget.drawAttention": null,
            "widget.id": "id33",
            "widget.log": "something",
            "widget.context.registerCallback": null,
            "wiring.pushEvent": null,
            "wiring.registerCallback": null
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
        var methodTemp, spy;

        if (info.spies.length > 0) {
            for (var i = 0; i < info.spies.length; i++) {
                var spyName = info.spies[i];
                spy = jasmine.createSpy(spyName);
                methodTemp = prefix + spyName;
                parentObject[spyName] = spy;
                this.spySet.push(spy);
                spy.and.callFake(this.methodValues[methodTemp]);
            }
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