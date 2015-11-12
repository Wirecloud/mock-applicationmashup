"use strict";

import Wiring from "lib/vendor/Wiring";

describe("Wiring", () => {
    let wiring;

    beforeEach(() => {
        wiring = new Wiring();
        wiring.setInputEndpoints(["test", "test2"]);
        wiring.setOutputEndpoints(["test", "test2"]);
    });

    it("all spies setted", () => {
        wiring.pushEvent("test");
        expect(wiring.pushEvent).toHaveBeenCalled();
        wiring.hasInputConnections("test");
        expect(wiring.hasInputConnections).toHaveBeenCalled();
        wiring.hasOutputConnections("test");
        expect(wiring.hasOutputConnections).toHaveBeenCalled();
        wiring.registerStatusCallback(() => {});
        expect(wiring.registerStatusCallback).toHaveBeenCalled();
        wiring.registerCallback("test", () => {});
        expect(wiring.registerCallback).toHaveBeenCalled();
    });

    it('should reset the spies', () => {
        wiring.pushEvent("test");
        expect(wiring.pushEvent).toHaveBeenCalled();
        wiring.hasInputConnections("test");
        expect(wiring.hasInputConnections).toHaveBeenCalled();
        wiring.hasOutputConnections("test");
        expect(wiring.hasOutputConnections).toHaveBeenCalled();
        wiring.registerStatusCallback(() => {});
        expect(wiring.registerStatusCallback).toHaveBeenCalled();
        wiring.registerCallback("test", () => {});
        expect(wiring.registerCallback).toHaveBeenCalled();

        wiring.reset();

        expect(wiring.pushEvent).not.toHaveBeenCalled();
        expect(wiring.hasInputConnections).not.toHaveBeenCalled();
        expect(wiring.hasOutputConnections).not.toHaveBeenCalled();
        expect(wiring.registerStatusCallback).not.toHaveBeenCalled();
        expect(wiring.registerCallback).not.toHaveBeenCalled();
    });


    it("register", () => {
        const msg = "AAAAA";

        wiring.registerCallback("test", x => {
            expect(x).toEqual(msg);
        });
        wiring.simulate("test", msg);
    });

    it("Errors", () => {
        expect(() => {
            throw new wiring.EndpointTypeError();
        }).toThrowError(wiring.EndpointTypeError);

        expect(() => {
            throw new wiring.EndpointTypeError("msg");
        }).toThrowError(wiring.EndpointTypeError, "msg");

        expect(() => {
            throw new wiring.EndpointValueError();
        }).toThrowError(wiring.EndpointValueError);

        expect(() => {
            throw new wiring.EndpointValueError("msg");
        }).toThrowError(wiring.EndpointValueError, "msg");

        expect(() => {
            throw new wiring.EndpointDoesNotExistError();
        }).toThrowError(wiring.EndpointDoesNotExistError);

        expect(() => {
            throw new wiring.EndpointDoesNotExistError("msg");
        }).toThrowError(wiring.EndpointDoesNotExistError, "msg");
    });

    it('should have inputs working', () => {
        expect(wiring.hasInputConnections("test")).toBeFalsy();
        expect(wiring.hasInputConnections("test2")).toBeFalsy();
        wiring.connectInput("test");
        expect(wiring.hasInputConnections("test")).toBeTruthy();
        expect(wiring.hasInputConnections("test2")).toBeFalsy();
        wiring.disconnectInput("test");
        expect(wiring.hasInputConnections("test")).toBeFalsy();
        expect(wiring.hasInputConnections("test2")).toBeFalsy();
        wiring.disconnectInput("test2");
        wiring.disconnectInput("test2");
        wiring.disconnectInput("test2");
        wiring.connectInput("test2");
        expect(wiring.hasInputConnections("test")).toBeFalsy();
        expect(wiring.hasInputConnections("test2")).toBeTruthy();
    });

    it('should have outputs working', () => {
        expect(wiring.hasOutputConnections("test")).toBeFalsy();
        expect(wiring.hasOutputConnections("test2")).toBeFalsy();
        wiring.connectOutput("test");
        expect(wiring.hasOutputConnections("test")).toBeTruthy();
        expect(wiring.hasOutputConnections("test2")).toBeFalsy();
        wiring.disconnectOutput("test");
        expect(wiring.hasOutputConnections("test")).toBeFalsy();
        expect(wiring.hasOutputConnections("test2")).toBeFalsy();
        wiring.disconnectOutput("test2");
        wiring.disconnectOutput("test2");
        wiring.disconnectOutput("test2");
        wiring.connectOutput("test2");
        expect(wiring.hasOutputConnections("test")).toBeFalsy();
        expect(wiring.hasOutputConnections("test2")).toBeTruthy();
    });

    it('should call status calls', () => {
        const spy = jasmine.createSpy("test");

        wiring.registerStatusCallback(spy);

        expect(spy).not.toHaveBeenCalled();
        wiring.connectOutput("test");
        expect(spy).toHaveBeenCalled();

        spy.calls.reset();
        expect(spy).not.toHaveBeenCalled();
        wiring.connectInput("test");
        expect(spy).toHaveBeenCalled();

        spy.calls.reset();
        expect(spy).not.toHaveBeenCalled();
        wiring.disconnectInput("test");
        expect(spy).toHaveBeenCalled();

        spy.calls.reset();
        expect(spy).not.toHaveBeenCalled();
        wiring.disconnectOutput("test");
        expect(spy).toHaveBeenCalled();
    });

    it('should throw exceptions', () => {
        expect(() => wiring.hasInputConnections("undefined")).toThrowError(wiring.EndpointDoesNotExistError);
        expect(() => wiring.hasOutputConnections("undefined")).toThrowError(wiring.EndpointDoesNotExistError);
        expect(() => wiring.pushEvent("undefined", "")).toThrowError(wiring.EndpointDoesNotExistError);
        expect(() => wiring.registerCallback("undefined", () => {})).toThrowError(wiring.EndpointDoesNotExistError);

        expect(() => wiring.connectInput("undefined")).toThrowError(wiring.EndpointDoesNotExistError);
        expect(() => wiring.connectOutput("undefined")).toThrowError(wiring.EndpointDoesNotExistError);
        expect(() => wiring.disconnectInput("undefined")).toThrowError(wiring.EndpointDoesNotExistError);
        expect(() => wiring.disconnectOutput("undefined")).toThrowError(wiring.EndpointDoesNotExistError);

    });

    it('should not call if endpoint does not exist', () => {
        // Actually I think that there are not way to check this because doesn't do anything, just a side effect
        wiring.simulate("undefined", "");
    });

    it('should remove with reset', () => {
        expect(wiring.hasInputConnections("test")).toBeFalsy();
        expect(wiring.hasOutputConnections("test")).toBeFalsy();

        wiring.resetData();

        expect(() => wiring.hasInputConnections("test")).toThrowError(wiring.EndpointDoesNotExistError);
        expect(() => wiring.hasOutputConnections("test")).toThrowError(wiring.EndpointDoesNotExistError);
    });

    it('should not remove default data', () => {
        wiring.setDefaultInputEndpoints(["test", "test2"]);
        wiring.setDefaultOutputEndpoints(["test", "test2"]);

        expect(wiring.hasInputConnections("test")).toBeFalsy();
        expect(wiring.hasOutputConnections("test")).toBeFalsy();

        wiring.resetData();

        expect(() => wiring.hasInputConnections("test")).not.toThrowError(wiring.EndpointDoesNotExistError);
        expect(() => wiring.hasOutputConnections("test")).not.toThrowError(wiring.EndpointDoesNotExistError);
        expect(wiring.hasInputConnections("test")).toBeFalsy();
        expect(wiring.hasOutputConnections("test")).toBeFalsy();
    });
});
