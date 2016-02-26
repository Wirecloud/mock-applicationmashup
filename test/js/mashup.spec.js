import Mashup from "lib/vendor/Mashup";

describe('Mashup', () => {
    let mashup;

    beforeEach(() => {
        mashup = new Mashup();
    });

    it('should have spies', () => {
        mashup.addWidget("");
        expect(mashup.addWidget).toHaveBeenCalled();
        mashup.addOperator("");
        expect(mashup.addOperator).toHaveBeenCalled();
        mashup.createWorkspace();
        expect(mashup.createWorkspace).toHaveBeenCalled();
    });

    it('should reset the calls', () => {
        mashup.addWidget("", {});
        expect(mashup.addWidget).toHaveBeenCalled();
        mashup.addOperator("", {});
        expect(mashup.addOperator).toHaveBeenCalled();
        mashup.createWorkspace();
        expect(mashup.createWorkspace).toHaveBeenCalled();

        mashup.reset();
        expect(mashup.addWidget).not.toHaveBeenCalled();
        expect(mashup.addOperator).not.toHaveBeenCalled();
        expect(mashup.createWorkspace).not.toHaveBeenCalled();
    });

    it('should reset the data', () => {
        mashup.context.setContext({
            test: 1
        });
        expect(mashup.context.get("test")).toEqual(1);
        mashup.resetData();
        expect(mashup.context.get("test")).not.toBeDefined();
    });


    it('should have context', () => {
        // Context are tested in his own tests
        expect(mashup.context).toBeDefined();
    });

    it('should create widget with default options', () => {
        const widg = mashup.addWidget("", {});

        expect(widg.id).toEqual("");
        expect(widg.inputs).toEqual({});
        expect(widg.outputs).toEqual({});
    });

    it('should create operator with default options', () => {
        const op = mashup.addOperator("", {});

        expect(op.id).toEqual("");
        expect(op.inputs).toEqual({});
        expect(op.outputs).toEqual({});
    });

    it('should let add extra options to widget', () => {
        mashup.addWidget.configure = {
            id: "tid",
            inputs: ["test1", "test2"],
            outputs: ["test3", "test4"]
        };
        const widg = mashup.addWidget("", {});

        expect(widg.id).toEqual("tid");
        expect(widg.inputs.test1).toBeDefined();
        expect(widg.inputs.test2).toBeDefined();
        expect(widg.inputs.test3).not.toBeDefined();
        expect(widg.inputs.test4).not.toBeDefined();

        expect(widg.outputs.test1).not.toBeDefined();
        expect(widg.outputs.test2).not.toBeDefined();
        expect(widg.outputs.test3).toBeDefined();
        expect(widg.outputs.test4).toBeDefined();
    });

    it('should let add extra options to operator', () => {
        mashup.addOperator.configure = {
            id: "tid",
            inputs: ["test1", "test2"],
            outputs: ["test3", "test4"]
        };
        const op = mashup.addOperator("", {});

        expect(op.id).toEqual("tid");
        expect(op.inputs.test1).toBeDefined();
        expect(op.inputs.test2).toBeDefined();
        expect(op.inputs.test3).not.toBeDefined();
        expect(op.inputs.test4).not.toBeDefined();

        expect(op.outputs.test1).not.toBeDefined();
        expect(op.outputs.test2).not.toBeDefined();
        expect(op.outputs.test3).toBeDefined();
        expect(op.outputs.test4).toBeDefined();
    });
});
