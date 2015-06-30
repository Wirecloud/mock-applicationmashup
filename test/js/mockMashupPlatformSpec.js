/* global MockMP, beforeAll */

(function () {
    "use strict";

    describe("Test with default MashupPlatform", function () {
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
        });

        it("test the default values", function () {
            expect(MashupPlatform.context.get('whatever')).toBe('not set yet');
            expect(MashupPlatform.http.buildProxyURL('url', 'options')).toBeNull();
            expect(MashupPlatform.http.makeRequest('url', 'options')).toBeNull();
            expect(MashupPlatform.log.ERROR).toBe(1);
            expect(MashupPlatform.log.WARN).toBe(2);
            expect(MashupPlatform.log.INFO).toBe(3);
            expect(MashupPlatform.mashup.context.get('anycontext')).toBeNull();
            expect(MashupPlatform.prefs.get('any pref')).toBe('value');
            expect(MashupPlatform.prefs.set('any pref', 'any value')).toBeNull();
            expect(MashupPlatform.prefs.registerCallback('name', function() {})).toBeNull();
            expect(MashupPlatform.widget.getVariable('var')).toBe('value');
            expect(MashupPlatform.widget.drawAttention()).toBeNull();
            expect(MashupPlatform.widget.id).toBe('id33');
            expect(MashupPlatform.widget.log('anything')).toBe('something');
            expect(MashupPlatform.widget.context.get('this')).toBeNull();
            expect(MashupPlatform.widget.context.registerCallback('name', function() {})).toBeNull();
            expect(MashupPlatform.wiring.getReachableEndpoints()).toEqual([]);
            expect(MashupPlatform.wiring.pushEvent('this', {})).toBeNull();
            expect(MashupPlatform.wiring.registerCallback('that', function() {})).toBeNull();
        });

        it("initial values in constructor", function () {
            var oldm = window.MashupPlatform; // save old

            var preferencesValues = {
                'url': 'http://example.org',
                'name': 'anonymous'
            };
            // Construct the default values with strategies
            var values = {
                'prefs.get': MockMP.strategy.dict(preferencesValues)
            };
            // Construct the MashupPlatform with that values
            window.MashupPlatform = new MockMP.MockMP(values);

            // Our default values
            expect(MashupPlatform.prefs.get('url')).toEqual('http://example.org');
            expect(MashupPlatform.prefs.get('name')).toEqual('anonymous');

            // The other default values don't changes, only that ones that you specify in the constructor
            expect(MashupPlatform.widget.id).toBe('id33');

            window.MashupPlatform = oldm; // restore
        });

        it("Reset spies in setStrategy", function () {

            MashupPlatform.setStrategy({
                'prefs.get': MockMP.strategy.dict({
                    'name': 'registered'
                })
            });
            // new spies
            expect(MashupPlatform.prefs.get).not.toHaveBeenCalled();
            expect(MashupPlatform.prefs.get('name')).toEqual('registered');
            expect(MashupPlatform.prefs.get).toHaveBeenCalled();

            // set again the strategy
            MashupPlatform.setStrategy({
                'prefs.get': MockMP.strategy.dict({
                    'name': 'registered'
                })
            });
            // new spies
            expect(MashupPlatform.prefs.get).not.toHaveBeenCalled();
            expect(MashupPlatform.prefs.get('name')).toEqual('registered');
            expect(MashupPlatform.prefs.get).toHaveBeenCalled();
        });

        it("Reset calls with reset function", function () {
            var oldm = window.MashupPlatform;

            window.MashupPlatform = new MockMP.MockMP({
                'prefs.get': MockMP.strategy.dict({
                    'name': 'registered'
                })
            });

            // Now, we don't have the url, and the spy is new
            expect(MashupPlatform.prefs.get).not.toHaveBeenCalled();
            expect(MashupPlatform.prefs.get('name')).toEqual('registered');
            expect(MashupPlatform.prefs.get).toHaveBeenCalled();

            MashupPlatform.reset();

            // And test it with the new value of the strategy
            expect(MashupPlatform.prefs.get).not.toHaveBeenCalled();
            expect(MashupPlatform.prefs.get('name')).toEqual('registered');
            expect(MashupPlatform.prefs.get).toHaveBeenCalled();

            window.MashupPlatform = oldm;
        });

        it("let you reset one spy", function () {
            // set again the strategy
            MashupPlatform.setStrategy({
                'prefs.get': MockMP.strategy.dict({
                    'name': 'registered'
                })
            });
            // new spies
            expect(MashupPlatform.prefs.get).not.toHaveBeenCalled();
            expect(MashupPlatform.prefs.get('name')).toEqual('registered');
            expect(MashupPlatform.prefs.get).toHaveBeenCalled();

            MashupPlatform.prefs.get.calls.reset();
            // new spies
            expect(MashupPlatform.prefs.get).not.toHaveBeenCalled();
            expect(MashupPlatform.prefs.get('name')).toEqual('registered');
            expect(MashupPlatform.prefs.get).toHaveBeenCalled();
        });

        it("not crash if you delete default values", function () {
            expect(MashupPlatform.defaultValues).toEqual({});
            MashupPlatform.defaultValues = undefined;
            MashupPlatform.reset();
            expect(MashupPlatform.defaultValues).toEqual({});
        });
    });


    describe("Test strategies", function () {
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
        });

        it("test standalone constant strategy", function () {
            var mystr = MockMP.strategy.constant('mylog');

            expect(mystr()).toBe('mylog');
            expect(mystr('other')).toBe('mylog');
        });

        it("test standalone dict strategy", function () {
            var mydict = MockMP.strategy.dict({
                    'name': 'test',
                    'url': 'http://example.org'
            });


            expect(mydict('name')).toBe('test');
            expect(mydict('url')).toBe('http://example.org');
            expect(mydict('notexist')).toBeUndefined();
        });

        it("test standalone dict without object", function () {
            expect(MockMP.strategy.dict.bind(this, "test")).toThrowError(TypeError, 'dict must be an object');
        });

        it("test standalone exception strategy", function () {
            function TestException() {}
            expect(MockMP.strategy.exception(TestException)).toThrow();
        });

        it("test property", function () {
            MashupPlatform.setStrategy({
                'widget.id': 'myid'
            });

            expect(MashupPlatform.widget.id).toBe('myid');
        });


        it("test constant strategy", function () {
            MashupPlatform.setStrategy({
                'widget.log': MockMP.strategy.constant('mylog')
            });

            expect(MashupPlatform.widget.log()).toBe('mylog');
            expect(MashupPlatform.widget.log('other')).toBe('mylog');
        });

        it("test dict strategy", function () {
            MashupPlatform.setStrategy({
                'prefs.get': MockMP.strategy.dict({
                    'name': 'test',
                    'url': 'http://example.org'
                })
            });

            expect(MashupPlatform.prefs.get('name')).toBe('test');
            expect(MashupPlatform.prefs.get('url')).toBe('http://example.org');
            expect(MashupPlatform.prefs.get('notexist')).toBeUndefined();
        });

        it("test dict without object", function () {
            var excpf = function () {
                MashupPlatform.setStrategy({
                    'prefs.get': MockMP.strategy.dict("test")
                });
            };
            expect(excpf).toThrowError(TypeError, 'dict must be an object');
        });

        it("test exception strategy", function () {
            function TestException() {}
            MashupPlatform.setStrategy({
                'prefs.get':MockMP.strategy.exception(TestException)
            });
            expect(MashupPlatform.prefs.get).toThrow();
        });
    });

    describe('preferences test', function () {
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
        });

        it("Let you set preferences", function () {
            MashupPlatform.setStrategy({
                'prefs.get': MockMP.strategy.dict({}) // all undefined
            });
            expect(MashupPlatform.prefs.get('testvalue')).toBeUndefined();
            MashupPlatform.prefs.set('testvalue', 'newvalue');
            expect(MashupPlatform.prefs.get('testvalue')).toBe('newvalue');
        });

        it("Don't override other old preferences", function () {
            MashupPlatform.setStrategy({
                'prefs.get': MockMP.strategy.dict(
                    {'testvalue1': 1,
                     'testvalue2': 2}
                )
            });
            expect(MashupPlatform.prefs.get('testvalue1')).toBe(1);
            expect(MashupPlatform.prefs.get('testvalue2')).toBe(2);
            MashupPlatform.prefs.set('testvalue3', 3);
            expect(MashupPlatform.prefs.get('testvalue1')).toBe(1);
            expect(MashupPlatform.prefs.get('testvalue2')).toBe(2);
            expect(MashupPlatform.prefs.get('testvalue3')).toBe(3);
        });

        it("Return the new value and not old", function () {
            expect(MashupPlatform.prefs.get('testvalue')).toBe('value'); // default constant value
            MashupPlatform.prefs.set('testvalue', 'newvalue');
            expect(MashupPlatform.prefs.get('testvalue')).toBe('newvalue');
        });
    });

    describe('callbacks test', function () {
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
        });

        it("Don't call prefs callback before set", function () {
            var cb = jasmine.createSpy('cb');
            MashupPlatform.prefs.registerCallback(cb);
            expect(cb).not.toHaveBeenCalled();
        });

        it("callback must be a function", function () {
            expect(MashupPlatform.prefs.registerCallback.bind(MashupPlatform,'test', 123)).toThrowError(TypeError, 'callback must be a function');
        });

        it("Call prefs callback when set", function () {
            MashupPlatform.setStrategy({
                'prefs.get': MockMP.strategy.dict({
                    'test': 'value1'
                })
            });

            var cb = jasmine.createSpy('cb');
            MashupPlatform.prefs.registerCallback(cb);
            expect(MashupPlatform.prefs.get('test')).toBe('value1');
            expect(cb).not.toHaveBeenCalled();
            MashupPlatform.prefs.set('test', 'value2');
            expect(cb).toHaveBeenCalledWith({'test': 'value2'});
        });

        it("Preferences callback with object", function() {
            var cb = jasmine.createSpy('cb');
            MashupPlatform.prefs.registerCallback(cb);
            expect(cb).not.toHaveBeenCalled();

            MashupPlatform.simulateReceivePrefs({'test': 'value', 'test2': 'value2'});
            expect(cb).toHaveBeenCalledWith({'test': 'value', 'test2': 'value2'});
        });

        it("Preferences callback simulate only one value", function() {
            var cb = jasmine.createSpy('cb');
            MashupPlatform.prefs.registerCallback(cb);
            expect(cb).not.toHaveBeenCalled();

            MashupPlatform.simulateReceivePrefs('test', 'value');
            expect(cb).toHaveBeenCalledWith({'test': 'value'});
        });

        it("Wiring callback", function() {
            var cb = jasmine.createSpy('cb');
            MashupPlatform.wiring.registerCallback('testv', cb);
            expect(cb).not.toHaveBeenCalled();

            MashupPlatform.simulateReceiveEvent('testv', 'myvalue!');
            expect(cb).toHaveBeenCalledWith('myvalue!');
        });

        it("Don't call in other wiring event", function() {
            var cb = jasmine.createSpy('cb');
            MashupPlatform.wiring.registerCallback('testv', cb);
            expect(cb).not.toHaveBeenCalled();

            MashupPlatform.simulateReceiveEvent('othertestv', 'myvalue!');
            expect(cb).not.toHaveBeenCalled();

        });

        it("Don't call the callback if you remove all callbacks, but don't break :)", function() {
            var cb = jasmine.createSpy('cb');
            MashupPlatform.wiring.registerCallback('testv', cb);
            expect(cb).not.toHaveBeenCalled();

            delete MashupPlatform.callbacks;

            MashupPlatform.simulateReceiveEvent('testv', 'myvalue!');
            expect(cb).not.toHaveBeenCalled();

            MashupPlatform.wiring.registerCallback('testv', cb);
            expect(cb).not.toHaveBeenCalled();

            MashupPlatform.simulateReceiveEvent('testv', 'myvalue!');
            expect(cb).toHaveBeenCalledWith('myvalue!');
        });

        it("Widget callback with object", function() {
            var cb = jasmine.createSpy('cb');
            MashupPlatform.widget.context.registerCallback(cb);
            expect(cb).not.toHaveBeenCalled();

            MashupPlatform.simulateReceiveContext({'test': 'value', 'test2': 'value2'});
            expect(cb).toHaveBeenCalledWith({'test': 'value', 'test2': 'value2'});
        });

        it("Widget callback simulate only one value", function() {
            var cb = jasmine.createSpy('cb');
            MashupPlatform.widget.context.registerCallback(cb);
            expect(cb).not.toHaveBeenCalled();

            MashupPlatform.simulateReceiveContext('test', 'value');
            expect(cb).toHaveBeenCalledWith({'test': 'value'});
        });
    });
})();
