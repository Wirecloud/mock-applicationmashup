"use strict";

import Endpoint from "lib/vendor/Endpoint";

describe('Endpoint', () => {
    let endpoint;

    beforeEach(() => {
        endpoint = new Endpoint();
    });

    it('should have spies', () => {
        endpoint.connect();
        expect(endpoint.connect).toHaveBeenCalled();
        endpoint.disconnect();
        expect(endpoint.disconnect).toHaveBeenCalled();
        endpoint.pushEvent();
        expect(endpoint.pushEvent).toHaveBeenCalled();

        endpoint.reset();

        expect(endpoint.connect).not.toHaveBeenCalled();
        expect(endpoint.disconnect).not.toHaveBeenCalled();
        expect(endpoint.pushEvent).not.toHaveBeenCalled();
    });

    it('should connect and disconnnect from one', () => {
        const other = new Endpoint();

        expect(endpoint.connected).toBeFalsy();
        endpoint.connect(other);
        expect(endpoint.connected).toBeTruthy();

        endpoint.disconnect(other);
        expect(endpoint.connected).toBeFalsy();
    });

    it('should connect and disconnnect from many', () => {
        const other = new Endpoint();
        const other2 = new Endpoint();
        const other3 = new Endpoint();
        const other4 = new Endpoint();

        expect(endpoint.connected).toBeFalsy();
        endpoint.connect(other);
        endpoint.connect(other2);
        endpoint.connect(other3);
        endpoint.connect(other4);
        expect(endpoint.connected).toBeTruthy();

        endpoint.disconnect();
        expect(endpoint.connected).toBeFalsy();
    });

    it('should register and get event simulated in connections', () => {
        const other = new Endpoint();
        const f = jasmine.createSpy("simulated");

        other.registerCallback(f);
        endpoint.connect(other);
        endpoint.pushEvent("TEST");

        expect(f).toHaveBeenCalledWith("TEST");

        f.calls.reset();

        endpoint.disconnect();
        endpoint.pushEvent("TEST2");
        expect(f).not.toHaveBeenCalled();
    });

});
