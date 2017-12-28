import Preferences from "lib/vendor/Preferences";

describe("Preferences", () => {
    let prefs;

    beforeEach(() => {
        prefs = new Preferences();
    });

    it("spies", () => {
        prefs.setPreferences({"": ""});
        prefs.get("");
        expect(prefs.get).toHaveBeenCalled();
        prefs.set("a", "b");
        expect(prefs.set).toHaveBeenCalled();
        prefs.registerCallback(() => {});
        expect(prefs.registerCallback).toHaveBeenCalled();
    });

    it('should reset spies', () => {
        prefs.setPreferences({"": ""});
        prefs.get("");
        expect(prefs.get).toHaveBeenCalled();
        prefs.set("a", "b");
        expect(prefs.set).toHaveBeenCalled();
        prefs.registerCallback(() => {});
        expect(prefs.registerCallback).toHaveBeenCalled();

        prefs.reset();

        expect(prefs.get).not.toHaveBeenCalled();
        expect(prefs.set).not.toHaveBeenCalled();
        expect(prefs.registerCallback).not.toHaveBeenCalled();
    });


    it("default throw error!", () => {
        expect(() => prefs.get("test")).toThrowError(prefs.PreferenceDoesNotExistError, "Preference test does not exist");
        // expect(prefs.get("test")).not.toBeDefined();
    });

    it("set & get", () => {
        prefs.set("test", "value");
        expect(prefs.get("test")).toEqual("value");
    });

    it("is callback too", () => {
        const value = {
            test: 2,
            test2: 3
        };
        const c = jasmine.createSpy("c");

        prefs.registerCallback(c);
        prefs.simulate(value);
        expect(c).toHaveBeenCalledWith(value);
    });

    it('should let set preferences', () => {
        expect(() => prefs.get("hola")).toThrowError(prefs.PreferenceDoesNotExistError, "Preference hola does not exist");
        prefs.setPreferences({
            hola: "test"
        });
        expect(prefs.get("hola")).toEqual("test");

        prefs.resetData();

        expect(() => prefs.get("hola")).toThrowError(prefs.PreferenceDoesNotExistError, "Preference hola does not exist");
    });

    it('should let set default preferences', () => {
        expect(() => prefs.get("hola")).toThrowError(prefs.PreferenceDoesNotExistError, "Preference hola does not exist");
        prefs.setDefaultPreferences({
            hola: "test"
        });
        expect(prefs.get("hola")).toEqual("test");

        prefs.resetData();

        expect(prefs.get("hola")).toEqual("test");
    });

});
