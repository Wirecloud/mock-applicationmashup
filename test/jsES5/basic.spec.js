/* globals MockMP, beforeAll */

(function () {

    "use strict";

    // Example widget
    var Widget = (function () {
        var W = function Widget() {
            this.prefs = {
                test1: MashupPlatform.prefs.get("test1")
            };
            this.data = "";

            MashupPlatform.prefs.registerCallback(function () {
                this.prefs = {
                    test1: MashupPlatform.prefs.get("test1")
                };
            }.bind(this));

            MashupPlatform.wiring.registerCallback('input', function(data) {
                this.data = data;
            }.bind(this));
        };
        return W;
    })();

    describe("Test ES5", function() {
        var widget;

        beforeAll(function() {
            window.MashupPlatform = new MockMP({
                prefs: {
                    test1: "a"
                },
                inputs: ["input"]
            });
        });

        beforeEach(function() {
            MashupPlatform.resetAll();
            widget = new Widget();
        });

        describe("exceptions", function () {

            it("MashupPlatform.wiring.EndpointValueError", function () {
                expect(new MashupPlatform.wiring.EndpointValueError())
                    .toEqual(jasmine.any(MashupPlatform.wiring.EndpointValueError));
            });

            it("MashupPlatform.wiring.EndpointTypeError", function () {
                expect(new MashupPlatform.wiring.EndpointTypeError())
                    .toEqual(jasmine.any(MashupPlatform.wiring.EndpointTypeError));
            });

            it("MashupPlatform.wiring.EndpointDoesNotExistError", function () {
                expect(new MashupPlatform.wiring.EndpointDoesNotExistError())
                    .toEqual(jasmine.any(MashupPlatform.wiring.EndpointDoesNotExistError));
            });

        });

        it("default values", function() {
            expect(widget.prefs).toEqual({
                test1: "a"
            });
            expect(widget.data).toEqual("");

            expect(MashupPlatform.widget.inputs.noinput).not.toBeDefined();
            expect(MashupPlatform.widget.inputs.input).toBeDefined();
        });

        it("reset pref values", function () {
            MashupPlatform.prefs.set("test1", "b");
            MashupPlatform.prefs.reset();

            expect(MashupPlatform.prefs.get("test1")).toBe("a");
        });

        it("simulate preferences", function() {
            MashupPlatform.wiring.simulate("input", "TESTDATA");
            expect(widget.data).toEqual("TESTDATA");
        });

        it("simulate wiring", function() {
            MashupPlatform.wiring.simulate("input", "TESTDATA");
            expect(widget.data).toEqual("TESTDATA");
        });

        it("simulate prefs", function() {
            MashupPlatform.prefs.simulate({
                test1: "newvalue"
            });
            expect(widget.prefs).toEqual({
                test1: "newvalue"
            });
        });
    });
})();
