"use strict";

import Operator from "lib/vendor/Operator";


describe('Operator', () => {
    let operator;

    beforeEach(() => {
        operator = new Operator();
    });

    it('should have spies', () => {
        operator.log();
        expect(operator.log).toHaveBeenCalled();
        operator.createInputEndpoint(() => {});
        expect(operator.createInputEndpoint).toHaveBeenCalled();
        operator.createOutputEndpoint(() => {});
        expect(operator.createOutputEndpoint).toHaveBeenCalled();
    });

    it('should reset spies', () => {
        operator.log();
        expect(operator.log).toHaveBeenCalled();
        operator.createInputEndpoint(() => {});
        expect(operator.createInputEndpoint).toHaveBeenCalled();
        operator.createOutputEndpoint(() => {});
        expect(operator.createOutputEndpoint).toHaveBeenCalled();

        operator.reset();

        expect(operator.log).not.toHaveBeenCalled();
        expect(operator.createInputEndpoint).not.toHaveBeenCalled();
        expect(operator.createOutputEndpoint).not.toHaveBeenCalled();
    });


    it('should have context', () => {
        operator.context.setContext({
            test: 1
        });

        expect(operator.context.get("test")).toEqual(1);
        expect(operator.context.get).toHaveBeenCalled();
    });

    it('should set values that have reset', () => {
        expect(operator.id).toEqual("");
        operator.setId();
        expect(operator.id).toEqual("");
        operator.setId("123");
        expect(operator.id).toEqual("123");

        expect(operator.inputs).toEqual({});
        operator.setInputEndpoints(["1", "2"]);
        expect(operator.inputs).not.toEqual({});

        expect(operator.outputs).toEqual({});
        operator.setOutputEndpoints(["1", "2"]);
        expect(operator.outputs).not.toEqual({});

        operator.resetData();

        expect(operator.id).toEqual("");
        expect(operator.inputs).toEqual({});
        expect(operator.outputs).toEqual({});
    });

    it('should have default values', () => {
        operator = new Operator({}, {
            id: "123",
            inputs: ["1", "2"],
            outputs: ["3", "4"]
        });

        expect(operator.id).toEqual("123");
        expect(operator.inputs).not.toEqual({});
        expect(operator.outputs).not.toEqual({});

        operator.reset();
        operator.resetData();

        expect(operator.id).toEqual("123");
        expect(operator.inputs).not.toEqual({});
        expect(operator.outputs).not.toEqual({});
    });


});
