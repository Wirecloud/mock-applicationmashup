import {SimpleCallback, MultipleCallback} from "lib/vendor/Callback";

describe("Callbacks", () => {
    describe("Simple", () => {
        let scall;

        beforeEach(() => {
            scall = new SimpleCallback();
            scall.setSpies();
        });

        it("one function, one value", () => {
            const value = "TEST";
            const c = jasmine.createSpy("c");

            scall.registerCallback(c);
            scall.simulate(value);
            expect(c).toHaveBeenCalledWith(value);
        });

        it("one function, more values", () => {
            const value1 = "TEST", value2 = 3, value3 = [1, 2, 3];
            const c = jasmine.createSpy("c");

            scall.registerCallback(c);
            scall.simulate(value1, value2, value3);
            expect(c).toHaveBeenCalledWith(value1, value2, value3);
        });

        it("more functions", () => {
            const value = "TESTVALUE";
            const c1 = jasmine.createSpy("c1");
            const c2 = jasmine.createSpy("c2");
            const c3 = jasmine.createSpy("c3");

            scall.registerCallback(c1);
            scall.registerCallback(c2);
            scall.registerCallback(c3);
            scall.simulate(value);

            expect(c1).toHaveBeenCalledWith(value);
            expect(c2).toHaveBeenCalledWith(value);
            expect(c3).toHaveBeenCalledWith(value);
        });
    });

    describe("Multiple", () => {
        let mcall;

        beforeEach(() => {
            mcall = new MultipleCallback();
            mcall.setSpies();
        });

        it("one value", () => {
            const value = "TEST";
            const c = jasmine.createSpy("c");

            mcall.registerCallback("test", c);
            mcall.simulate("test", value);
            expect(c).toHaveBeenCalledWith(value);
        });

        it("call other", () => {
            const value = "TEST";
            const c = jasmine.createSpy("c");
            const c2 = jasmine.createSpy("c2");

            mcall.registerCallback("test", c);
            mcall.simulate("test2", value);
            expect(c).not.toHaveBeenCalled();

            mcall.simulate("test2", value);
            mcall.registerCallback("test2", c2);
            expect(c).not.toHaveBeenCalled();
        });

        it("try callback not function", () => {
            mcall.registerCallback("test", undefined);
            mcall.registerCallback("test2", "test");
            mcall.registerCallback("test3", {});
            expect(mcall.calls).toEqual({});
        });

        it("More than one callback", () => {
            const value = 9711;
            const c = jasmine.createSpy("c");
            const c2 = jasmine.createSpy("c2");
            const c3 = jasmine.createSpy("c3");

            mcall.registerCallback("test", c);
            mcall.registerCallback("test", c2);
            mcall.registerCallback("test2", c3);
            mcall.simulate("test", value);
            expect(c).toHaveBeenCalledWith(value);
            expect(c2).toHaveBeenCalledWith(value);
            expect(c3).not.toHaveBeenCalled();
        });
    });
});
