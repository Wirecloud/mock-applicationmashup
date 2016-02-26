import Widget from "lib/vendor/Widget";

describe('Widget', () => {
    let widget;

    beforeEach(() => {
        widget = new Widget();
    });


    it('should have spies', () => {
        widget.log();
        expect(widget.log).toHaveBeenCalled();
        widget.drawAttention();
        expect(widget.drawAttention).toHaveBeenCalled();
        widget.getVariable("test");
        expect(widget.getVariable).toHaveBeenCalled();
        widget.createInputEndpoint(() => {});
        expect(widget.createInputEndpoint).toHaveBeenCalled();
        widget.createOutputEndpoint(() => {});
        expect(widget.createOutputEndpoint).toHaveBeenCalled();
    });

    it('should reset spies', () => {
        widget.log();
        expect(widget.log).toHaveBeenCalled();
        widget.drawAttention();
        expect(widget.drawAttention).toHaveBeenCalled();
        widget.getVariable("test");
        expect(widget.getVariable).toHaveBeenCalled();
        widget.createInputEndpoint(() => {});
        expect(widget.createInputEndpoint).toHaveBeenCalled();
        widget.createOutputEndpoint(() => {});
        expect(widget.createOutputEndpoint).toHaveBeenCalled();

        widget.reset();

        expect(widget.log).not.toHaveBeenCalled();
        expect(widget.drawAttention).not.toHaveBeenCalled();
        expect(widget.getVariable).not.toHaveBeenCalled();
        expect(widget.createInputEndpoint).not.toHaveBeenCalled();
        expect(widget.createOutputEndpoint).not.toHaveBeenCalled();
    });


    it('should have context', () => {
        widget.context.setContext({
            test: 1
        });

        expect(widget.context.get("test")).toEqual(1);
        expect(widget.context.get).toHaveBeenCalled();
    });

    it('should set dynamically variables', () => {
        const v = widget.getVariable("test");

        expect(v.get()).not.toBeDefined();

        v.set("test");

        expect(v.get()).toEqual("test");
        expect(widget.getVariable("test").get()).toEqual("test");
    });

    it('should set values that have reset', () => {
        expect(widget.id).toEqual("");
        widget.setId();
        expect(widget.id).toEqual("");
        widget.setId("123");
        expect(widget.id).toEqual("123");

        expect(widget.inputs).toEqual({});
        widget.setInputEndpoints(["1", "2"]);
        expect(widget.inputs).not.toEqual({});

        expect(widget.outputs).toEqual({});
        widget.setOutputEndpoints(["1", "2"]);
        expect(widget.outputs).not.toEqual({});

        expect(widget.getVariable("123").get()).not.toBeDefined();
        widget.setVariable("123", "value");
        expect(widget.getVariable("123").get()).toEqual("value");

        widget.resetData();

        expect(widget.id).toEqual("");
        expect(widget.inputs).toEqual({});
        expect(widget.outputs).toEqual({});
        expect(widget.getVariable("123").get()).not.toBeDefined();
    });

    it('should have default values', () => {
        widget = new Widget({}, {
            id: "123",
            inputs: ["1", "2"],
            outputs: ["3", "4"],
            variables: {
                test: "1"
            }
        });

        expect(widget.id).toEqual("123");
        expect(widget.inputs).not.toEqual({});
        expect(widget.outputs).not.toEqual({});
        expect(widget.getVariable("test").get()).toEqual("1");

        widget.reset();
        widget.resetData();

        expect(widget.id).toEqual("123");
        expect(widget.inputs).not.toEqual({});
        expect(widget.outputs).not.toEqual({});
        expect(widget.getVariable("test").get()).toEqual("1");
    });

});
