"use strict";

import Context from "lib/vendor/Context";

describe("Context", () => {
    let ctx;

    beforeEach(() => {
        ctx = new Context();
    });

    it("spies", () => {
        ctx.get("");
        expect(ctx.get).toHaveBeenCalled();
        ctx.getAvailableContext();
        expect(ctx.getAvailableContext).toHaveBeenCalled();
        ctx.registerCallback(() => {});
        expect(ctx.registerCallback).toHaveBeenCalled();
    });

    it("default", () => {
        expect(ctx.get("test")).not.toBeDefined();
        expect(ctx.getAvailableContext()).toEqual({});
    });

    it("setting until reset", () => {
        ctx.setContext({
            test: 1
        });
        expect(ctx.get("test")).toEqual(1);
        ctx.resetData();
        expect(ctx.get("test")).not.toBeDefined();
    });

    it("default settings not reset", () => {
        ctx.setDefaultContext({
            test: 1
        });
        expect(ctx.get("test")).toEqual(1);
        ctx.resetData();
        expect(ctx.get("test")).toEqual(1);
    });
});
