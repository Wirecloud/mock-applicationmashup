import MockMP from "lib/vendor/MockMP";

describe("MockMP", () => {
    describe("http", () => {
        let MashupPlatform;

        beforeEach(() => {
            MashupPlatform = new MockMP();
        });

        it("build proxy URL", () => {
            expect(MashupPlatform.http.buildProxyURL("https")).toEqual("https");
        });
    });

    describe('log', () => {
        let MashupPlatform;

        beforeEach(() => {
            MashupPlatform = new MockMP();
        });

        it('should be different', () => {
            expect(MashupPlatform.log.ERROR).not.toEqual(MashupPlatform.log.WARN);
            expect(MashupPlatform.log.ERROR).not.toEqual(MashupPlatform.log.INFO);
            expect(MashupPlatform.log.WARN).not.toEqual(MashupPlatform.log.INFO);
        });
    });

    describe('preferences', () => {
        let MashupPlatform;

        beforeEach(() => {
            MashupPlatform = new MockMP();
        });

        it('should have good behaviour', () => {
            const f = jasmine.createSpy("prefs call");

            expect(() =>
                   MashupPlatform.prefs.get("test"))
                .toThrowError(Error, "Preference test does not exist");
            // .toThrowError(MashupPlatform.prefs.PreferenceDoesNotExistError, "Preference test does not exist");
            MashupPlatform.prefs.set("test", "value");
            expect(MashupPlatform.prefs.get("test")).toEqual("value");

            MashupPlatform.prefs.registerCallback(f);
            expect(f).not.toHaveBeenCalled();
            MashupPlatform.prefs.simulate({test2: "value2"}); // Simulate external changes
            expect(f).toHaveBeenCalledWith({test2: "value2"});
        });

    });

    describe('Mashup', () => {
        let MashupPlatform;

        beforeEach(() => {
            MashupPlatform = new MockMP();
        });

        it('should have context', () => {
            // Context are tested in his own tests
            expect(MashupPlatform.mashup.context).toBeDefined();
        });

        it('should have defined the methods', () => {
            expect(MashupPlatform.mashup.addWidget).toBeDefined();
            expect(MashupPlatform.mashup.addOperator).toBeDefined();
            expect(MashupPlatform.mashup.createWorkspace).toBeDefined();
        });
    });

    describe('Wiring', () => {
        let MashupPlatform;

        beforeEach(() => {
            MashupPlatform = new MockMP();
        });

        it('should have the exceptions', () => {
            expect(() => {
                throw new MashupPlatform.wiring.EndpointTypeError();
            }).toThrowError(Error);
            // }).toThrowError(MashupPlatform.wiring.EndpointTypeError);

            expect(() => {
                throw new MashupPlatform.wiring.EndpointValueError();
            }).toThrowError(Error);
            // }).toThrowError(MashupPlatform.wiring.EndpointValueError);

            expect(() => {
                throw new MashupPlatform.wiring.EndpointDoesNotExistError();
            }).toThrowError(Error);
            // }).toThrowError(MashupPlatform.wiring.EndpointDoesNotExistError);
        });


        it('should have defined the methods', () => {
            expect(MashupPlatform.wiring).toBeDefined();
            expect(MashupPlatform.wiring.hasInputConnections).toBeDefined();
            expect(MashupPlatform.wiring.hasOutputConnections).toBeDefined();
            expect(MashupPlatform.wiring.pushEvent).toBeDefined();
            expect(MashupPlatform.wiring.registerCallback).toBeDefined();
            expect(MashupPlatform.wiring.registerStatusCallback).toBeDefined();
        });
    });

    describe('Reset values', () => {
        let MP;

        beforeEach(() => {
            MP = new MockMP();
        });

        it('should not have operator if widget and viceversa', () => {
            expect(MP.widget).toBeDefined();
            expect(MP.operator).not.toBeDefined();

            MP = new MockMP({
                type: "operator"
            });
            expect(MP.widget).not.toBeDefined();
            expect(MP.operator).toBeDefined();
        });

        it('should call reset to spies', () => {
            MP.context.get("123");
            MP.widget.drawAttention();

            expect(MP.context.get).toHaveBeenCalled();
            expect(MP.widget.drawAttention).toHaveBeenCalled();

            MP.reset();

            expect(MP.context.get).not.toHaveBeenCalled();
            expect(MP.widget.drawAttention).not.toHaveBeenCalled();
        });

        it('should call resetData', () => {
            MP.context.setContext({test: "123"});
            expect(MP.context.get("test")).toEqual("123");

            MP.resetData();

            expect(MP.context.get("test")).not.toBeDefined();
        });

        it('should reset spies and data', () => {
            MP.context.get("123");
            MP.widget.drawAttention();

            expect(MP.context.get).toHaveBeenCalled();
            expect(MP.widget.drawAttention).toHaveBeenCalled();

            MP.context.setContext({test: "123"});
            expect(MP.context.get("test")).toEqual("123");

            MP.resetAll();

            expect(MP.context.get).not.toHaveBeenCalled();
            expect(MP.widget.drawAttention).not.toHaveBeenCalled();
            expect(MP.context.get("test")).not.toBeDefined();
        });

        it('should get default values on constructor', () => {
            MP.wiring.setInputEndpoints(["test1", "test2"]);
            MP.wiring.setOutputEndpoints(["test3", "test4"]);
            MP.prefs.setPreferences({
                pref1: "val1"
            });
            MP.context.setContext({
                test: "value2"
            });

            expect(MP.wiring.hasInputConnections("test1")).toBeFalsy();
            expect(MP.wiring.hasInputConnections("test2")).toBeFalsy();
            expect(MP.wiring.hasOutputConnections("test3")).toBeFalsy();
            expect(MP.wiring.hasOutputConnections("test4")).toBeFalsy();
            expect(MP.prefs.get("pref1")).toEqual("val1");
            expect(MP.context.get("test")).toEqual("value2");

            MP.resetAll();

            expect(() => MP.wiring.hasInputConnections("test1")).toThrow();
            expect(() => MP.wiring.hasInputConnections("test2")).toThrow();
            expect(() => MP.wiring.hasOutputConnections("test3")).toThrow();
            expect(() => MP.wiring.hasOutputConnections("test4")).toThrow();
            expect(() => MP.prefs.get("pref1")).toThrow();
            expect(MP.context.get("test")).not.toBeDefined();

            MP = new MockMP({
                inputs: ["test1", "test2"],
                outputs: ["test3", "test4"],
                prefs: {
                    pref1: "val1"
                },
                context: {
                    test: "value2"
                }
            });

            expect(MP.wiring.hasInputConnections("test1")).toBeFalsy();
            expect(MP.wiring.hasInputConnections("test2")).toBeFalsy();
            expect(MP.wiring.hasOutputConnections("test3")).toBeFalsy();
            expect(MP.wiring.hasOutputConnections("test4")).toBeFalsy();
            expect(MP.prefs.get("pref1")).toEqual("val1");
            expect(MP.context.get("test")).toEqual("value2");

            MP.resetAll();

            expect(MP.wiring.hasInputConnections("test1")).toBeFalsy();
            expect(MP.wiring.hasInputConnections("test2")).toBeFalsy();
            expect(MP.wiring.hasOutputConnections("test3")).toBeFalsy();
            expect(MP.wiring.hasOutputConnections("test4")).toBeFalsy();
            expect(MP.prefs.get("pref1")).toEqual("val1");
            expect(MP.context.get("test")).toEqual("value2");
        });
    });
});
